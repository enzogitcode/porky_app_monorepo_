import React from "react";
import Container from "../../ui/Container";
import { useGetAllVacunasQuery } from "../../redux/features/vacunaSlice";
import CardVacuna from "./CardVacuna";

const VacunasList: React.FC = () => {
  const { data, isError, isLoading } = useGetAllVacunasQuery();
  if (isError) return <h1 className="text-center text-4xl m-2">Ocurrió un error</h1>
console.log(data)
  return (
    <>
      {isLoading ? (
        <h1>Cargando los datos...</h1>
      ) : (
        <h1 className="text-center text-4xl m-2">Lista de Vacunas Registradas</h1>
      )}

      {data?.length == 0 ? (
        <h3 className="items-center justify-center flex">
          No hay vacunas registradas
        </h3>
      ) : (
        <Container className="flex flex-col text-2xl">
          {data?.map((item) => (
            <CardVacuna {...item} key={item._id} />
          ))}
        </Container>
      )}
    </>
  );
};

export default VacunasList;
