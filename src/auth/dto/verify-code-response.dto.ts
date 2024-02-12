import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeResponseDto {
    @ApiProperty({ description: 'The access token string. It can be null if user with given mobile no is not existed', nullable: true })
    accessToken: string | null;

    @ApiProperty({
        description: 'The refresh token string. It can be null if user with given mobile no is not existed',
        nullable: true,
    })
    refreshToken: string | null;
}
