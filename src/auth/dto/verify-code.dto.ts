import { IsString, MaxLength, MinLength } from 'class-validator';
import { IsMobileNumberValid } from '../decorators/is-mobile-number-valid.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeDto {
    @ApiProperty({ description: 'The mobile no of user to signin or singup.', example: '+971xxxxxxxxx' })
    @IsMobileNumberValid()
    mobile: string;

    @ApiProperty({ description: 'The OTP received on given mobile no.', example: '055234' })
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    code: string;
}
