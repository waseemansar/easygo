import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsMobileNumberValid } from '../decorators/is-mobile-number-valid.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
    @ApiProperty({ description: 'The name of the user to signin in or signup.' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'The email of the user to signin in or signup.' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The mobile no of user to signin or singup.', example: '+971xxxxxxxxx' })
    @IsMobileNumberValid()
    mobile: string;
}
