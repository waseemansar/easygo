import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Currency } from '@prisma/client';
import * as request from 'supertest';
import { AuthModule } from './../../src/auth/auth.module';
import { VerifyCodeDto } from './../../src/auth/dto/verify-code.dto';
import { BookingsModule } from './../../src/bookings/bookings.module';
import { CreateBookingDto } from './../../src/bookings/dto/create-booking.dto';
import { UpdateBookingDto } from './../../src/bookings/dto/update-booking.dto';
import { TwilioService } from './../../src/twilio/twilio.service';
import { TwilioServiceMock } from './../auth/twilio.service.mock';

const mockBooking = {
    bookingId: 20,
    propertyId: 84,
    propertyName: 'Test Property',
    propertyImageUrl: 'https://unfit-nutrient.org',
    arrivalDate: '2024-02-22',
    departureDate: '2024-02-25',
    totalGuests: 6,
    totalBill: 686.63,
    currency: Currency.AED,
    address: 'Fort Constantinchester',
    beds: 2,
    baths: 3,
    rooms: 3,
};

describe('[Feature] Bookings - /bookings', () => {
    let app: INestApplication;
    let jwtToken: string;
    let testCreadtedBookingId: string;

    const obtainJwtToken = async (app: INestApplication) => {
        const verifyCodeDto: VerifyCodeDto = { mobile: '+971502561253', code: '123456' };
        const response = await request(app.getHttpServer()).post('/auth/verify-code').send(verifyCodeDto);
        return response.body.accessToken;
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthModule, BookingsModule],
        })
            .overrideProvider(TwilioService)
            .useClass(TwilioServiceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        jwtToken = await obtainJwtToken(app);
    });

    it('Create a Booking [POST /bookings]', () => {
        const createBokkingDto: CreateBookingDto = mockBooking;

        return request(app.getHttpServer())
            .post('/bookings')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(createBokkingDto)
            .expect(HttpStatus.CREATED)
            .then(({ body }) => {
                testCreadtedBookingId = body.id;
                expect(body).toEqual({
                    ...createBokkingDto,
                    id: expect.any(String),
                    userId: expect.any(String),
                    arrivalDate: '2024-02-22T00:00:00.000Z',
                    departureDate: '2024-02-25T00:00:00.000Z',
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    totalBill: createBokkingDto.totalBill.toString(),
                });
            });
    });

    it('Get all Bookings [GET /bookings]', () => {
        return request(app.getHttpServer())
            .get('/bookings')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(HttpStatus.OK)
            .then(({ body }) => {
                expect(body.length).toBeGreaterThan(0);
                expect(body[0]).toEqual({
                    ...mockBooking,
                    id: expect.any(String),
                    userId: expect.any(String),
                    arrivalDate: '2024-02-22T00:00:00.000Z',
                    departureDate: '2024-02-25T00:00:00.000Z',
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    totalBill: mockBooking.totalBill.toString(),
                });
            });
    });

    it('Get a Booking [GET /bookings/:id]', () => {
        return request(app.getHttpServer())
            .get(`/bookings/${testCreadtedBookingId}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(HttpStatus.OK)
            .then(({ body }) => {
                expect(body).toEqual({
                    ...mockBooking,
                    id: testCreadtedBookingId,
                    userId: expect.any(String),
                    arrivalDate: '2024-02-22T00:00:00.000Z',
                    departureDate: '2024-02-25T00:00:00.000Z',
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    totalBill: mockBooking.totalBill.toString(),
                });
            });
    });

    it('Update a Booking [PATCH /bookings/:id]', () => {
        const updateBokkingDto: UpdateBookingDto = {
            propertyName: 'Test Update Property',
        };

        return request(app.getHttpServer())
            .patch(`/bookings/${testCreadtedBookingId}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(updateBokkingDto)
            .expect(HttpStatus.OK)
            .then(({ body }) => {
                expect(body).toEqual({
                    ...mockBooking,
                    ...updateBokkingDto,
                    id: testCreadtedBookingId,
                    userId: expect.any(String),
                    arrivalDate: '2024-02-22T00:00:00.000Z',
                    departureDate: '2024-02-25T00:00:00.000Z',
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    totalBill: mockBooking.totalBill.toString(),
                });
            });
    });

    it('Delete a Booking [DELETE /bookings/:id]', () => {
        return request(app.getHttpServer())
            .delete(`/bookings/${testCreadtedBookingId}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(HttpStatus.OK);
    });
});
