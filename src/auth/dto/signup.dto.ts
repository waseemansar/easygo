import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsMobileNumberValid } from '../decorators/is-mobile-number-valid.decorator';

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsMobileNumberValid()
    mobile: string;
}
