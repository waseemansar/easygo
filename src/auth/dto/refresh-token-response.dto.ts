import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResponseDto {
    @ApiProperty({ description: 'The access token string.' })
    accessToken: string;

    @ApiProperty({ description: 'The refresh token string.' })
    refreshToken: string;
}
