import React, { useState } from "react";
import { useGetAllPigsPaginatedQuery } from "../../redux/features/pigSlice";
import Container from "../../ui/Container";
import PorkCard from "./PorkCard";
import ButtonCustom from "../../ui/ButtonCustom"; // 👈 importamos tu botón

const PorkList: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data: pigsResponse, isLoading, isError } = useGetAllPigsPaginatedQuery({ page, limit: 10 });

  if (isLoading)
    return <p className="text-center text-gray-500 mt-10 text-lg animate-pulse">Cargando...</p>;

  if (isError) {
    console.error();
    return <h1 className="text-center text-red-500 mt-10 text-lg">Ocurrió un error al cargar las cerdas 😢</h1>;
  }

  if (pigsResponse?.data?.length === 0) {
    return <h1 className="text-center text-gray-600 mt-10 text-lg">No hay cerdos registrados</h1>;
  }

  return (
    <Container className="flex-col bg-slate-400">
      <h2 className="text-2xl font-bold text-gray-800 text-center m-3">Lista de Cerdos</h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 p-1">
        {pigsResponse?.data?.map((item) => (
          <PorkCard {...item} key={item._id} />
        ))}
      </div>

      {/* 🔹 Controles de paginación con ButtonCustom */}
      <Container className="bg-slate-100 flex justify-center gap-2 mt-2 shadow-2xs hover:shadow-2xl hover:shadow-zinc-500 hover:scale-105">
        <ButtonCustom
          onClick={() => setPage(1)}
          className="pageButton"
          buttonCustomStyle={{ minWidth: "80px" }}
          type="button"
        >
          Primera
        </ButtonCustom>

        <ButtonCustom
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="pageButton"
          buttonCustomStyle={{ minWidth: "80px" }}
          type="button"
        >
          Anterior
        </ButtonCustom>

        <span className="px-3 py-1">
          Página {pigsResponse?.page} de {pigsResponse?.totalPages}
        </span>

        <ButtonCustom
          onClick={() => setPage((prev) => Math.min(prev + 1, pigsResponse?.totalPages ?? prev))}
          className="pageButton"
          buttonCustomStyle={{ minWidth: "80px" }}
          type="button"
        >
          Siguiente
        </ButtonCustom>

        <ButtonCustom
          onClick={() => setPage(pigsResponse?.totalPages ?? 1)}
          className="pageButton"
          buttonCustomStyle={{ minWidth: "80px" }}
          type="button"
        >
          Última
        </ButtonCustom>
      </Container>
    </Container>
  );
};

export default PorkList;
