import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('send-verification-code')
    sendVerificationCode(@Body() sendVerificationCodeDto: SendVerificationCodeDto) {
        return this.authService.sendVerificationCode(sendVerificationCodeDto);
    }

    @Post('verify-code')
    verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
        return this.authService.verifyCode(verifyCodeDto);
    }

    @Post('signup')
    signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }
}
