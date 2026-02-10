import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useGetPigByIdQuery,
  useUpdatePigByIdMutation,
} from "../../redux/features/pigSlice";
import type { Situacion } from "../../types/pigTypes";
import Container from "../../ui/Container";
import Card from "../../ui/Card";
import ButtonCustom from "../../ui/ButtonCustom";
import InputCustom from "../../ui/InputCustom";
import type { InputType } from "../../ui/InputCustom";

const UpdaterPork = () => {
  const { id } = useParams<{ id: string }>();

  const { data: pig, isLoading, isError } = useGetPigByIdQuery(id!, { skip: !id });
  const [updatePig] = useUpdatePigByIdMutation();

  const [formData, setFormData] = useState<{
    nroCaravana: number;
    estadio: Situacion | "fallecido";
    ubicacion: string;
    descripcion: string;
    enfermedadActual: string;
    fechaServicioActual: string;
    fechaFallecido: string;
  }>({
    nroCaravana: 0,
    estadio: "nulipara",
    ubicacion: "",
    descripcion: "",
    enfermedadActual: "",
    fechaServicioActual: "",
    fechaFallecido: "",
  });

  const [editing, setEditing] = useState<Record<string, boolean>>({
    nroCaravana: false,
    estadio: false,
    ubicacion: false,
    descripcion: false,
    enfermedadActual: false,
    fechaServicioActual: false,
    fechaFallecido: false,
  });

  useEffect(() => {
    if (pig) {
      setFormData({
        nroCaravana: pig.nroCaravana,
        estadio: pig.estadio,
        ubicacion: pig.ubicacion ?? "",
        descripcion: pig.descripcion ?? "",
        enfermedadActual: pig.enfermedadActual ?? "",
        fechaServicioActual: pig.fechaServicioActual
          ? new Date(pig.fechaServicioActual).toISOString().slice(0, 16)
          : "",
        fechaFallecido: pig.fechaFallecido
          ? new Date(pig.fechaFallecido).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [pig]);

  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: keyof typeof formData) => {
    if (!id) return;

    try {
      const payload: any = { [key]: formData[key] };

      // Validaciones según estadio
      if (key === "enfermedadActual" && formData.estadio !== "descarte") return;
      if (key === "fechaServicioActual" && !["servida", "gestación confirmada"].includes(formData.estadio)) return;
      if (key === "fechaFallecido" && formData.estadio !== "fallecido") return;

      if (["fechaServicioActual", "fechaFallecido"].includes(key)) {
        payload[key] = new Date(formData[key]);
      }

      await updatePig({ id, data: payload }).unwrap();
      setEditing((prev) => ({ ...prev, [key]: false }));
    } catch (err) {
      console.error("Error al actualizar campo:", err);
      alert("Error al actualizar campo");
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError || !pig) return <p>No se encontró el cerdo</p>;

  const renderField = (
    label: string,
    key: keyof typeof formData,
    type: InputType,
    options?: { label: string; value: string }[]
  ) => (
    <div className="flex justify-between items-center">
      <div className="flex-1 mr-2">
        <strong>{label}:</strong>{" "}
        {editing[key] ? (
          type === "textarea" ? (
            <textarea
              value={formData[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="border rounded-lg p-1 h-20 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : type === "select" ? (
            <select
              value={formData[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="border rounded-lg p-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {options?.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.value === "nulipara" && (pig?.pariciones?.length ?? 0) > 0}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <InputCustom
              type={type}
              value={formData[key]}
              onChange={(e) =>
                handleChange(key, type === "number" ? Number(e.target.value) : e.target.value)
              }
            />
          )
        ) : (
          <span>{formData[key] || "-"}</span>
        )}
      </div>
      <ButtonCustom
        onClick={() =>
          editing[key] ? handleSave(key) : setEditing((prev) => ({ ...prev, [key]: true }))
        }
        className={`py-1 px-3 rounded-lg ${
          editing[key] ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
        } text-white transition`}
      >
        {editing[key] ? "Guardar" : "Editar"}
      </ButtonCustom>
    </div>
  );

  return (
    <Container className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
      {/* Datos actuales */}
      <Card className="p-4 shadow rounded-lg">
        <h2 className="text-lg font-bold mb-2">Datos actuales</h2>
        <p>
          <strong>Nro Caravana:</strong> {pig.nroCaravana}
        </p>
        <p>
          <strong>Estadio:</strong> {pig.estadio}
        </p>
        <p>
          <strong>Ubicación:</strong> {pig.ubicacion ?? "-"}
        </p>
        <p>
          <strong>Descripción:</strong> {pig.descripcion ?? "-"}
        </p>
        {pig.estadio === "descarte" && (
          <p>
            <strong>Enfermedad actual:</strong> {pig.enfermedadActual ?? "-"}
          </p>
        )}
        {["servida", "gestación confirmada"].includes(pig.estadio) && (
          <p>
            <strong>Fecha de servicio:</strong>{" "}
            {pig.fechaServicioActual
              ? new Date(pig.fechaServicioActual).toLocaleString()
              : "-"}
          </p>
        )}
        {pig.estadio === "fallecido" && (
          <p>
            <strong>Fecha de fallecido:</strong>{" "}
            {pig.fechaFallecido ? new Date(pig.fechaFallecido).toLocaleString() : "-"}
          </p>
        )}
      </Card>

      {/* Formulario editable */}
      <Card className="p-4 shadow rounded-lg flex flex-col gap-4">
        <h2 className="text-lg font-bold mb-2">Editar campos</h2>
        {renderField("Nro Caravana", "nroCaravana", "number")}
        {renderField("Estadio", "estadio", "select", [
          { label: "Nulípara", value: "nulipara" },
          { label: "Servida", value: "servida" },
          { label: "Gestación confirmada", value: "gestación confirmada" },
          { label: "Parida con lechones", value: "parida con lechones" },
          { label: "Destetada", value: "destetada" },
          { label: "Vacía", value: "vacía" },
          { label: "Descarte", value: "descarte" },
          { label: "Fallecido", value: "fallecido" },
        ])}
        {formData.estadio === "descarte" &&
          renderField("Enfermedad actual", "enfermedadActual", "text")}
        {["servida", "gestación confirmada"].includes(formData.estadio) &&
          renderField("Fecha de servicio", "fechaServicioActual", "datetime-local")}
        {formData.estadio === "fallecido" &&
          renderField("Fecha de fallecido", "fechaFallecido", "datetime-local")}
        {renderField("Ubicación", "ubicacion", "text")}
        {renderField("Descripción", "descripcion", "textarea")}
      </Card>
    </Container>
  );
};

export default UpdaterPork;
