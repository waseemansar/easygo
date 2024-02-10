import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @Post()
    create(@Body() createBookingDto: CreateBookingDto, @ActiveUser('sub') userId: string) {
        return this.bookingsService.create(createBookingDto, userId);
    }

    @Get()
    findAll() {
        return this.bookingsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
        return this.bookingsService.update(id, updateBookingDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bookingsService.remove(id);
    }
}
