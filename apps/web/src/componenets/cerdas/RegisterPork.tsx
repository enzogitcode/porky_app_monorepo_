import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputCustom from "../../ui/InputCustom";
import ButtonCustom from "../../ui/ButtonCustom";
import Container from "../../ui/Container";
import { useCreateAPigMutation } from "../../redux/features/pigSlice";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nroCaravana: "",
    estadio: "nulipara",
    descripcion: "",
    ubicacion: "",
    enfermedadActual: "",
    fechaServicioActual: "",
    fechaFallecido: "",
  });

  const [createPig, { isLoading }] = useCreateAPigMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validación: nroCaravana no vacío y número válido (evitar Number("") -> 0)
      const rawCaravana = String(form.nroCaravana ?? "").trim();
      if (!rawCaravana) {
        alert("El número de caravana no puede estar vacío");
        return;
      }
      const nroCaravanaNum = Number(rawCaravana);
      if (!Number.isFinite(nroCaravanaNum) || isNaN(nroCaravanaNum)) {
        alert("El número de caravana debe ser válido");
        return;
      }

      const payload: any = {
        nroCaravana: nroCaravanaNum,
        estadio: form.estadio,
        descripcion: form.descripcion || undefined,
        ubicacion: form.ubicacion || undefined,
      };

      // Log del payload previo a enviar para depuración
      console.log("Payload crear cerdo:", payload);

      // Solo enviar enfermedadActual si es descarte
      if (form.estadio === "descarte" && form.enfermedadActual) {
        payload.enfermedadActual = form.enfermedadActual;
      }

      // Solo enviar fechaServicioActual si es servida o gestación confirmada
      if (
        (form.estadio === "servida" ||
          form.estadio === "gestación confirmada") &&
        form.fechaServicioActual
      ) {
        payload.fechaServicioActual = new Date(form.fechaServicioActual);
      }

      // Solo enviar fechaFallecido si es fallecido
      if (form.estadio === "fallecido" && form.fechaFallecido) {
        payload.fechaFallecido = new Date(form.fechaFallecido);
      }
      const newPig = await createPig(payload).unwrap();
      console.log("Respuesta crear cerdo:", newPig);
      navigate(`/pigs/${newPig._id}`);
    } catch (err: any) {
      // Logueo detallado para depuración: RTK Query devuelve un objeto error
      console.error("ERROR COMPLETO:", err);
      try {
        console.error(
          "ERROR DETAILS:",
          JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
        );
      } catch (e) {
        console.error("No se pudo serializar el error:", e);
      }
      console.error("ERR.DATA:", err?.data);
      console.error("ERR.STATUS:", err?.status);
      alert(err?.data?.message ?? err?.error ?? "Error al crear cerdo");
    }
  };

  return (
    <Container className="flex flex-col items-center containerBg min-h-screen py-8">
      <h1 className="text-3xl font-bold mt-4 mb-6">Registrar Cerdo</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg flex flex-col gap-6"
      >
        {/* Nro Caravana */}
        <InputCustom
          label="Nro Caravana"
          type="number"
          value={form.nroCaravana}
          inputClassName="text-center"
          onChange={(e) => setForm({ ...form, nroCaravana: e.target.value })}
          required
        />

        {/* Estadio */}
        <div className="flex flex-col gap-1">
          <label htmlFor="estadio" className="font-semibold">
            Estadio
          </label>
          <select
            id="estadio"
            value={form.estadio}
            onChange={(e) => setForm({ ...form, estadio: e.target.value })}
            className="border rounded-lg p-2 bg-white"
          >
            <option value="nulipara">Nulípara</option>
            <option value="servida">Servida</option>
            <option value="gestación confirmada">Gestación confirmada</option>
            <option value="parida con lechones">Parida con lechones</option>
            <option value="destetada">Destetada</option>
            <option value="vacía">Vacía</option>
            <option value="descarte">Descarte</option>
            <option value="fallecido">Fallecido</option>
          </select>
        </div>

        {/* Enfermedad actual (solo para descarte) */}
        {form.estadio === "descarte" && (
          <InputCustom
            label="Enfermedad actual"
            type="text"
            value={form.enfermedadActual}
            onChange={(e) =>
              setForm({ ...form, enfermedadActual: e.target.value })
            }
          />
        )}

        {/* Fecha de servicio (solo servida / gestación confirmada) */}
        {(form.estadio === "servida" ||
          form.estadio === "gestación confirmada") && (
          <InputCustom
            label="Fecha de servicio"
            type="datetime-local"
            value={form.fechaServicioActual}
            onChange={(e) =>
              setForm({ ...form, fechaServicioActual: e.target.value })
            }
          />
        )}

        {/* Fecha de fallecido (solo fallecido) */}
        {form.estadio === "fallecido" && (
          <InputCustom
            label="Fecha de fallecimiento"
            type="datetime-local"
            value={form.fechaFallecido}
            onChange={(e) =>
              setForm({ ...form, fechaFallecido: e.target.value })
            }
          />
        )}

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <label htmlFor="descripcion" className="font-semibold">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="border rounded-lg p-2 h-28 resize-none"
          />
        </div>

        {/* Ubicación */}
        <InputCustom
          label="Ubicación"
          type="text"
          value={form.ubicacion}
          onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
        />

        <ButtonCustom type="submit">
          {isLoading ? "Creando..." : "Registrar Cerdo"}
        </ButtonCustom>
      </form>
    </Container>
  );
};

export default Register;
