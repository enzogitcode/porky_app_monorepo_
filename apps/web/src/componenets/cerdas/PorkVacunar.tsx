import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPigByIdQuery, useVacunarPigMutation } from "../../redux/features/pigSlice";
import { useGetAllVacunasQuery } from "../../redux/features/vacunaSlice";

const PorkVacunar = () => {
  // ID del cerdo desde la URL
  const { id } = useParams<{ id: string }>();

  // Traer vacunas desde Redux
  const {
    data: vacunas,
    isLoading,
    isError,
    isFetching,
  } = useGetAllVacunasQuery();

  const {data} = useGetPigByIdQuery(id!, {skip:!id})

  // Mutation para vacunar
  const [vacunarPig, { isSuccess, isLoading: isVacunando }] =
    useVacunarPigMutation();

  /**
   * Fechas de vacunación por vacuna
   * key: vacunaId
   * value: YYYY-MM-DD
   */
  const [fechas, setFechas] = useState<Record<string, string>>({});

  if (isLoading || isFetching) return <p>Cargando vacunas...</p>;
  if (isError) return <p>Error al cargar las vacunas.</p>;

  const handleFechaChange = (vacunaId: string, value: string) => {
    setFechas((prev) => ({
      ...prev,
      [vacunaId]: value,
    }));
  };

  const handleVacunar = async (vacunaId: string) => {
    if (!id) return;

    const fechaVacunacion = fechas[vacunaId];

    if (!fechaVacunacion) {
      alert("Seleccioná una fecha de vacunación");
      return;
    }

    try {
      await vacunarPig({
        pigId: id,
        vacunaId,
        fechaVacunacion, // string YYYY-MM-DD
      }).unwrap();

      alert("Cerdo vacunado con éxito");
    } catch (error) {
      alert("Error al vacunar el cerdo");
    }
  };

  return (
    <div>
      <h2 className="text-2xl text-center">Vacunar Cerdo Id° {id}</h2>
      <h2 className="text-2xl text-center">Vacunar Cerdo Caravana N° {data?.nroCaravana}</h2>

      {vacunas?.map((vacuna) => (
        <div
          key={vacuna._id}
          className="grid md:grid-cols-3 items-center bg-amber-300 m-2 p-2 rounded gap-2"
        >
          <div>
            <h3 className="font-bold flex justify-center items-center">
              {vacuna.nombre}
            </h3>
            <div className="grid md:grid-rows-2 items-center-safe place-items-center text-center">
              <div>
                <p>Laboratorio: {vacuna.laboratorio}</p>
                <p>Proveedor: {vacuna.proveedor}</p>
                <p>Dosis: {vacuna.dosis}</p>
              </div>
              <div>
                <p>Descripción: {vacuna.descripcion}</p>
              </div>
            </div>
          </div>

          <input
            type="datetime-local"
            value={fechas[vacuna._id] || ""}
            onChange={(e) => handleFechaChange(vacuna._id, e.target.value)}
            className="border p-1 rounded flex justify-center items-center"
          />

          <div className="flex items-center justify-center">
            <button
              className="showButton"
              onClick={() => handleVacunar(vacuna._id)}
              disabled={isVacunando}
            >
              Vacunar
            </button>
          </div>
        </div>
      ))}

      {isSuccess && (
        <p className="text-green-700 mt-4">
          Vacunación registrada correctamente ✅
        </p>
      )}
    </div>
  );
};

export default PorkVacunar;
