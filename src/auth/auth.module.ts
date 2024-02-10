import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { TwilioModule } from '../twilio/twilio.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConfig } from './config/jwt.config';
import { AuthGuard } from './guards/auth.guard';
import { AccessTokenGuard } from './guards/access-token.guard';

@Module({
    imports: [ConfigModule.forFeature(jwtConfig), TwilioModule, PrismaModule, JwtModule.registerAsync(jwtConfig.asProvider())],
    providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }, AccessTokenGuard],
    controllers: [AuthController],
})
export class AuthModule {}
