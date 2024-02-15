import { Test, TestingModule } from '@nestjs/testing';
import { Currency, Prisma } from '@prisma/client';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
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

const mockBookingsService = {
    findAll: jest.fn().mockResolvedValue([mockBooking]),
    findOne: jest.fn().mockImplementation((id: string) => Promise.resolve({ ...mockBooking, id })),
    create: jest
        .fn()
        .mockImplementation((createBookingDto: CreateBookingDto, userId: string) =>
            Promise.resolve({ ...createBookingDto, userId, id: mockBookingId, createdAt: mockCurrentDate, updatedAt: mockCurrentDate }),
        ),
    update: jest
        .fn()
        .mockImplementation((id: string, updateBookingDto: UpdateBookingDto) =>
            Promise.resolve({ ...mockBooking, id, ...updateBookingDto }),
        ),
    remove: jest.fn().mockImplementation((id: string) => Promise.resolve({ ...mockBooking, id })),
};

describe('BookingsController', () => {
    let controller: BookingsController;
    let service: BookingsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookingsController],
            providers: [
                {
                    provide: BookingsService,
                    useValue: mockBookingsService,
                },
            ],
        }).compile();

        controller = module.get<BookingsController>(BookingsController);
        service = module.get<BookingsService>(BookingsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a booking ', async () => {
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

            const newBooking = await controller.create(createBookingDto, mockUserId);

            expect(service.create).toHaveBeenCalled();
            expect(newBooking).toEqual({
                ...createBookingDto,
                id: mockBookingId,
                userId: mockUserId,
                createdAt: mockCurrentDate,
                updatedAt: mockCurrentDate,
            });
        });
    });

    describe('findAll', () => {
        it('should return all bookings ', async () => {
            const bookings = await controller.findAll({}, mockUserId);

            expect(service.findAll).toHaveBeenCalled();
            expect(bookings).toEqual([mockBooking]);
        });
    });

    describe('findOne', () => {
        it('should return a booking ', async () => {
            const booking = await controller.findOne(mockBookingId);

            expect(service.findOne).toHaveBeenCalled();
            expect(booking).toEqual({ ...mockBooking, id: mockBookingId });
        });
    });

    describe('update', () => {
        it('should update a booking ', async () => {
            const updateBookingDto: UpdateBookingDto = {
                propertyName: 'Update Property',
                totalBill: 1000,
            };

            const updatedBooking = await controller.update(mockBookingId, updateBookingDto);

            expect(service.update).toHaveBeenCalled();
            expect(updatedBooking).toEqual({ ...mockBooking, ...updateBookingDto });
        });
    });

    describe('remove', () => {
        it('should remove a booking ', async () => {
            const deletedBooking = await controller.remove(mockBookingId);

            expect(service.update).toHaveBeenCalled();
            expect(deletedBooking).toEqual(mockBooking);
        });
    });
});
