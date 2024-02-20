import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        sendVerificationCode: jest.fn(),
                        verifyCode: jest.fn(),
                        signup: jest.fn(),
                        refreshTokens: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('sendVerificationCode', () => {
        it('should send verification code', async () => {
            const sendVerificationCodeDto: SendVerificationCodeDto = { mobile: '+971501234567' };
            const expectedResult = { message: 'Verification code has been sent' };

            (service.sendVerificationCode as jest.Mock).mockResolvedValue(expectedResult);

            const result = await controller.sendVerificationCode(sendVerificationCodeDto);

            expect(service.sendVerificationCode).toHaveBeenCalledWith(sendVerificationCodeDto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('verifyCode', () => {
        it('should verify code', async () => {
            const verifyCodeDto: VerifyCodeDto = { mobile: '+971501234567', code: '123456' };
            const expectedResult = { accessToken: 'access_token', refreshToken: 'refresh_token' };

            (service.verifyCode as jest.Mock).mockResolvedValue(expectedResult);

            const result = await controller.verifyCode(verifyCodeDto);

            expect(service.verifyCode).toHaveBeenCalledWith(verifyCodeDto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('signup', () => {
        it('should sign up user', async () => {
            const signupDto: SignupDto = { email: 'test@example.com', mobile: '+971501234567', name: 'Test Name' };
            const expectedResult = {
                id: 'clsglux7p00002mkn8sgy1okq',
                ...signupDto,
                createdAt: '2024-02-10T22:14:29.241Z',
                updatedAt: '2024-02-10T22:14:29.241Z',
            };

            (service.signup as jest.Mock).mockResolvedValue(expectedResult);

            const result = await controller.signup(signupDto);

            expect(service.signup).toHaveBeenCalledWith(signupDto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('refreshTokens', () => {
        it('should refresh tokens', async () => {
            const refreshTokenDto: RefreshTokenDto = { refreshToken: 'refresh_token' };
            const expectedResult = { accessToken: 'access_token', refreshToken: 'refresh_token' };

            (service.refreshTokens as jest.Mock).mockResolvedValue(expectedResult);

            const result = await controller.refreshTokens(refreshTokenDto);

            expect(service.refreshTokens).toHaveBeenCalledWith(refreshTokenDto);
            expect(result).toEqual(expectedResult);
        });
    });
});
