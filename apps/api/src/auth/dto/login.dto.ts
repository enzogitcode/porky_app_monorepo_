// src/auth/dto/login.dto.ts
import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  @Matches(/^\d{4}$/, {
    message: 'El PIN debe tener 4 dígitos',
  })
  pin: string;
}
