import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl, Min } from 'class-validator';

export class CreateBookingDto {
    @ApiProperty({ description: 'ID of a booking' })
    @IsOptional()
    @IsInt()
    @Min(0)
    bookingId?: number;

    @ApiProperty({ description: 'ID of a property' })
    @IsOptional()
    @IsInt()
    @Min(0)
    propertyId?: number;

    @ApiProperty({ description: 'The name of a property' })
    @IsNotEmpty()
    @IsString()
    propertyName: string;

    @ApiProperty({ description: 'The URL of a property image' })
    @IsUrl()
    propertyImageUrl: string;

    @ApiProperty({ description: 'The arrival date, when you are reaching to booked property.', example: '2024-02-21' })
    @IsNotEmpty()
    @IsString()
    arrivalDate: string;

    @ApiProperty({ description: 'The departure date, when you are leaving property. ', example: '2024-02-25' })
    @IsNotEmpty()
    @IsString()
    departureDate: string;

    @ApiProperty({ description: 'The total number of guests going to stay at property.', example: 5 })
    @IsPositive()
    totalGuests: number;

    @ApiProperty({ description: 'The total bill according to how many days you stay.', example: 950.5 })
    @IsPositive()
    totalBill: number;

    @ApiProperty({ enum: Currency, description: 'The currency in which bill will be calculated.' })
    @IsOptional()
    @IsEnum(Currency)
    currency: Currency;

    @ApiProperty({ description: 'The address of the property.' })
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty({ description: 'The number of beds particular property have.', example: 3 })
    @IsPositive()
    beds: number;

    @ApiProperty({ description: 'The number of baths particular property have.', example: 2 })
    @IsPositive()
    baths: number;

    @ApiProperty({ description: 'The number of rooms particular property have.', example: 4 })
    @IsPositive()
    rooms: number;
}
