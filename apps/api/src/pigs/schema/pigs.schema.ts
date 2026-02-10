import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { Situacion } from '../dto/create-pig.dto';
import { Vacuna } from '../../vacunas/schema/vacuna.schema';
import { Types } from 'mongoose';

export type PigDocument = HydratedDocument<Pig>;

@Schema()
export class Servicio {
  @Prop({ enum: ['cerdo', 'inseminacion', 'desconocido'], required: true })
  tipo: 'cerdo' | 'inseminacion' | 'desconocido';

  @Prop({ type: Date, required: false })
  fecha?: Date;

  @Prop({ required: false })
  macho?: string | null;

  @Prop({ required: false })
  proveedorDosis?: string;
}

@Schema()
export class Paricion {
  @Prop({ type: Date, required: true })
  fechaParicion: Date;

  @Prop({ required: true })
  cantidadLechones: number;

  @Prop({ required: false })
  descripcion?: string;

  @Prop({ type: Object, required: false })
  servicio?: Servicio;

  @Prop({ type: Date, default: Date.now })
  fechaActualizacion: Date;
}

@Schema({ timestamps: true })
export class VacunaAplicada {
  @Prop({ type: Types.ObjectId, ref: Vacuna.name, required: true })
  vacuna: Types.ObjectId;

  @Prop({ type: Date, required: true })
  fechaVacunacion: Date;
}



@Schema({ timestamps: true })
export class Pig {
  @Prop({ isInteger: true})
  nroCaravana: number;

  @Prop({ type: [VacunaAplicada], default: [], required: true })
  vacunasAplicadas: VacunaAplicada[];

  @Prop({ type: Date, required: false })
  fechaServicioActual?: Date;

  @Prop({ type: Object, required: false })
  posibleFechaParto?: { inicio: Date; fin: Date };


  @Prop({ required: false })
  descripcion?: string;

  @Prop({ required: true })
  estadio: Situacion;

  @Prop({ type: [Paricion], default: [] })
  pariciones?: Paricion[];

  @Prop({ required: false })
  ubicacion?: string;

  @Prop({ required: false })
  estaEnferma?: boolean

  @Prop({ required: false })
  enfermedadActual?: string;

  @Prop({ required: false })
  imageProfile?: string

  @Prop({ type: [String], required: false })
  imageUrls?: string[];
}

export const PigSchema = SchemaFactory.createForClass(Pig);

/* --------------------------------------------
   Middleware: calcular posibleFechaParto automáticamente
--------------------------------------------- */
PigSchema.pre('save', function (next) {
  try {
    if (
      this.estadio === 'servida' ||
      this.estadio === 'gestación confirmada'
    ) {
      if (this.fechaServicioActual) {
        const inicio = new Date(this.fechaServicioActual);
        inicio.setDate(inicio.getDate() + 116);

        const fin = new Date(this.fechaServicioActual);
        fin.setDate(fin.getDate() + 120);

        this.posibleFechaParto = { inicio, fin };
      }
    } else {
      this.posibleFechaParto = undefined;
    }

    next();
  } catch (e) {
    next(e);
  }
});

PigSchema.pre('findOneAndUpdate', function (next) {
  try {
    const update: any = this.getUpdate();
    if (!update) return next();

    const estadio = update.estadio ?? update.$set?.estadio;
    const fechaServicioActual =
      update.fechaServicioActual ?? update.$set?.fechaServicioActual;

    if (estadio === 'servida' || estadio === 'gestación confirmada') {
      if (fechaServicioActual) {
        const inicio = new Date(fechaServicioActual);
        inicio.setDate(inicio.getDate() + 116);

        const fin = new Date(fechaServicioActual);
        fin.setDate(fin.getDate() + 120);

        update.$set = {
          ...update.$set,
          posibleFechaParto: { inicio, fin },
        };
      }
    } else {
      update.$set = { ...update.$set, posibleFechaParto: undefined };
    }

    next();
  } catch (e) {
    next(e);
  }
});

/* --------------------------------------------
   VIRTUAL: lechonesTotal
--------------------------------------------- */
PigSchema.virtual('lechonesTotal').get(function () {
  if (!this.pariciones) return 0;

  return this.pariciones.reduce(
    (acc: number, p: Paricion) => acc + (p.cantidadLechones || 0),
    0
  );
});

/* --------------------------------------------
   Habilitar virtuals en JSON / object
--------------------------------------------- */
PigSchema.set('toJSON', { virtuals: true });
PigSchema.set('toObject', { virtuals: true });
