import { IsString, MaxLength, MinLength } from 'class-validator';

export class VerifyCodeDto {
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    code: string;
}
