import { ParicionDto, Situacion, VacunaAplicadaDto } from "../dto/create-pig.dto";

export class Pig {
  nroCaravana: number;
  ubicacion:string
  descripcion?: string;
  fechaFallecimiento?: Date;
  pariciones?: ParicionDto[];
  estadio: Situacion;
  Vacunas?:VacunaAplicadaDto[]
}

