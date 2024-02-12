import { ApiProperty } from '@nestjs/swagger';
import { Booking, Currency } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

interface IBooking extends Booking {}

export class BookingResponseDto implements IBooking {
    @ApiProperty()
    address: string;

    @ApiProperty()
    arrivalDate: Date;

    @ApiProperty()
    baths: number;

    @ApiProperty()
    beds: number;

    @ApiProperty()
    bookingId: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ enum: Currency })
    currency: Currency;

    @ApiProperty()
    departureDate: Date;

    @ApiProperty()
    id: string;

    @ApiProperty()
    propertyId: number;

    @ApiProperty()
    propertyImageUrl: string;

    @ApiProperty()
    propertyName: string;

    @ApiProperty()
    rooms: number;

    @ApiProperty()
    totalBill: Decimal;

    @ApiProperty()
    totalGuests: number;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    userId: string;
}
