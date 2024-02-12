import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({ description: 'The refresh token obtained at time of login.' })
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}
