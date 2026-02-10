import { useParams } from "react-router-dom";
import { useState } from "react";
import Container from "../../ui/Container";
import ButtonCustom from "../../ui/ButtonCustom";
import InputCustom from "../../ui/InputCustom";

import { useGetVacunaByIdQuery } from "../../redux/features/vacunaSlice";
import {
  useGetAllPigsArrayQuery,
  useVacunarPigMutation,
} from "../../redux/features/pigSlice";

const VacunarConUnaVacuna = () => {
  const { vacunaId } = useParams<{ vacunaId: string }>();

  const {
    data: vacuna,
    isLoading: isLoadingVacuna,
    isError: isErrorVacuna,
  } = useGetVacunaByIdQuery(vacunaId!, { skip: !vacunaId });

  const {
    data: pigs,
    isLoading: isLoadingPig,
    isError: isErrorPig,
  } = useGetAllPigsArrayQuery({ limit: 1000 });

  const [vacunarPig] = useVacunarPigMutation();

  // Estados
  const [pigsSeleccionados, setPigsSeleccionados] = useState<string[]>([]);
  const [usarFechaGeneral, setUsarFechaGeneral] = useState(true);
  const [fechaGeneral, setFechaGeneral] = useState("");
  const [fechasPorCerda, setFechasPorCerda] = useState<Record<string, string>>(
    {}
  );

  // Seleccionar / deseleccionar cerda
  const togglePig = (pigId: string) => {
    setPigsSeleccionados((prev) =>
      prev.includes(pigId)
        ? prev.filter((id) => id !== pigId)
        : [...prev, pigId]
    );
  };

  // Vacunación masiva con confirmación
  const handleVacunarTodas = async () => {
    if (!vacunaId) return;

    if (pigsSeleccionados.length === 0) {
      alert("Seleccione al menos una cerda");
      return;
    }

    if (usarFechaGeneral && !fechaGeneral) {
      alert("Debe seleccionar una fecha general");
      return;
    }

    if (!usarFechaGeneral) {
      const faltaFecha = pigsSeleccionados.some((id) => !fechasPorCerda[id]);
      if (faltaFecha) {
        alert("Todas las cerdas seleccionadas deben tener fecha");
        return;
      }
    }

    const confirmar = window.confirm(
      `¿Está seguro que desea aplicar la vacuna "${vacuna?.nombre}" a ${pigsSeleccionados.length} cerdas?`
    );

    if (!confirmar) return;

    try {
      await Promise.all(
        pigsSeleccionados.map((pigId) => {
          const fecha = usarFechaGeneral ? fechaGeneral : fechasPorCerda[pigId];

          return vacunarPig({
            pigId,
            vacunaId,
            fechaVacunacion: new Date(fecha).toISOString(),
          }).unwrap();
        })
      );

      alert("Vacunación aplicada correctamente");

      setPigsSeleccionados([]);
      setFechaGeneral("");
      setFechasPorCerda({});
    } catch (error) {
      console.error(error);
      alert("Error al aplicar la vacuna");
    }
  };

  // Estados de carga / error
  if (isLoadingVacuna || isLoadingPig)
    return (
      <Container>
        <h1>Cargando datos...</h1>
      </Container>
    );

  if (isErrorVacuna || !vacuna)
    return (
      <Container>
        <h1>Error al cargar la vacuna</h1>
      </Container>
    );

  if (isErrorPig || !pigs)
    return (
      <Container>
        <h1>Error al cargar las cerdas</h1>
      </Container>
    );

  // Render
  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-center font-bold">
        Vacunar cerdas con: {vacuna.nombre}
      </h1>

      <div className="justify-center-safe items-center-safe p-3 space-y-6">
        {/* Fecha general */}
        <div className="border p-4 rounded-lg space-y-2">
          <label className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              checked={usarFechaGeneral}
              onChange={(e) => setUsarFechaGeneral(e.target.checked)}
            />
            Usar una fecha general para todas las cerdas
          </label>

          {usarFechaGeneral && (
            <InputCustom
              type="datetime-local"
              label="Fecha general de vacunación"
              value={fechaGeneral}
              onChange={(e) => setFechaGeneral(e.target.value)}
            />
          )}
        </div>

        {/* Listado de cerdas */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pigs.filter(pig => pig.estadio !== 'fallecido').map((pig) => (
            <div
              key={pig._id}
              className="border p-4 rounded-lg shadow space-y-2"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pigsSeleccionados.includes(pig._id)}
                  onChange={() => togglePig(pig._id)}
                />
                Seleccionar
              </label>

              <h2 className="font-semibold">N° Caravana: {pig.nroCaravana}</h2>
              <p>Estadio: {pig.estadio}</p>

              {!usarFechaGeneral && pigsSeleccionados.includes(pig._id) && (
                <InputCustom
                  type="datetime-local"
                  label="Fecha de vacunación"
                  value={fechasPorCerda[pig._id] || ""}
                  onChange={(e) =>
                    setFechasPorCerda((prev) => ({
                      ...prev,
                      [pig._id]: e.target.value,
                    }))
                  }
                />
              )}
            </div>
          ))}
        </div>

        {/* Botón final */}
        <div className="flex justify-center">
          <ButtonCustom
            onClick={handleVacunarTodas}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
          >
            Aplicar vacuna a seleccionadas
          </ButtonCustom>
        </div>
      </div>
    </div>
  );
};

export default VacunarConUnaVacuna;
