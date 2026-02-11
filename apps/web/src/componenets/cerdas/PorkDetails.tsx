import { useParams, useNavigate } from "react-router-dom";
import {
  useGetPigByIdQuery,
  useDeletePigByIdMutation,
  useDeleteParicionMutation,
  useEliminarVacunaDePigMutation,
} from "../../redux/features/pigSlice";
import ButtonCustom from "../../ui/ButtonCustom";
import Card from "../../ui/Card";
import Container from "../../ui/Container";
import ParicionesList from "../pariciones/ParicionesListByPig";
import { useState } from "react";
import Swal from "sweetalert2";
import PorkVacunaAplicadaCard from "./PorkVacunaAplicadaCard";
import PorkVacunaAplicadaDetails from "./PorkVacunaAplicadaDetails";
import type { VacunaAplicada } from "../../types/pigTypes";

const PorkDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: pig,
    isLoading,
    isError,
  } = useGetPigByIdQuery(id!, { skip: !id });

  const [
    eliminarVacuna,
    {
      isError: eliminarVacunaError,
      isLoading: eliminarVacunaLoading,
      isSuccess: eliminarVacunaSuccess,
    },
  ] = useEliminarVacunaDePigMutation();

  const [deletePigById, { isLoading: isDeleting }] = useDeletePigByIdMutation();
  const [deleteParicion] = useDeleteParicionMutation();

  // 🔴 ELIMINAR CERDO (CONFIRMACIÓN)
  const handleDelete = async () => {
    if (!id) return;

    const result = await Swal.fire({
      title: "¿Eliminar cerdo?",
      text: "⚠️ Se eliminarán también todas las pariciones y datos asociados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deletePigById(id).unwrap();
      await Swal.fire(
        "Eliminado",
        "El cerdo fue eliminado correctamente",
        "success",
      );
      navigate("/pigs");
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el cerdo", "error");
      console.error("Error al eliminar cerdo:", error);
    }
  };

  // 🔴 ELIMINAR PARICIÓN (CONFIRMACIÓN)
  const handleDeleteParicion = async (paricionId: string) => {
    if (!id) return;

    const result = await Swal.fire({
      title: "¿Eliminar parición?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteParicion({ pigId: id, paricionId }).unwrap();
      Swal.fire(
        "Eliminada",
        "La parición fue eliminada correctamente",
        "success",
      );
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar la parición", "error");
      console.error("Error al eliminar parición:", error);
    }
  };

  const [showVacunas, setShowVacunas] = useState(true);
  const [showPariciones, setShowPariciones] = useState(true);

  const handleDeleteVacunaPork = (vacunaId: string) => {
    //completar función para eliminar vacuna

    if (!vacunaId) return;

    Swal.fire({
      title: "¿Eliminar vacuna?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        // Aquí deberías llamar a tu mutation para eliminar la vacuna
        // Por ejemplo: await deleteVacuna({ pigId: pig._id, vacunaId }).unwrap();
        await eliminarVacuna({ pigId: id!, vacunaId }).unwrap();
        if (eliminarVacunaError) {
          Swal.fire("Error", "No se pudo eliminar la vacuna", "error");
          throw new Error("Error al eliminar la vacuna");
        }
        if (eliminarVacunaSuccess) {
          Swal.fire(
            "Eliminada",
            "La vacuna fue eliminada correctamente",
            "success",
          );
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la vacuna", "error");
        console.error("Error al eliminar vacuna:", error);
      }
    });
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError || !pig) return <p>No se encontró el cerdo</p>;

  return (
    <Container className="text-center flex-col">
      <h1 className="text-5xl mb-3">Cerdo N° {pig.nroCaravana}</h1>

      <Card>
        <p>ID: {pig._id}</p>

        <div>
          <p>
            <strong>Lechones Total Paridos:</strong> {pig.lechonesTotal}
          </p>
          <p>
            <strong>Estadio:</strong> {pig.estadio}
          </p>
          <p>
            <strong>Ubicación:</strong> {pig.ubicacion}
          </p>
          <p>
            <strong>Descripción:</strong> {pig.descripcion}
          </p>
          <p>
            <strong>Creado:</strong>{" "}
            {new Date(pig.createdAt).toLocaleDateString()}{" "}
            <strong>Hora:</strong>{" "}
            {new Date(pig.createdAt).toLocaleTimeString()}
          </p>
          <p>
            <strong>Actualizado:</strong>{" "}
            {new Date(pig.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </Card>

      <h3 className="text-2xl">Vacunas</h3>
      {pig?.vacunasAplicadas?.length === 0 ? (
        <Card>
          <h4>No hay vacunas aplicadas aún</h4>
        </Card>
      ) : (
        <div className="border-2 border-amber-700 rounded">
          <ButtonCustom
            className="showButton"
            onClick={() => setShowVacunas(!showVacunas)}
          >
            {showVacunas ? "Ocultar vacunas" : "Ver vacunas"}
          </ButtonCustom>
          <div className=" flex flex-wrap bg- justify-evenly ">
            {showVacunas &&
              pig.vacunasAplicadas.map((vacuna: VacunaAplicada) => (
                <div
                  key={vacuna._id}
                  className="flex flex-col outline-2 outline-amber-400 m-2 p-2 rounded-2xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <PorkVacunaAplicadaCard {...vacuna} />
                    {typeof vacuna.vacuna !== "string" && (
                      <PorkVacunaAplicadaDetails vacunaId={vacuna.vacuna._id} />
                    )}
                  </div>
                  <ButtonCustom
                    className="dangerButton self-center-safe"
                    onClick={() => handleDeleteVacunaPork(vacuna._id)}
                  >
                    {eliminarVacunaLoading
                      ? "Eliminando vacuna..."
                      : "Eliminar Vacuna"}
                  </ButtonCustom>
                </div>
              ))}
          </div>
        </div>
      )}

      <h3 className="text-2xl">Pariciones</h3>
      <div className="flex justify-center items-center bg-amber-300">
        {pig.pariciones?.length !== 0 && (
          <ButtonCustom
            className="m-1 p-1 updateButton"
            onClick={() => setShowPariciones(!showPariciones)}
          >
            {showPariciones ? "Ocultar pariciones" : "Mostrar pariciones"}
          </ButtonCustom>
        )}
      </div>

      {/* Pariciones container */}
      {showPariciones &&
        (pig.pariciones && pig.pariciones.length > 0 ? (
          <ParicionesList
            pariciones={pig.pariciones}
            pigId={id!}
            onDeleteParicion={handleDeleteParicion}
          />
        ) : (
          <h2 className="text-3xl">No hay pariciones registradas</h2>
        ))}

      <Container className="flex justify-center items-center gap-2.5 mb-2">
        {pig?.estadio !== "fallecido" && (
          <ButtonCustom
            className="updateButton"
            to={`/pigs/${pig._id}/pariciones`}
          >
            Agregar parición
          </ButtonCustom>
        )}

        <ButtonCustom className="editButton" to={`/pigs/update/${pig._id}`}>
          Editar cerdo
        </ButtonCustom>

        {pig.estadio !== "fallecido" && (
          <ButtonCustom className="editButton" to={`/pigs/${pig._id}/vacunar`}>
            Vacuna cerdo
          </ButtonCustom>
        )}

        <ButtonCustom
          onClick={handleDelete}
          disabled={isDeleting}
          className="dangerButton"
        >
          {isDeleting ? "Eliminando..." : "Eliminar TODO EL CERDO"}
        </ButtonCustom>
      </Container>
    </Container>
  );
};

export default PorkDetails;
