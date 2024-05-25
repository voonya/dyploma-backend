import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @MaxLength(32)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  username: string;

  @MaxLength(32)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;
}
