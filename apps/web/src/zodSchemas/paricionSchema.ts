// src/zodSchemas/paricionSchema.ts
import { z } from "zod";

export const paricionSchema = z.object({
  fechaParicion: z
    .string()
    .min(1, "La fecha de parición es obligatoria"),

  cantidadLechones: z
    .string()
    .min(1, "Debes ingresar la cantidad de lechones")
    .refine((v) => !isNaN(Number(v)), "Debe ser un número válido"),

  descripcion: z.string().optional(),

  servicio: z.object({
    tipo: z.enum(["cerdo", "inseminacion", "desconocido"]),
    fecha: z.string().optional(),
    macho: z.string().optional(),
    proveedorDosis:z.string().optional()
  })
  .refine(
    (data) => {
      if (data.tipo === "desconocido") return true;
      return !!data.fecha && data.fecha !== "";
    },
    {
      message: "La fecha de servicio es obligatoria",
      path: ["fecha"],
    }
  )
  .refine(
    (data) => {
      if (data.tipo !== "cerdo") return true;
      return !!data.macho && data.macho.trim() !== "";
    },
    {
      message: "El macho es obligatorio para servicio tipo cerdo",
      path: ["macho"],
    }
  ),
});
