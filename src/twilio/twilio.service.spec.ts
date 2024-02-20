import { ConfigType } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { twilioConfig } from './config/twilio.config';
import { TwilioService } from './twilio.service';
import { InternalServerErrorException } from '@nestjs/common';

const mockTwilioConfig: ConfigType<typeof twilioConfig> = {
    accountSID: 'mockAccountSID',
    authToken: 'mockAuthToken',
    serviceSID: 'mockServiceSID',
};

jest.mock('twilio');

describe('TwilioService', () => {
    let service: TwilioService;
    let twilioConfiguration: ConfigType<typeof twilioConfig>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TwilioService,
                {
                    provide: twilioConfig.KEY,
                    useValue: mockTwilioConfig,
                },
            ],
        }).compile();

        service = module.get<TwilioService>(TwilioService);
        twilioConfiguration = module.get(twilioConfig.KEY);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendVerificationCode', () => {
        it('should send verification code', async () => {
            const to = '+971501234567';

            const mockVerifyMethod = jest.fn();
            const mockClient = {
                verify: {
                    v2: {
                        services: jest.fn(() => ({
                            verifications: {
                                create: mockVerifyMethod,
                            },
                        })),
                    },
                },
            };
            (service as any).client = mockClient;

            await service.sendVerificationCode(to);
            expect((service as any).client.verify.v2.services).toHaveBeenCalledWith(twilioConfiguration.serviceSID);
            expect((service as any).client.verify.v2.services(twilioConfiguration.serviceSID).verifications.create).toHaveBeenCalledWith({
                to: to,
                channel: 'sms',
            });
        });

        it('should throw "InternalServerErrorException" if an unexpected error occurs', async () => {
            const to = '+971501234567';

            const mockVerifyMethod = jest.fn().mockRejectedValue(new Error());
            const mockClient = {
                verify: {
                    v2: {
                        services: jest.fn(() => ({
                            verifications: {
                                create: mockVerifyMethod,
                            },
                        })),
                    },
                },
            };
            (service as any).client = mockClient;

            try {
                await service.sendVerificationCode(to);
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
            }
        });
    });

    describe('verifyCode', () => {
        it('should verify code', async () => {
            const to = '+971501234567';
            const code = '123456';

            const mockVerifyMethod = jest.fn().mockResolvedValue({ status: 'approved' });
            const mockClient = {
                verify: {
                    v2: {
                        services: jest.fn(() => ({
                            verificationChecks: {
                                create: mockVerifyMethod,
                            },
                        })),
                    },
                },
            };
            (service as any).client = mockClient;

            const result = await service.verifyCode(to, code);

            expect(result).toBe(true);
            expect((service as any).client.verify.v2.services).toHaveBeenCalledWith(twilioConfiguration.serviceSID);
            expect(
                (service as any).client.verify.v2.services(twilioConfiguration.serviceSID).verificationChecks.create,
            ).toHaveBeenCalledWith({
                to: to,
                code: code,
            });
        });

        it('should not verify code if code is invalid', async () => {
            const to = '+971501234567';
            const code = 'invalid';

            const mockVerifyMethod = jest.fn().mockResolvedValue({ status: 'pending' });
            const mockClient = {
                verify: {
                    v2: {
                        services: jest.fn(() => ({
                            verificationChecks: {
                                create: mockVerifyMethod,
                            },
                        })),
                    },
                },
            };
            (service as any).client = mockClient;

            const result = await service.verifyCode(to, code);

            expect(result).toBe(false);
            expect((service as any).client.verify.v2.services).toHaveBeenCalledWith(twilioConfiguration.serviceSID);
            expect(
                (service as any).client.verify.v2.services(twilioConfiguration.serviceSID).verificationChecks.create,
            ).toHaveBeenCalledWith({
                to: to,
                code: code,
            });
        });

        it('should throw "InternalServerErrorException" if an unexpected error occurs', async () => {
            const to = '+971501234567';
            const code = '123456';

            const mockVerifyMethod = jest.fn().mockRejectedValue(new Error());
            const mockClient = {
                verify: {
                    v2: {
                        services: jest.fn(() => ({
                            verificationChecks: {
                                create: mockVerifyMethod,
                            },
                        })),
                    },
                },
            };
            (service as any).client = mockClient;

            try {
                await service.verifyCode(to, code);
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
            }
        });
    });
});
