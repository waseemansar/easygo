import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from './config/jwt.config';

@Injectable()
export class AuthService {
    constructor(@Inject(jwtConfig.KEY) private readonly jwtConfiguration: ConfigType<typeof jwtConfig>) {}
}
