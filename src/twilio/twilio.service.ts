import { Inject, Injectable } from '@nestjs/common';
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
            throw new TwilioError('Error sending verification code');
        }
    }

    async verifyCode(to: string, code: string): Promise<void> {
        try {
            await this.client.verify.v2.services(this.twilioConfiguration.serviceSID).verificationChecks.create({
                to: to,
                code: code,
            });
        } catch (error) {
            throw new TwilioError('Error verifying code');
        }
    }
}
