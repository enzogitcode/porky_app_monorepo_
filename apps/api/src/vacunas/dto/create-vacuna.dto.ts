import { IsNotEmpty, IsString } from "class-validator";

export class CreateVacunaDto {
    @IsNotEmpty()
    @IsString()
    nombre:string
    
    @IsString()
    dosis:string

    @IsString()
    laboratorio:string

    @IsString()
    descripcion:string
    
    @IsString()
    proveedor:string
}
