import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from './config/jwt.config';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Injectable()
export class AuthService {
    constructor(@Inject(jwtConfig.KEY) private readonly jwtConfiguration: ConfigType<typeof jwtConfig>) {}

    sendVerificationCode(sendVerificationCodeDto: SendVerificationCodeDto) {
        return sendVerificationCodeDto;
    }

    verifyCode(verifyCodeDto: VerifyCodeDto) {
        return verifyCodeDto;
    }

    signup(signupDto: SignupDto) {
        return signupDto;
    }
}
