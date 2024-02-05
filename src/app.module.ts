import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TwilioModule } from './twilio/twilio.module';
import * as Joi from 'joi';

@Module({
    imports: [
        PrismaModule,
        BookingsModule,
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                DATABASE_URL: Joi.required(),
            }),
        }),
        AuthModule,
        TwilioModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
