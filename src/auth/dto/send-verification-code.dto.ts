import { ApiProperty } from '@nestjs/swagger';
import { IsMobileNumberValid } from '../decorators/is-mobile-number-valid.decorator';

export class SendVerificationCodeDto {
    @ApiProperty({ description: 'The mobile no of user to signin or singup.', example: '+971xxxxxxxxx' })
    @IsMobileNumberValid()
    mobile: string;
}
