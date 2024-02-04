import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
    constructor(private readonly prismaService: PrismaService) {}

    create(createBookingDto: CreateBookingDto) {
        return 'This action adds a new booking';
    }

    findAll() {
        return this.prismaService.booking.findMany();
    }

    async findOne(id: string) {
        const booking = await this.prismaService.booking.findFirst({ where: { id } });
        if (booking == null) {
            throw new NotFoundException('Booking not found');
        }

        return booking;
    }

    update(id: number, updateBookingDto: UpdateBookingDto) {
        return `This action updates a #${id} booking`;
    }

    remove(id: number) {
        return `This action removes a #${id} booking`;
    }
}
