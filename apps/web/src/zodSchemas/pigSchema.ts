// src/schemas/pigSchema.ts

import { z } from "zod";
import { paricionSchema } from "./paricionSchema";

// PIG -------------------------------------------------------

export const pigSchema = z.object({
  _id: z.string(),

  nroCaravana: z.number(),

  estadio: z.enum([
    "pregnant",
    "parida con lechones",
    "servida",
    "enferma",
    "ninguno",
  ]),

  descripcion: z.string().optional(),
  ubicacion: z.string().optional(),

  pariciones: z.array(paricionSchema).optional(),

  createdAt: z.string().transform((v) => new Date(v)),
  updatedAt: z.string().transform((v) => new Date(v)),
});
