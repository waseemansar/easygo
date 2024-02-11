import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { AuthType } from './enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('send-verification-code')
    sendVerificationCode(@Body() sendVerificationCodeDto: SendVerificationCodeDto) {
        return this.authService.sendVerificationCode(sendVerificationCodeDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('verify-code')
    verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
        return this.authService.verifyCode(verifyCodeDto);
    }

    @Post('signup')
    signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh-tokens')
    refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto);
    }
}
