# EasyGo API Documentation

The EasyGo API is developed using **NestJS** and leverages a **PostgreSQL** database and **Prisma ORM**. It comprises two main modules: **Auth** and **Bookings**.

## Features

-   **Authentication**: Utilizes Twilio and JWT for user authentication.
-   **Bookings**: Allows users to perform CRUD operations on bookings.

## Technologies Used

-   **NestJS**
-   **PostgreSQL**
-   **Prisma ORM**
-   **Swagger**: For API documentation.

## Getting Started

### Prerequisites

Before running the API locally, ensure you have the following installed:

-   Node.js
-   npm or yarn
-   PostgreSQL

### Installation

1. Clone this repository.
2. Install dependencies using `npm install` or `yarn install`.
3. For development create `.env.development` file.
4. Set up environment variables:
    - `DATABASE_URL`: PostgreSQL database connection URL.
    - `TWILIO_ACCOUNT_SID`: Twilio Account SID for OTP generation.
    - `TWILIO_AUTH_TOKEN`: Twilio Auth Token for authentication.
    - (Add any other as mentioned in `.env.example` environment file)
5. Run database migrations: `npm run migrate:dev`.
6. Run database seeder: `npm run seed:dev`.
7. Start the server: `npm run start:dev` or `yarn start:dev`.
8. The app will start in development mode at: [http://localhost:3000](http://localhost:3000).

### API Endpoints

#### Authentication

-   **POST /auth/send-verification-code**: Send OTP to a given mobile number.
-   **POST /auth/verify-code**: Verify OTP and generate JWT token if user already exists.
-   **POST /auth/signup**: Sign up a new user.
-   **POST /auth/refresh-tokens**: Obtain refreshed tokens.

#### Bookings

-   **GET /bookings**: Get all bookings.
-   **POST /bookings**: Create a new booking.
-   **GET /bookings/:id**: Get a specific booking.
-   **PUT /bookings/:id**: Update a specific booking.
-   **DELETE /bookings/:id**: Delete a specific booking.

### Authentication Flow

1. Send OTP to the user's mobile number using `/auth/send-verification-code`.
2. Verify OTP using `/auth/verify-code`.
3. Upon successful verification, a JWT token will be generated and returned to the client if a user is already exists. Otherwise `null` will be returned for both access and refresh tokens.
4. If a user doesn't exists then first sign up using `/auth/signup`.

### Database Schema

The `schema.prisma` includes tables for users, bookings, and any other relevant entities. Prisma ORM is used for defining and interacting with these tables.

### Swagger Documentation

Explore the API documentation using Swagger UI at [http://localhost:3000/api](http://localhost:3000/api).
