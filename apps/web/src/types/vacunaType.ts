export interface Vacuna {
  _id:string
  nombre: string;
  laboratorio?: string;
  proveedor?: string;
  descripcion?:string 
  createdAt: string
  updatedAt: string
}