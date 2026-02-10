export type Situacion =
  | "nulipara"
  | "servida"
  | "gestación confirmada"
  | "parida con lechones"
  | "destetada"
  | "vacía"
  | "descarte"
  | "fallecido";


export interface Servicio {
  tipo: "cerdo" | "inseminacion" | "desconocido";
  fecha?: string | Date;  // <-- puede ser string (input) o Date (para backend)
  macho?: string | null;
  proveedorDosis?: string | null
}

export interface Paricion {
  _id?: string;
  fechaParicion: string | Date; // <-- acepta ambos
  cantidadLechones: number;
  descripcion?: string;
  servicio?: Servicio;
  fechaActualizacion?: string | Date; // <-- igual
}

export interface RangoFecha {
  inicio: Date
  fin: Date
}

export interface VacunaAplicada {
  _id: string;
  vacuna: string | {
    _id: string;
    nombre: string;
    laboratorio: string;
    descripcion: string;
  };
  fechaVacunacion: string;
  dosis?: string;

}

export interface Pig {
  _id: string;
  nroCaravana: number;
  estadio: Situacion;
  fechaFallecido?: Date | string;
  descripcion?: string;
  ubicacion?: string;
  pariciones?: Paricion[];
  lechonesTotal?: number;
  enfermedadActual?: string;
  fechaServicioActual: string;
  posibleFechaParto: RangoFecha;
  createdAt: string;
  updatedAt: string;
  vacunasAplicadas: VacunaAplicada[]
}
