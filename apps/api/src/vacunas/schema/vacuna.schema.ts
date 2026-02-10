import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type VacunaDocument = HydratedDocument<Vacuna>

@Schema({ timestamps: true })
export class Vacuna {
  @Prop({ required: true})
  nombre: string;

  @Prop()
  laboratorio?: string;

  @Prop()
  proveedor?: string;

  @Prop()
  dosis?: string;

  @Prop()
  descripcion?:string
}

export const VacunaSchema = SchemaFactory.createForClass(Vacuna);
