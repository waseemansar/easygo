import { IsString, MaxLength, MinLength } from 'class-validator';
import { IsMobileNumberValid } from '../decorators/is-mobile-number-valid.decorator';

export class VerifyCodeDto {
    @IsMobileNumberValid()
    mobile: string;

    @IsString()
    @MinLength(6)
    @MaxLength(6)
    code: string;
}
