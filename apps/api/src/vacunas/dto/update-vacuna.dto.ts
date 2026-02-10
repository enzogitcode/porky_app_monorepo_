import { PartialType } from '@nestjs/mapped-types';
import { CreateVacunaDto } from './create-vacuna.dto';
import { IsString } from 'class-validator';

export class UpdateVacunaDto extends PartialType(CreateVacunaDto) {
    @IsString()
    dosis: string

    @IsString()
    laboratorio: string

    @IsString()
    descripcion: string

    @IsString()
    proveedor: string
}
