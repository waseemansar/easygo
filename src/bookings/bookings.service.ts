import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createBookingDto: CreateBookingDto, userId: string) {
        try {
            const booking = await this.prismaService.booking.create({
                data: {
                    ...createBookingDto,
                    arrivalDate: new Date(createBookingDto.arrivalDate),
                    departureDate: new Date(createBookingDto.departureDate),
                    userId,
                },
            });

            return booking;
        } catch (error) {
            if (error instanceof PrismaClientValidationError) {
                throw new BadRequestException();
            }

            throw new InternalServerErrorException('Cannot create booking');
        }
    }

    findAll(paginationQueryDto: PaginationQueryDto, userId: string) {
        const { limit, offset } = paginationQueryDto;

        return this.prismaService.booking.findMany({
            where: { userId },
            orderBy: {
                id: 'desc',
            },
            take: limit,
            skip: offset,
        });
    }

    async findOne(id: string) {
        const booking = await this.prismaService.booking.findFirst({ where: { id } });
        if (booking == null) {
            throw new NotFoundException('Booking not found');
        }

        return booking;
    }

    async update(id: string, updateBookingDto: UpdateBookingDto) {
        await this.findOne(id);

        try {
            const booking = await this.prismaService.booking.update({
                where: { id },
                data: {
                    ...updateBookingDto,
                    arrivalDate: updateBookingDto.arrivalDate ? new Date(updateBookingDto.arrivalDate) : undefined,
                    departureDate: updateBookingDto.departureDate ? new Date(updateBookingDto.departureDate) : undefined,
                },
            });

            return booking;
        } catch (error) {
            if (error instanceof PrismaClientValidationError) {
                throw new BadRequestException();
            }

            throw new InternalServerErrorException('Cannot update booking');
        }
    }

    remove(id: string) {
        return this.prismaService.booking.delete({
            where: { id },
        });
    }
}
