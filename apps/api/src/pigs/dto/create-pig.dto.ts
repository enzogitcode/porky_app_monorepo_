import { Expose, Type } from 'class-transformer';
import {
  IsMongoId,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { IsValidEstadio } from './validators/customValidation';

//enums
export enum Situacion {
  NULIPARA = 'nulipara',
  SERVIDA = 'servida',
  GESTACION_CONFIRMADA = 'gestación confirmada',
  PARIDA = 'parida con lechones',
  DESTETADA = 'destetada',
  VACIA = 'vacía',
  DESCARTE = 'descarte',
  FALLECIDO = 'fallecido',
}

export enum TipoServicio {
  CERDO = 'cerdo',
  INSEMINACION = 'inseminacion',
  DESCONOCIDO = 'desconocido',
}

//DTOs
export class VacunaAplicadaDto {
  @IsMongoId()
  vacuna: string;

  @Type(() => Date)
  @IsDate()
  fechaVacunacion: Date;
}

export class ServicioDto {
  @IsEnum(TipoServicio)
  tipo!: TipoServicio;

  @ValidateIf(o => o.tipo === TipoServicio.INSEMINACION || o.tipo === TipoServicio.CERDO)
  @Type(() => Date)
  @IsDate({ message: 'La fecha debe ser válida' })
  fecha!: Date;

  @ValidateIf(o => o.tipo === TipoServicio.CERDO)
  @IsString({ message: 'El macho debe ser un texto válido' })
  macho!: string;

  @ValidateIf(o => o.tipo === TipoServicio.INSEMINACION)
  @IsString({ message: 'El proveedor de dosis debe ser un string' })
  proveedorDosis!: string;
}
export class ParicionDto {
  @IsDate()
  @Type(() => Date)
  fechaParicion!: Date;

  get fechaFormateada(): string {
    return this.fechaParicion
      ? this.fechaParicion.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      : '';
  }

  @IsNumber()
  cantidadLechones!: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ServicioDto)
  servicio?: ServicioDto;

  @IsOptional()
  @Type(() => Date)
  fechaActualizacion?: Date;
}

export class RangoFechaDto {
  @Type(() => Date)
  @IsDate()
  inicio!: Date;

  @Type(() => Date)
  @IsDate()
  fin!: Date;
}

export class CreatePigDto {

  @IsNumber()
  nroCaravana!: number;

  @IsEnum(Situacion, { message: 'estadio no es válido' })
  @IsValidEstadio({ message: 'Un cerdo con pariciones no puede ser nulípara' })
  estadio!: Situacion;

  @IsOptional()
  @ValidateIf(o => o.estadio === Situacion.FALLECIDO)
  @Type(() => Date)
  @IsDate({ message: 'fechaFallecido debe ser una fecha válida' })
  fechaFallecido?: Date;

  @ValidateNested({ each: true })
  @Type(() => VacunaAplicadaDto)
  vacunas?: VacunaAplicadaDto[];

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ParicionDto)
  pariciones?: ParicionDto[];

  @IsOptional()
  @ValidateIf(o => o.estaEnferma === true || o.estadio === Situacion.DESCARTE)
  @IsString()
  enfermedadActual?: string;

  @IsOptional()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @ValidateIf(o => o.estadio === Situacion.SERVIDA || o.estadio === Situacion.GESTACION_CONFIRMADA)
  @Type(() => Date)
  @IsDate()
  fechaServicioActual?: Date;

  @IsOptional()
  @ValidateIf(o => o.estadio === Situacion.SERVIDA || o.estadio === Situacion.GESTACION_CONFIRMADA)
  @ValidateNested()
  @Type(() => RangoFechaDto)
  posibleFechaParto?: RangoFechaDto;

  @Expose()
  get lechonesTotal(): number {
    if (!this.pariciones || this.pariciones.length === 0) {
      return 0;
    }
    return this.pariciones.reduce(
      (acc, paricion) => acc + (paricion.cantidadLechones || 0),
      0,
    );
  }
}
