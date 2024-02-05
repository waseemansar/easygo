import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { JWTConfig } from '../interfaces/jwt-config.interface';

const jwtConfig = registerAs('jwt', (): JWTConfig => {
    const configurations = {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
        accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL, 10),
        refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL, 10),
    };

    const schema = Joi.object<JWTConfig, true>({
        secret: Joi.string().required(),
        audience: Joi.string().required(),
        issuer: Joi.string().required(),
        accessTokenTtl: Joi.number().required(),
        refreshTokenTtl: Joi.number().required(),
    });

    const { error } = schema.validate(configurations, { abortEarly: false });
    if (error) {
        throw new Error(
            `JWT configurations validation failed - Is there an environment variable missing?
            ${error.message}`,
        );
    }

    return configurations;
});

export { jwtConfig };
