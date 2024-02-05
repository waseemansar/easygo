import { Currency } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl, Min } from 'class-validator';

export class CreateBookingDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    bookingId?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    propertyId?: number;

    @IsNotEmpty()
    @IsString()
    propertyName: string;

    @IsUrl()
    propertyImageUrl: string;

    @IsNotEmpty()
    @IsString()
    arrivalDate: string;

    @IsNotEmpty()
    @IsString()
    departureDate: string;

    @IsPositive()
    totalGuests: number;

    @IsPositive()
    totalBill: number;

    @IsOptional()
    @IsEnum(Currency)
    currency: Currency;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsPositive()
    beds: number;

    @IsPositive()
    baths: number;

    @IsPositive()
    rooms: number;
}
