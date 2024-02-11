import { User } from '.prisma/client';
import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { TwilioError } from '../twilio/errors/twilio.error';
import { TwilioService } from '../twilio/twilio.service';
import { jwtConfig } from './config/jwt.config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { InvalidRefreshTokenError } from './errors/invalid-refresh-token.error';
import { ActiveUserData } from './interfaces/active-user-data.interface';

@Injectable()
export class AuthService {
    constructor(
        @Inject(jwtConfig.KEY) private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly twilioService: TwilioService,
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async sendVerificationCode(sendVerificationCodeDto: SendVerificationCodeDto) {
        try {
            await this.twilioService.sendVerificationCode(sendVerificationCodeDto.mobile);
            return { message: 'Verification code has been sent' };
        } catch (error) {
            if (error instanceof TwilioError) {
                throw new BadRequestException('Cannot send verification code, please make sure mobile no is valid');
            }

            throw new InternalServerErrorException();
        }
    }

    async verifyCode(verifyCodeDto: VerifyCodeDto) {
        try {
            const isValid = await this.twilioService.verifyCode(verifyCodeDto.mobile, verifyCodeDto.code);
            if (isValid) {
                const user = await this.prismaService.user.findUnique({ where: { mobile: verifyCodeDto.mobile } });
                if (user) {
                    return this.generateTokens(user);
                }

                return this.generateTokens();
            }

            throw new TwilioError();
        } catch (error) {
            if (error instanceof TwilioError) {
                throw new BadRequestException('Cannot verify, check if given mobile no and code are valid');
            }

            throw new InternalServerErrorException();
        }
    }

    async signup(signupDto: SignupDto) {
        try {
            const user = await this.prismaService.user.create({
                data: {
                    ...signupDto,
                },
            });

            return user;
        } catch (error) {
            if (error instanceof PrismaClientValidationError) {
                throw new BadRequestException();
            } else if (error instanceof PrismaClientKnownRequestError) {
                throw new BadRequestException('Email or mobile no already exists');
            }

            throw new InternalServerErrorException('Cannot signup');
        }
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        try {
            const { sub, refreshTokenId } = await this.jwtService.verifyAsync<Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }>(
                refreshTokenDto.refreshToken,
                {
                    secret: this.jwtConfiguration.secret,
                    audience: this.jwtConfiguration.audience,
                    issuer: this.jwtConfiguration.issuer,
                },
            );

            const user = await this.prismaService.user.findUnique({ where: { id: sub } });
            if (user == null) {
                throw new NotFoundException();
            }

            const existingTokenn = await this.prismaService.refreshToken.findUnique({ where: { id: refreshTokenId, userId: user.id } });
            if (existingTokenn) {
                await this.prismaService.refreshToken.delete({ where: { id: refreshTokenId } });
            } else {
                throw new InvalidRefreshTokenError('Refresh token is invalid');
            }

            return this.generateTokens(user);
        } catch (error) {
            if (error instanceof InvalidRefreshTokenError) {
                throw new UnauthorizedException(error.message);
            }

            throw new UnauthorizedException();
        }
    }

    private async generateTokens(user?: User) {
        if (user) {
            const { id: refreshTokenId } = await this.prismaService.refreshToken.upsert({
                where: { userId: user.id },
                update: {},
                create: { userId: user.id },
            });

            const [accessToken, refreshToken] = await Promise.all([
                this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTtl, {
                    email: user.email,
                }),
                this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, { refreshTokenId }),
            ]);

            return {
                accessToken,
                refreshToken,
            };
        } else {
            return {
                accessToken: null,
                refreshToken: null,
            };
        }
    }

    private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync(
            {
                sub: userId,
                ...payload,
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn,
            },
        );
    }
}
