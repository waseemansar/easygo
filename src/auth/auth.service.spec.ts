import { BadRequestException, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { TwilioError } from '../twilio/errors/twilio.error';
import { TwilioService } from '../twilio/twilio.service';
import { AuthService } from './auth.service';
import { jwtConfig } from './config/jwt.config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

class MockTwilioService {
    sendVerificationCode = jest.fn();
    verifyCode = jest.fn();
}

class MockJwtService {
    signAsync = jest.fn();
    verifyAsync = jest.fn();
}

class MockPrismaService {
    user = {
        findUnique: jest.fn(),
        create: jest.fn(),
    };
    refreshToken = {
        findUnique: jest.fn(),
        delete: jest.fn(),
        upsert: jest.fn(),
    };
}

const mockJwtConfig: ConfigType<typeof jwtConfig> = {
    secret: 'mockSecret',
    audience: 'mockAudience',
    issuer: 'mockIssuer',
    accessTokenTtl: 3600,
    refreshTokenTtl: 86400,
};

describe('AuthService', () => {
    let service: AuthService;
    let twilioService: TwilioService;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: jwtConfig.KEY,
                    useValue: mockJwtConfig,
                },
                {
                    provide: JwtService,
                    useClass: MockJwtService,
                },
                {
                    provide: TwilioService,
                    useClass: MockTwilioService,
                },
                {
                    provide: PrismaService,
                    useClass: MockPrismaService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        twilioService = module.get<TwilioService>(TwilioService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendVerificationCode', () => {
        it('should send verification code', async () => {
            const sendVerificationCodeDto = { mobile: '+971501234567' };
            const expectedResult = { message: 'Verification code has been sent' };

            (twilioService.sendVerificationCode as jest.Mock).mockImplementation(() => Promise.resolve());

            const result = await service.sendVerificationCode(sendVerificationCodeDto);

            expect(twilioService.sendVerificationCode).toHaveBeenCalledWith(sendVerificationCodeDto.mobile);
            expect(result).toEqual(expectedResult);
        });

        it('should throw "BadRequestException" if mobile no is not valid', async () => {
            const sendVerificationCodeDto = { mobile: 'invalid' };

            (twilioService.sendVerificationCode as jest.Mock).mockRejectedValue(new TwilioError());
            try {
                await service.sendVerificationCode(sendVerificationCodeDto);
            } catch (error) {
                expect(twilioService.sendVerificationCode).toHaveBeenCalledWith(sendVerificationCodeDto.mobile);
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });

        it('should throw "InternalServerErrorException" if an unexpected error occurs', async () => {
            const sendVerificationCodeDto = { mobile: '+971501234567' };

            (twilioService.sendVerificationCode as jest.Mock).mockRejectedValue(new Error());

            try {
                await service.sendVerificationCode(sendVerificationCodeDto);
            } catch (error) {
                expect(twilioService.sendVerificationCode).toHaveBeenCalledWith(sendVerificationCodeDto.mobile);
                expect(error).toBeInstanceOf(InternalServerErrorException);
            }
        });
    });

    describe('verifyCode', () => {
        it('should verify code and return tokens if user already exists', async () => {
            const verifyCodeDto: VerifyCodeDto = { mobile: '+971501234567', code: '123456' };
            const user = { id: 'clsglux7p00002mkn8sgy1okq', email: 'test@example.com' };
            const expectedResult = { accessToken: 'access_token', refreshToken: 'refresh_token' };

            (twilioService.verifyCode as jest.Mock).mockResolvedValue(true);
            (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);
            service['generateTokens'] = jest.fn().mockResolvedValue(expectedResult);

            const result = await service.verifyCode(verifyCodeDto);

            expect(result).toEqual(expectedResult);
            expect(twilioService.verifyCode).toHaveBeenCalledWith(verifyCodeDto.mobile, verifyCodeDto.code);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { mobile: verifyCodeDto.mobile } });
            expect(service['generateTokens']).toHaveBeenCalledWith(user);
        });

        it('should verify code and return tokens as null if user does not exists', async () => {
            const verifyCodeDto: VerifyCodeDto = { mobile: '+971501234567', code: '123456' };
            const user = null;
            const expectedResult = { accessToken: null, refreshToken: null };

            (twilioService.verifyCode as jest.Mock).mockResolvedValue(true);
            (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);
            service['generateTokens'] = jest.fn().mockResolvedValue(expectedResult);

            const result = await service.verifyCode(verifyCodeDto);

            expect(result).toEqual(expectedResult);
            expect(twilioService.verifyCode).toHaveBeenCalledWith(verifyCodeDto.mobile, verifyCodeDto.code);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { mobile: verifyCodeDto.mobile } });
            expect(service['generateTokens']).toHaveBeenCalledWith();
        });

        it('should throw "BadRequestException" if code is invalid', async () => {
            const verifyCodeDto: VerifyCodeDto = { mobile: '+971501234567', code: 'invalid' };

            (twilioService.verifyCode as jest.Mock).mockResolvedValue(false);

            try {
                await service.verifyCode(verifyCodeDto);
            } catch (error) {
                expect(twilioService.verifyCode).toHaveBeenCalledWith(verifyCodeDto.mobile, verifyCodeDto.code);
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('Cannot verify, check if given mobile no and code are valid');
            }
        });

        it('should throw "InternalServerErrorException" if an unexpected error occurs', async () => {
            const verifyCodeDto: VerifyCodeDto = { mobile: '+971501234567', code: '123456' };

            (twilioService.verifyCode as jest.Mock).mockRejectedValue(new Error());

            try {
                await service.verifyCode(verifyCodeDto);
            } catch (error) {
                expect(twilioService.verifyCode).toHaveBeenCalledWith(verifyCodeDto.mobile, verifyCodeDto.code);
                expect(error).toBeInstanceOf(InternalServerErrorException);
            }
        });
    });

    describe('signup', () => {
        it('should sign up', async () => {
            const signupDto: SignupDto = { email: 'test@example.com', mobile: '+971501234567', name: 'Test Name' };
            const expectedResult = {
                id: 'clsglux7p00002mkn8sgy1okq',
                ...signupDto,
                createdAt: '2024-02-10T22:14:29.241Z',
                updatedAt: '2024-02-10T22:14:29.241Z',
            };

            (prismaService.user.create as jest.Mock).mockResolvedValue(expectedResult);

            const result = await service.signup(signupDto);

            expect(prismaService.user.create).toHaveBeenCalledWith({ data: signupDto });
            expect(result).toEqual(expectedResult);
        });

        it('should throw "BadRequestException" if validation error occurs', async () => {
            const signupDto = {} as SignupDto;

            (prismaService.user.create as jest.Mock).mockRejectedValue(new PrismaClientValidationError('', { clientVersion: '' }));

            try {
                await service.signup(signupDto);
            } catch (error) {
                expect(prismaService.user.create).toHaveBeenCalledWith({ data: signupDto });
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });

        it('should throw "ConflictException" if email or mobile already exists', async () => {
            const signupDto: SignupDto = { email: 'test@example.com', mobile: '+971501234567', name: 'Test Name' };

            (prismaService.user.create as jest.Mock).mockRejectedValue(
                new PrismaClientKnownRequestError('Email or mobile no already exists', { code: 'P2002', clientVersion: '' }),
            );

            try {
                await service.signup(signupDto);
            } catch (error) {
                expect(prismaService.user.create).toHaveBeenCalledWith({ data: signupDto });
                expect(error).toBeInstanceOf(ConflictException);
                expect(error.message).toBe('Email or mobile no already exists');
            }
        });

        it('should throw "InternalServerErrorException" if an unexpected error occurs', async () => {
            const signupDto = {} as SignupDto;

            (prismaService.user.create as jest.Mock).mockRejectedValue(new Error('Some unexpected error'));

            try {
                await service.signup(signupDto);
            } catch (error) {
                expect(prismaService.user.create).toHaveBeenCalledWith({ data: signupDto });
                expect(error).toBeInstanceOf(InternalServerErrorException);
            }
        });
    });

    describe('refreshTokens', () => {
        it('should refresh tokens and return new tokens', async () => {
            const refreshTokenDto: RefreshTokenDto = { refreshToken: 'valid_refresh_token' };
            const userId = 'clsglux7p00002mkn8sgy1okq';
            const refreshTokenId = 'clsglux7p00002mkn8sgy1ofg';
            const user = {
                id: userId,
                name: 'Test Name',
                mobile: '+971501234567',
                email: 'test@example.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const existingToken = { id: refreshTokenId, userId: userId };
            const expectedResult = { accessToken: 'new_access_token', refreshToken: 'new_refresh_token' };

            jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: userId, refreshTokenId });
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
            jest.spyOn(prismaService.refreshToken, 'findUnique').mockResolvedValue(existingToken);
            jest.spyOn(prismaService.refreshToken, 'delete').mockResolvedValue(existingToken);
            service['generateTokens'] = jest.fn().mockResolvedValue(expectedResult);

            const result = await service.refreshTokens(refreshTokenDto);

            expect(result).toEqual(expectedResult);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(refreshTokenDto.refreshToken, expect.any(Object));
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
            expect(prismaService.refreshToken.findUnique).toHaveBeenCalledWith({ where: { id: refreshTokenId, userId } });
            expect(prismaService.refreshToken.delete).toHaveBeenCalledWith({ where: { id: refreshTokenId } });
        });

        it('should throw "UnauthorizedException" if user not found', async () => {
            const refreshTokenDto: RefreshTokenDto = { refreshToken: 'valid_refresh_token' };
            jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: 'user_id', refreshTokenId: 'refresh_token_id' });
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

            try {
                await service.refreshTokens(refreshTokenDto);
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedException);
                expect(jwtService.verifyAsync).toHaveBeenCalledWith(refreshTokenDto.refreshToken, expect.any(Object));
                expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user_id' } });
            }
        });

        it('should throw "UnauthorizedException" if refresh token is invalid', async () => {
            const refreshTokenDto: RefreshTokenDto = { refreshToken: 'invalid_refresh_token' };
            jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Invalid token'));

            try {
                await service.refreshTokens(refreshTokenDto);
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedException);
                expect(jwtService.verifyAsync).toHaveBeenCalledWith(refreshTokenDto.refreshToken, expect.any(Object));
            }
        });

        it('should throw "UnauthorizedException" if refresh token is not found in the database', async () => {
            const refreshTokenDto: RefreshTokenDto = { refreshToken: 'valid_refresh_token' };
            const user = {
                id: 'user_id',
                name: 'Test Name',
                mobile: '+971501234567',
                email: 'test@example.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: 'user_id', refreshTokenId: 'refresh_token_id' });
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
            jest.spyOn(prismaService.refreshToken, 'findUnique').mockResolvedValue(null);

            try {
                await service.refreshTokens(refreshTokenDto);
            } catch (error) {
                expect(error.message).toBe('Refresh token is invalid');
                expect(error).toBeInstanceOf(UnauthorizedException);
                expect(jwtService.verifyAsync).toHaveBeenCalledWith(refreshTokenDto.refreshToken, expect.any(Object));
                expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user_id' } });
            }
        });
    });
});
