import { useNavigate } from "react-router-dom";
import Card from "../../ui/Card";
import ButtonCustom from "../../ui/ButtonCustom";
import type { Paricion } from "../../types/pigTypes";

type ParicionCardProps = Paricion & {
  pigId: string;
  onDelete: (id: string) => void;
};

const ParicionCard = ({
  _id,
  cantidadLechones,
  descripcion,
  fechaActualizacion,
  fechaParicion,
  servicio,
  pigId,
  onDelete,
}: ParicionCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="m-2 justify-evenly flex-col">
      <div className="m-4">
        <p>ID: {_id}</p>
        <p>
          📅 Parición:{" "}
          {new Date(fechaParicion ?? "").toLocaleString()}
        </p>
        <p>
          🔄 Actualización:{" "}
          {/* {new Date(fechaActualizacion ?? "").toLocaleString()} */}
        </p>
        <p>🐖 Lechones: {cantidadLechones}</p>

        {servicio?.tipo === "desconocido" ? (
          <p>Servicio: desconocido</p>
        ) : (
          servicio && (
            <>
              <p>📅 Servicio: {servicio.fecha?.toString()}</p>
              <p>♂ Macho: {servicio.macho}</p>
            </>
          )
        )}

        <p>📝 Descripción: {descripcion}</p>
      </div>

      <div className="flex gap-3 m-2">
        <ButtonCustom
          className="dangerButton"
          type="button"
          onClick={() => onDelete(_id!)}
        >
          Eliminar parición
        </ButtonCustom>

        <ButtonCustom
          className="editButton"
          type="button"
          onClick={() =>
            navigate(`/pigs/${pigId}/pariciones/update/${_id}`)
          }
        >
          Editar Parición
        </ButtonCustom>
      </div>
    </Card>
  );
};

export default ParicionCard;
