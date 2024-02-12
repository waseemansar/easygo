import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @ApiOperation({ summary: 'Create Booking' })
    @ApiBadRequestResponse({ description: 'Upon any data validation failed' })
    @Post()
    create(@Body() createBookingDto: CreateBookingDto, @ActiveUser('sub') userId: string) {
        return this.bookingsService.create(createBookingDto, userId);
    }

    @ApiOperation({ summary: 'Get all Bookings' })
    @Get()
    findAll() {
        return this.bookingsService.findAll();
    }

    @ApiOperation({ summary: 'Get Booking' })
    @ApiNotFoundResponse({ description: 'If booking is not found' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

    @ApiOperation({ summary: 'Update Booking' })
    @ApiBadRequestResponse({ description: 'Upon any data validation failed' })
    @ApiNotFoundResponse({ description: 'If booking is not found' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
        return this.bookingsService.update(id, updateBookingDto);
    }

    @ApiOperation({ summary: 'Delete Booking' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bookingsService.remove(id);
    }
}
