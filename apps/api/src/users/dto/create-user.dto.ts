import { IsString, Matches, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../common/enums/roles.enums';
export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @Matches(/^\d{4}$/, {
    message: 'El PIN debe tener exactamente 4 dígitos',
  })
  pin: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
