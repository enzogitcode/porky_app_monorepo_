import { PartialType } from '@nestjs/mapped-types';
import { CreatePigDto, ParicionDto, RangoFechaDto, Situacion } from './create-pig.dto';
import {
  IsArray,
  IsDate,
  IsString,
  ValidateNested,
  IsOptional,
  IsEnum,
  ValidateIf,
  IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidEstadio } from './validators/customValidation';
import { VacunaAplicadaDto } from './create-pig.dto';

export class UpdatePigDto extends PartialType(CreatePigDto) {
  @ValidateNested({ each: true })
  @Type(() => VacunaAplicadaDto)
  vacunas?: VacunaAplicadaDto[];

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @ValidateIf(o => o.estaEnferma === true || o.estadio === Situacion.DESCARTE)
  @IsString()
  enfermedadActual?: string;

  @IsOptional()
  @ValidateIf(o => o.estadio === Situacion.SERVIDA || o.estadio === Situacion.GESTACION_CONFIRMADA)
  @Type(() => Date)
  @IsDate()
  fechaServicioActual?: Date;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @ValidateIf(o => o.fallecido === true)
  @Type(() => Date)
  @IsDate()
  fechaFallecimiento?: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParicionDto)
  pariciones?: ParicionDto[];

  @IsOptional()
  @IsEnum(Situacion)
  @IsValidEstadio({ message: 'Un cerdo con pariciones no puede ser nulípara' })
  estadio?: Situacion;

  // Nuevo campo opcional para que el backend pueda actualizarlo
  @IsOptional()
  @ValidateNested()
  @Type(() => RangoFechaDto)
  posibleFechaParto?: RangoFechaDto;
}
