import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

interface IUser extends User {}

export class SignupResponseDto implements IUser {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    mobile: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
