import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as twilio from 'twilio';
import TwilioClient from 'twilio/lib/rest/Twilio';
import { twilioConfig } from './config/twilio.config';
import { TwilioError } from './errors/twilio.error';

@Injectable()
export class TwilioService {
    private client: TwilioClient;

    constructor(@Inject(twilioConfig.KEY) private readonly twilioConfiguration: ConfigType<typeof twilioConfig>) {
        this.client = twilio(this.twilioConfiguration.accountSID, this.twilioConfiguration.authToken);
    }

    async sendVerificationCode(to: string) {
        try {
            await this.client.verify.v2.services(this.twilioConfiguration.serviceSID).verifications.create({
                to: to,
                channel: 'sms',
            });
        } catch (error) {
            if (error.code === 60200) {
                throw new TwilioError();
            }

            throw new InternalServerErrorException();
        }
    }

    async verifyCode(to: string, code: string): Promise<boolean> {
        try {
            const response = await this.client.verify.v2.services(this.twilioConfiguration.serviceSID).verificationChecks.create({
                to: to,
                code: code,
            });

            if (response.status === 'approved') {
                return true;
            }

            return false;
        } catch (error) {
            if (error.code === 60200 || error.code === 20404) {
                throw new TwilioError();
            }

            throw new InternalServerErrorException();
        }
    }
}
