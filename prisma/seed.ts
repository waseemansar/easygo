import { faker } from '@faker-js/faker';
import { Currency, Prisma, PrismaClient } from '@prisma/client';

function getFakeDates() {
    const arrivalDate = faker.date.soon({ days: 14 });
    const arrivalDateObject = new Date(arrivalDate);
    const departureDate = new Date(arrivalDateObject.setDate(arrivalDateObject.getDate() + 3));

    return { arrivalDate, departureDate };
}

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Waseem Ansar',
            email: 'waseemansar@outlook.com',
            mobile: '+971502561253',
        },
    });

    const bookings: Prisma.BookingCreateManyInput[] = [];

    for (let i = 0; i < 10; i++) {
        const { arrivalDate, departureDate } = getFakeDates();

        const booking: Prisma.BookingCreateManyInput = {
            address: faker.location.city(),
            arrivalDate,
            baths: faker.number.int({ min: 1, max: 5 }),
            beds: faker.number.int({ min: 1, max: 5 }),
            bookingId: faker.number.int({ min: 1, max: 100 }),
            currency: Currency.AED,
            departureDate,
            propertyId: faker.number.int({ min: 1, max: 100 }),
            propertyName: `Property ${i + 1}`,
            propertyImageUrl: faker.internet.url(),
            rooms: faker.number.int({ min: 1, max: 5 }),
            totalBill: new Prisma.Decimal(Number(faker.finance.amount({ min: 100, max: 1000, dec: 2 }))),
            totalGuests: faker.number.int({ min: 1, max: 10 }),
            userId: user.id,
        };

        bookings.push(booking);
    }

    await prisma.booking.createMany({ data: bookings });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
