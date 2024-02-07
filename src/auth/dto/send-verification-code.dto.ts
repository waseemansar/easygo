import { IsMobileNumberValid } from '../decorators/is-mobile-number-valid.decorator';

export class SendVerificationCodeDto {
    @IsMobileNumberValid()
    mobile: string;
}
