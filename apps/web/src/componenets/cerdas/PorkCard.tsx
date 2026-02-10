import React from "react";
import type { Pig } from "../../types/pigTypes";
import Card from "../../ui/Card";
import ButtonCustom from "../../ui/ButtonCustom";

const PorkCard: React.FC<Pig> = (props) => {
  return (
    <Card className=" bg-white p-4 gap-2 flex-1 shadow-2xs hover:shadow-2xl hover:shadow-zinc-500 hover:scale-105">
      <div className=" content-evenly ">
        <h2 className="text-lg">Cerda nro° {props.nroCaravana}</h2>
        <h2 className="text-lg">Total de lechones paridos: {props.lechonesTotal}</h2>
        <p>Ubicación: {props.ubicacion}</p>
        <p>Estadío: {props.estadio}</p>
      </div>
        <ButtonCustom to={`/pigs/${props._id}`} className="detailsButton">Ver Detalles</ButtonCustom>
       
    </Card>
  );
};

export default PorkCard;
