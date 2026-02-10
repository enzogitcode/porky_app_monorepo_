import React, { useState } from "react";
import { useGetAllVacunasQuery } from "../../redux/features/vacunaSlice";
import { useGetAllPigsArrayQuery, useVacunarPigMutation } from "../../redux/features/pigSlice";
import ButtonCustom from "../../ui/ButtonCustom";

const Vacunar: React.FC = () => {
  const { data: vacunas } = useGetAllVacunasQuery();
  const { data: pigs } = useGetAllPigsArrayQuery({page:1});

  const [vacunarPig] = useVacunarPigMutation();

  const [vacunaSeleccionada, setVacunaSeleccionada] = useState("");
  const [fechaVacunacion, setFechaVacunacion] = useState("");
  const [pigsSeleccionados, setPigsSeleccionados] = useState<string[]>([]);

  const togglePig = (pigId: string) => {
    setPigsSeleccionados((prev) =>
      prev.includes(pigId)
        ? prev.filter((id) => id !== pigId)
        : [...prev, pigId]
    );
  };

  const handleVacunar = async () => {
    if (!vacunaSeleccionada || !fechaVacunacion || pigsSeleccionados.length === 0) {
      alert("Seleccione vacuna, fecha y al menos una cerda");
      return;
    }

    try {
      await Promise.all(
        pigsSeleccionados.map((pigId) =>
          vacunarPig({
            pigId,
            vacunaId: vacunaSeleccionada,
            fechaVacunacion,
          }).unwrap()
        )
      );

      alert("Vacunación aplicada correctamente");
      setPigsSeleccionados([]);
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
          {vacunas?.map((v) => (
            <option key={v._id} value={v._id} className="gap-3">
              <p>Nombre: {v.nombre}</p>
              <p>Proveedor: {v.laboratorio}</p>
              <p>Laboratorio: {v.laboratorio}</p>
              
            </option>
          ))}
        </select>
      </div>

      {/* Fecha */}
      <div>
        <label className="font-semibold">Fecha de vacunación</label>
        <input
          type="datetime-local"
          className="border p-2 w-full"
          value={fechaVacunacion}
          onChange={(e) => setFechaVacunacion(e.target.value)}
        />
      </div>

      {/* Lista de pigs */}
      <div className="space-y-2 max-h-64 overflow-y-auto border p-3">
        {pigs?.filter(pig => pig.estadio !== 'fallecido').map((pig) => (
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
