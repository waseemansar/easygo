import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationCodeResponseDto {
    @ApiProperty({ description: 'A successfull message', example: 'Verification code has been sent' })
    message: string;
}
