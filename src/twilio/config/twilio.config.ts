import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { TwilioConfig } from '../interfaces/twilio.interface';

const twilioConfig = registerAs('twilio', (): TwilioConfig => {
    const configurations = {
        accountSID: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        serviceSID: process.env.TWILIO_SERVICE_SID,
    };

    const schema = Joi.object<TwilioConfig, true>({
        accountSID: Joi.string().required(),
        authToken: Joi.string().required(),
        serviceSID: Joi.string().required(),
    });

    const { error } = schema.validate(configurations, { abortEarly: false });
    if (error) {
        throw new Error(
            `Twilio configurations validation failed - Is there an environment variable missing?
            ${error.message}`,
        );
    }

    return configurations;
});

export { twilioConfig };
