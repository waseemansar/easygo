import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConfig } from './config/jwt.config';

@Module({
    imports: [ConfigModule.forFeature(jwtConfig)],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
