import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Currency, Prisma } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

const mockCurrentDate = new Date().toISOString();
const mockUserId = 'clsglux7p00002mkn8sgy1okq';
const mockBookingId = 'clsgmwb5n0001c1ken2r6xg2f';
const mockBooking = {
    id: mockBookingId,
    bookingId: 100,
    propertyId: 100,
    propertyName: 'Property',
    propertyImageUrl: 'https://example.com',
    arrivalDate: '2024-02-14T00:00:00.000Z',
    departureDate: '2024-02-17T00:00:00.000Z',
    totalGuests: 6,
    totalBill: new Prisma.Decimal(525.5),
    currency: Currency.AED,
    address: 'Dubai',
    beds: 2,
    baths: 2,
    rooms: 2,
    createdAt: '2024-02-10T22:14:29.241Z',
    updatedAt: '2024-02-10T22:14:29.241Z',
    userId: mockUserId,
};

const mockPrismaService = {
    booking: {
        create: jest
            .fn()
            .mockImplementation(({ data }) =>
                Promise.resolve({ ...data, id: mockBookingId, createdAt: mockCurrentDate, updatedAt: mockCurrentDate }),
            ),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ ...mockBooking, ...where, ...data })),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
    },
};

describe('BookingsService', () => {
    let service: BookingsService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<BookingsService>(BookingsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a booking', async () => {
            const createBookingDto: CreateBookingDto = {
                bookingId: 1,
                propertyId: 2,
                propertyName: 'Test Property',
                propertyImageUrl: 'https://example.com',
                arrivalDate: '2024-02-14',
                departureDate: '2024-02-17',
                totalGuests: 6,
                totalBill: 950.5,
                currency: Currency.AED,
                address: 'Abu Dhabi',
                beds: 3,
                baths: 2,
                rooms: 3,
            };
            const newBooking = await service.create(createBookingDto, mockUserId);

            expect(newBooking).toEqual({
                ...createBookingDto,
                id: mockBookingId,
                userId: mockUserId,
                arrivalDate: new Date(createBookingDto.arrivalDate),
                departureDate: new Date(createBookingDto.departureDate),
                createdAt: mockCurrentDate,
                updatedAt: mockCurrentDate,
            });
        });

        it('should throw "BadRequestException" if validation error occurs', async () => {
            (prismaService.booking.create as jest.Mock).mockRejectedValue(new PrismaClientValidationError('', { clientVersion: '' }));

            try {
                await service.create({} as CreateBookingDto, mockUserId);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });

        it('should throw "InternalServerErrorException" if an unexpected error occurs', async () => {
            (prismaService.booking.create as jest.Mock).mockRejectedValue(new Error('Some unexpected error'));

            try {
                await service.create({} as CreateBookingDto, mockUserId);
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
            }
        });
    });

    describe('findAll', () => {
        it('should return all bookings', async () => {
            (prismaService.booking.findMany as jest.Mock).mockResolvedValue([mockBooking]);

            const paginationQueryDto: PaginationQueryDto = { limit: 10 };
            const bookings = await service.findAll(paginationQueryDto, mockUserId);

            expect(bookings).toEqual([mockBooking]);
            expect(prismaService.booking.findMany).toHaveBeenCalledWith({
                where: { userId: mockUserId },
                orderBy: {
                    id: 'desc',
                },
                take: paginationQueryDto.limit,
                skip: paginationQueryDto.offset,
            });
        });
    });

    describe('findOne', () => {
        it('should return a booking', async () => {
            (prismaService.booking.findFirst as jest.Mock).mockResolvedValue(mockBooking);

            const booking = await service.findOne(mockBookingId);

            expect(booking).toEqual(mockBooking);
        });

        it('should throw the "NotFoundException" when booking with ID does not exists', async () => {
            (prismaService.booking.findFirst as jest.Mock).mockResolvedValue(undefined);

            try {
                await service.findOne(mockBookingId);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toEqual(`Booking not found`);
            }
        });
    });

    describe('update', () => {
        it('should throw "NotFoundException" if booking does not exist', async () => {
            (prismaService.booking.findFirst as jest.Mock).mockResolvedValue(undefined);

            try {
                await service.update(mockBookingId, {});
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });

        it('should update a booking', async () => {
            (prismaService.booking.findFirst as jest.Mock).mockResolvedValue(mockBooking);

            const updateBookingDto: UpdateBookingDto = {
                propertyName: 'Test Property',
                arrivalDate: '2024-02-16',
                departureDate: '2024-02-20',
            };
            const updatedBooking = await service.update(mockBookingId, updateBookingDto);

            expect(updatedBooking).toEqual({
                ...mockBooking,
                ...updateBookingDto,
                arrivalDate: new Date(updateBookingDto.arrivalDate),
                departureDate: new Date(updateBookingDto.departureDate),
            });
        });

        it('should throw "BadRequestException" if validation error occurs', async () => {
            (prismaService.booking.update as jest.Mock).mockRejectedValue(new PrismaClientValidationError('', { clientVersion: '' }));

            try {
                await service.update(mockBookingId, {});
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });

        it('should throw "InternalServerErrorException" if an unexpected error occurs', async () => {
            (prismaService.booking.update as jest.Mock).mockRejectedValue(new Error('Some unexpected error'));

            try {
                await service.update(mockBookingId, {});
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
            }
        });
    });

    describe('remove', () => {
        it('should remove a booking', async () => {
            (prismaService.booking.delete as jest.Mock).mockResolvedValue(mockBooking);

            const deletedBooking = await service.remove(mockBookingId);

            expect(deletedBooking).toEqual(mockBooking);
        });
    });
});
