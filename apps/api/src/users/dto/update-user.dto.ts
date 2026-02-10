import { IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Matches(/^\d{4}$/, {
    message: 'El PIN debe tener exactamente 4 dígitos',
  })
  pin: string;
}
