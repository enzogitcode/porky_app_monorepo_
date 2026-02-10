import { useNavigate } from "react-router-dom";
import { useDeleteVacunaByIdMutation } from "../../redux/features/vacunaSlice";
import type { Vacuna } from "../../types/vacunaType";
import Card from "../../ui/Card";
import assets from "../../assets/johannes-groll.jpg";
import ButtonCustom from "../../ui/ButtonCustom";
import Swal from "sweetalert2";

const CardVacuna: React.FC<Vacuna> = (props) => {
  const creacion = new Date(props.createdAt);
  const editada = new Date(props.updatedAt);

  const navig = useNavigate();

  const [deleteVacuna, { isLoading }] = useDeleteVacunaByIdMutation();

  const handleDeleteVacuna = async (id: string) => {
    if (!id) return;

    const result = await Swal.fire({
      title: "¿Eliminar vacuna?",
      text: "⚠️ Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteVacuna(id).unwrap();
      await Swal.fire(
        "Eliminada",
        "La vacuna fue eliminada correctamente",
        "success"
      );
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar la vacuna", "error");
      console.error("Error al eliminar vacuna:", error);
    }
  };

  return (
    <Card className="flex flex-col md:grid md:grid-cols-[30%_70%] text-wrap">
      {/* Imagen */}
      <img
        src={assets}
        alt={props.nombre}
        className="w-full h-48 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-t-none"
      />

      {/* Contenido */}
      <div className="border-t md:border-t-0 md:border-l border-amber-500 p-4 flex flex-col gap-4">
        {/* Nombre arriba */}
        <h3 className="text-2xl font-semibold">{props.nombre}</h3>

        {/* Zona del medio: datos + fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-wrap">
          {/* Datos */}
          <div className="space-y-1">
            <p className="text-2xl font-medium text-wrap">Id: {props._id}</p>
            <p>
              <span className="font-medium">Laboratorio:</span>
              {props.laboratorio}
            </p>
            <p>
              <span className="font-medium">Proveedor:</span> {props.proveedor}
            </p>
            <p>
              <span className="font-medium">Dosis Aplicada:</span> {props.dosis}
            </p>
          </div>

          {/* Fechas */}
          <div className="space-y-1">
            <p>
              <span className="font-medium">Registrada el:</span>{" "}
              {creacion.toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Editada el:</span>{" "}
              {editada.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Descripción abajo */}
        <div>
          <p className="font-medium">Descripción: </p>
          <p>{props.descripcion}</p>
        </div>

        {/* Footer con botones centrados */}
        <div className="flex justify-center gap-4 mt-2 flex-wrap">
          <ButtonCustom
            className="px-4 py-2 bg-green-600 text-black hover:text-white rounded-lg hover:bg-green-900"
            to={`/vacunas/vacunar/${props._id}`}
          >
            Vacunar varias cerdas
          </ButtonCustom>
          <ButtonCustom
            onClick={() => navig(`/vacunas/updater/${props._id}`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Editar
          </ButtonCustom>

          <ButtonCustom
            onClick={() => handleDeleteVacuna(props._id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </ButtonCustom>
        </div>
      </div>
    </Card>
  );
};

export default CardVacuna;
