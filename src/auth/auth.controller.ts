import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SendVerificationCodeResponseDto } from './dto/send-verification-code-response.dto';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyCodeResponseDto } from './dto/verify-code-response.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { AuthType } from './enums/auth-type.enum';

@ApiTags('authentication')
@Auth(AuthType.None)
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Send Verification Code' })
    @ApiBadRequestResponse({ description: 'If mobile no is invalid then cannot send OTP' })
    @ApiOkResponse({ type: SendVerificationCodeResponseDto })
    @HttpCode(HttpStatus.OK)
    @Post('send-verification-code')
    sendVerificationCode(@Body() sendVerificationCodeDto: SendVerificationCodeDto) {
        return this.authService.sendVerificationCode(sendVerificationCodeDto);
    }

    @ApiOperation({ summary: 'Verify Code' })
    @ApiBadRequestResponse({ description: 'If given mobile no or code are invalid then cannot verify' })
    @ApiOkResponse({ type: VerifyCodeResponseDto })
    @HttpCode(HttpStatus.OK)
    @Post('verify-code')
    verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
        return this.authService.verifyCode(verifyCodeDto);
    }

    @ApiOperation({ summary: 'Signnup' })
    @ApiBadRequestResponse({ description: 'Upon any data validation failed' })
    @ApiConflictResponse({ description: 'If provided mobile no or emaail already being used by any other user' })
    @ApiOkResponse({ type: SignupResponseDto })
    @Post('signup')
    signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @HttpCode(HttpStatus.OK)
    @ApiUnauthorizedResponse({ description: 'If refresh token is invalid or expired' })
    @ApiOkResponse({ type: RefreshTokenResponseDto })
    @Post('refresh-tokens')
    refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto);
    }
}
