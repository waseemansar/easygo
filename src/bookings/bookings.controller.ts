import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { BookingsService } from './bookings.service';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiBearerAuth()
@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @ApiOperation({ summary: 'Create Booking' })
    @ApiBadRequestResponse({ description: 'Upon any data validation failed' })
    @ApiOkResponse({ type: BookingResponseDto })
    @Post()
    create(@Body() createBookingDto: CreateBookingDto, @ActiveUser('sub') userId: string) {
        return this.bookingsService.create(createBookingDto, userId);
    }

    @ApiOperation({ summary: 'Get all Bookings' })
    @ApiOkResponse({ type: BookingResponseDto, isArray: true })
    @Get()
    findAll(@Query() paginationQueryDto: PaginationQueryDto) {
        return this.bookingsService.findAll(paginationQueryDto);
    }

    @ApiOperation({ summary: 'Get Booking' })
    @ApiNotFoundResponse({ description: 'If booking is not found' })
    @ApiOkResponse({ type: BookingResponseDto })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

    @ApiOperation({ summary: 'Update Booking' })
    @ApiBadRequestResponse({ description: 'Upon any data validation failed' })
    @ApiNotFoundResponse({ description: 'If booking is not found' })
    @ApiOkResponse({ type: BookingResponseDto })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
        return this.bookingsService.update(id, updateBookingDto);
    }

    @ApiOperation({ summary: 'Delete Booking' })
    @ApiOkResponse({ type: BookingResponseDto })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bookingsService.remove(id);
    }
}
