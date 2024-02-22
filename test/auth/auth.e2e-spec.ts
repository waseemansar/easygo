import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from './../../src/auth/auth.module';
import { RefreshTokenDto } from './../../src/auth/dto/refresh-token.dto';
import { SendVerificationCodeDto } from './../../src/auth/dto/send-verification-code.dto';
import { SignupDto } from './../../src/auth/dto/signup.dto';
import { VerifyCodeDto } from './../../src/auth/dto/verify-code.dto';
import { TwilioService } from './../../src/twilio/twilio.service';
import { TwilioServiceMock } from './twilio.service.mock';

describe('[Feature] Auth - /auth', () => {
    let app: INestApplication;
    let refreshToken: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthModule],
        })
            .overrideProvider(TwilioService)
            .useClass(TwilioServiceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('Send Verification Code [POST /auth/send-verification-code]', () => {
        const sendVerificationCodeDto: SendVerificationCodeDto = { mobile: '+971501234567' };

        return request(app.getHttpServer())
            .post('/auth/send-verification-code')
            .send(sendVerificationCodeDto)
            .expect(HttpStatus.OK)
            .then(({ body }) => {
                expect(body).toEqual({ message: 'Verification code has been sent' });
            });
    });

    it('Verify Code [POST /auth/verify-code]', () => {
        const verifyCodeDto: VerifyCodeDto = { mobile: '+971502561253', code: '123456' };

        return request(app.getHttpServer())
            .post('/auth/verify-code')
            .send(verifyCodeDto)
            .expect(HttpStatus.OK)
            .then(({ body }) => {
                refreshToken = body.refreshToken;
                expect(body.accessToken).toEqual(expect.any(String));
                expect(body.refreshToken).toEqual(expect.any(String));
            });
    });

    it('Signup [POST /auth/signup]', () => {
        const signupDto: SignupDto = { email: 'test@example.com', name: 'Test Name', mobile: '+971501234567' };

        return request(app.getHttpServer())
            .post('/auth/signup')
            .send(signupDto)
            .expect(HttpStatus.CREATED)
            .then(({ body }) => {
                expect(body).toEqual(
                    expect.objectContaining({
                        id: expect.any(String),
                        name: signupDto.name,
                        email: signupDto.email,
                        mobile: signupDto.mobile,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    }),
                );
            });
    });

    it('Refresh Tokens [POST /auth/refresh-tokens]', () => {
        const refreshTokenDto: RefreshTokenDto = { refreshToken };

        return request(app.getHttpServer())
            .post('/auth/refresh-tokens')
            .send(refreshTokenDto)
            .expect(HttpStatus.OK)
            .then(({ body }) => {
                expect(body.accessToken).toEqual(expect.any(String));
                expect(body.refreshToken).toEqual(expect.any(String));
            });
    });

    afterAll(async () => {
        app.close();
    });
});
