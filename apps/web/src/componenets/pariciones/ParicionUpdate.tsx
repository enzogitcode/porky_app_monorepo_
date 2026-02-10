// src/components/paricion/ParicionUpdate.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ButtonCustom from "../../ui/ButtonCustom";
import InputCustom from "../../ui/InputCustom";
import {
  useGetPigByIdQuery,
  usePatchParicionMutation,
} from "../../redux/features/pigSlice";
import { paricionSchema } from "../../zodSchemas/paricionSchema";
import type { Paricion } from "../../types/pigTypes";

const ParicionUpdate: React.FC = () => {
  const { id, paricionId } = useParams<{ id: string; paricionId: string }>();
  const navigate = useNavigate();

  const { data: pig, isLoading, isError } = useGetPigByIdQuery(id!, { skip: !id });
  const [patchParicion, { isLoading: isUpdating }] = usePatchParicionMutation();

  const [paricion, setParicion] = useState({
    fechaParicion: "",
    cantidadLechones: "",
    descripcion: "",
    servicio: {
      tipo: "desconocido",
      fecha: "",
      macho: "",
    },
  });

  // Inicializar con datos de la parición encontrada
  useEffect(() => {
    if (pig && paricionId) {
      const found = pig.pariciones?.find((p) => p._id === paricionId);
      if (found) {
        setParicion({
          fechaParicion:
            typeof found.fechaParicion === "string"
              ? found.fechaParicion.split("T")[0]
              : "",
          cantidadLechones: String(found.cantidadLechones ?? ""),
          descripcion: found.descripcion ?? "",
          servicio: {
            tipo: found.servicio?.tipo ?? "desconocido",
            fecha: found.servicio?.fecha
              ? (typeof found.servicio.fecha === "string"
                  ? found.servicio.fecha.split("T")[0]
                  : "")
              : "",
            macho: found.servicio?.macho ?? "",
          },
        });
      }
    }
  }, [pig, paricionId]);

  const handleChange = (field: string, value: any) => {
    setParicion((prev) => ({ ...prev, [field]: value }));
  };

  const handleServicioChange = (field: string, value: any) => {
    setParicion((prev) => ({
      ...prev,
      servicio: { ...prev.servicio, [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !paricionId) {
      alert("No se encontró el ID del cerdo o de la parición");
      return;
    }

    // 🔍 VALIDACIÓN con Zod
    const validation = paricionSchema.safeParse(paricion);
    if (!validation.success) {
      alert(validation.error.issues[0].message);
      return;
    }

    const parsed = validation.data;

    // 🛠 FORMATEO para BACKEND
    const formatted: Paricion = {
      fechaParicion: new Date(parsed.fechaParicion).toISOString(),
      cantidadLechones: Number(parsed.cantidadLechones),
      descripcion: parsed.descripcion || "",
      fechaActualizacion: new Date().toISOString(),
      servicio:
        parsed.servicio.tipo === "desconocido"
          ? { tipo: "desconocido" as const }
          : {
              tipo: parsed.servicio.tipo as "cerdo" | "inseminacion",
              fecha: new Date(parsed.servicio.fecha!).toISOString(),
              ...(parsed.servicio.tipo === "cerdo" && { macho: parsed.servicio.macho }),
            },
    };

    try {
      await patchParicion({
        pigId: id,
        paricionId,
        data: formatted,
      }).unwrap();
      alert("Parición actualizada correctamente");
      navigate(`/pigs/${id}`);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar");
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError || !pig) return <p>No se encontró el cerdo</p>;

  return (
<form
  onSubmit={handleSubmit}
  className="form-base"
>
  {/* Fecha */}
  <div className="flex flex-col gap-1">
    <InputCustom
      label="Fecha de Parición"
      type="datetime-local"
      value={paricion.fechaParicion}
      onChange={(e) => handleChange("fechaParicion", e.target.value)}
    />
  </div>

  {/* Lechones */}
  <div className="flex flex-col gap-1">
    <InputCustom
      label="Cantidad de Lechones"
      type="number"
      value={paricion.cantidadLechones}
      onChange={(e) => handleChange("cantidadLechones", e.target.value)}
    />
  </div>

  {/* Descripción */}
  <div className="flex flex-col gap-1">
    <InputCustom
      label="Descripción"
      type="text"
      value={paricion.descripcion}
      onChange={(e) => handleChange("descripcion", e.target.value)}
    />
  </div>

  {/* Servicio */}
  <div className="flex flex-col gap-2 pt-2 border-t">
    <h4 className="text-lg font-semibold text-gray-700">Servicio</h4>

    <select
      value={paricion.servicio.tipo}
      onChange={(e) => handleServicioChange("tipo", e.target.value)}
      className="border rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="cerdo">Cerdo</option>
      <option value="inseminacion">Inseminación</option>
      <option value="desconocido">Desconocido</option>
    </select>

    {paricion.servicio.tipo !== "desconocido" && (
      <div className="flex flex-col gap-3">

        <InputCustom
          label="Fecha del Servicio"
          type="datetime-local"
          value={paricion.servicio.fecha}
          onChange={(e) => handleServicioChange("fecha", e.target.value)}
        />

        {paricion.servicio.tipo === "cerdo" && (
          <InputCustom
            label="Macho"
            type="text"
            value={paricion.servicio.macho}
            onChange={(e) => handleServicioChange("macho", e.target.value)}
          />
        )}
      </div>
    )}
  </div>

  {/* Botón */}
  <div className="pt-4 border-t">
    <ButtonCustom
      type="submit"
      className="w-full bg-blue-600 text-white hover:bg-blue-700 transition rounded-lg py-2"
    >
      {isUpdating ? "Actualizando..." : "Guardar cambios"}
    </ButtonCustom>
  </div>
</form>

  );
};

export default ParicionUpdate;
