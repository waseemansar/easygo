import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { jwtConfig } from './config/jwt.config';

@Module({
    imports: [ConfigModule.forFeature(jwtConfig)],
    providers: [AuthService],
})
export class AuthModule {}
