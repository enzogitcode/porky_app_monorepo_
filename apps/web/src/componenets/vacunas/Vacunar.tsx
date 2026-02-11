import React, { useState } from "react";
import { useGetAllVacunasQuery } from "../../redux/features/vacunaSlice";
import { useGetAllPigsArrayQuery, useVacunarPigMutation } from "../../redux/features/pigSlice";
import ButtonCustom from "../../ui/ButtonCustom";
import type { Vacuna } from "../../types/vacunaType";
import type { Pig } from "../../types/pigTypes";

const Vacunar: React.FC = () => {
  const { data: vacunas } = useGetAllVacunasQuery();
  const { data: pigs } = useGetAllPigsArrayQuery({ page: 1 });
  const [vacunarPig] = useVacunarPigMutation();

  // Estados
  const [vacunaSeleccionada, setVacunaSeleccionada] = useState<string>("");
  const [fechaVacunacion, setFechaVacunacion] = useState<string>("");
  const [dosisNumero, setDosisNumero] = useState<string>("");
  const [dosisUnidad, setDosisUnidad] = useState<string>("");
  const [pigsSeleccionados, setPigsSeleccionados] = useState<string[]>([]);

  // Toggle selección de cerdas
  const togglePig = (pigId: string) => {
    setPigsSeleccionados(prev =>
      prev.includes(pigId) ? prev.filter(id => id !== pigId) : [...prev, pigId]
    );
  };

  // Aplicar vacuna
  const handleVacunar = async () => {
    if (!vacunaSeleccionada || !fechaVacunacion || pigsSeleccionados.length === 0) {
      alert("Seleccione vacuna, fecha y al menos una cerda");
      return;
    }

    // Concatenar dosis en un string
    const dosis = `${dosisNumero} ${dosisUnidad}`.trim();

    const payloads = pigsSeleccionados.map((pigId) => ({
      pigId,
      vacunaId: vacunaSeleccionada,
      fechaVacunacion,
      dosis,
    }));

    console.log("Payloads a enviar al backend:", payloads);

    try {
      await Promise.all(payloads.map(p => vacunarPig(p).unwrap()));
      alert("Vacunación aplicada correctamente");
      setPigsSeleccionados([]);
      setVacunaSeleccionada("");
      setFechaVacunacion("");
      setDosisNumero("");
      setDosisUnidad("");
    } catch (error) {
      console.error(error);
      alert("Error al aplicar vacuna");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Vacunar múltiples cerdas</h2>

      {/* Selección de vacuna */}
      <div>
        <label className="font-semibold">Vacuna</label>
        <select
          className="border p-2 w-full"
          value={vacunaSeleccionada}
          onChange={(e) => setVacunaSeleccionada(e.target.value)}
        >
          <option value="">Seleccione una vacuna</option>
          {vacunas?.map((v: Vacuna) => (
            <option key={v._id} value={v._id}>
              {v.nombre} {v.laboratorio ? `- ${v.laboratorio}` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha de vacunación */}
      <div>
        <label className="font-semibold">Fecha de vacunación</label>
        <input
          type="datetime-local"
          className="border p-2 w-full"
          value={fechaVacunacion}
          onChange={(e) => setFechaVacunacion(e.target.value)}
        />
      </div>

      {/* Dosis */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="font-semibold">Cantidad</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={dosisNumero}
            onChange={(e) => setDosisNumero(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="font-semibold">Unidad</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={dosisUnidad}
            onChange={(e) => setDosisUnidad(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de cerdas */}
      <div className="space-y-2 max-h-64 overflow-y-auto border p-3">
        {pigs
          ?.filter((pig: Pig) => pig.estadio !== "fallecido")
          .map((pig: Pig) => (
            <label key={pig._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={pigsSeleccionados.includes(pig._id)}
                onChange={() => togglePig(pig._id)}
              />
              <span>
                Caravana #{pig.nroCaravana} – {pig.estadio}
              </span>
            </label>
          ))}
      </div>

      <ButtonCustom onClick={handleVacunar} className="bg-green-600 text-white">
        Aplicar vacuna
      </ButtonCustom>
    </div>
  );
};

export default Vacunar;
