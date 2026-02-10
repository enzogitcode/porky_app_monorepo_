import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllPigsArrayQuery } from "../redux/features/pigSlice"; // 👈 usamos el hook del array
import Container from "../ui/Container";
import InputCustom from "../ui/InputCustom";
import ButtonCustom from "../ui/ButtonCustom";
import type { Pig } from "../types/pigTypes";

const Searcher = () => {
  // 👇 pedimos un límite grande para traer todos los registros
  const { data, isLoading, isError } = useGetAllPigsArrayQuery({ page: 1, limit: 1000 });

  const [searchField, setSearchField] = useState<
    "nroCaravana" | "descripcion" | "estadio" | "ubicacion" | "createdAt" | "updatedAt"
  >("nroCaravana");

  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState<Pig[]>([]);

  const handleSearch = () => {
    if (!data) return;

    let results: Pig[] = [];

    switch (searchField) {
      case "nroCaravana": {
        const num = Number(searchValue);
        results = data.filter((pig) => pig.nroCaravana === num);
        break;
      }
      case "descripcion": {
        results = data.filter(
          (pig) =>
            pig.descripcion &&
            pig.descripcion.toLowerCase().includes(searchValue.toLowerCase())
        );
        break;
      }
      case "estadio": {
        results = data.filter(
          (pig) =>
            pig.estadio &&
            pig.estadio.toLowerCase().includes(searchValue.toLowerCase())
        );
        break;
      }
      case "ubicacion": {
        results = data.filter(
          (pig) =>
            pig.ubicacion &&
            pig.ubicacion.toLowerCase().includes(searchValue.toLowerCase())
        );
        break;
      }
      case "createdAt": {
        results = data.filter((pig) =>
          pig.createdAt.toLowerCase().includes(searchValue.toLowerCase())
        );
        break;
      }
      case "updatedAt": {
        results = data.filter((pig) =>
          pig.updatedAt.toLowerCase().includes(searchValue.toLowerCase())
        );
        break;
      }
      default:
        results = [];
    }

    setFilteredData(results);
  };

  // 🔹 Para poder enviar con ENTER
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar los datos</p>;

  return (
    <Container>
      <div className="flex gap-2 items-center mb-4">
        <select
          value={searchField}
          onChange={(e) =>
            setSearchField(
              e.target.value as
                | "nroCaravana"
                | "descripcion"
                | "estadio"
                | "ubicacion"
                | "createdAt"
                | "updatedAt"
            )
          }
          className="border rounded p-1"
        >
          <option value="nroCaravana">Nro Caravana</option>
          <option value="descripcion">Descripción</option>
          <option value="estadio">Estadio</option>
          <option value="ubicacion">Ubicación</option>
          <option value="createdAt">Fecha de creación</option>
          <option value="updatedAt">Última actualización</option>
        </select>

        <InputCustom
          type={searchField === "createdAt" || searchField === "updatedAt" ? "date" : "text"}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyPress} // 🔹 permite enviar con Enter
        />

        <ButtonCustom
          type="button"
          onClick={handleSearch}
          className="rounded-2xl bg-sky-300 p-2"
        >
          Buscar
        </ButtonCustom>
      </div>

      <ul>
        {filteredData.map((pig) => (
          <li key={pig._id} className="mb-2">
            <strong>Caravana:</strong> {pig.nroCaravana} |{" "}
            <strong>Estado:</strong> {pig.estadio} |{" "}
            <strong>Descripción:</strong> {pig.descripcion ?? "-"} |{" "}
            <strong>Ubicación:</strong> {pig.ubicacion ?? "-"} |{" "}
            <strong>Creado:</strong> {pig.createdAt} |{" "}
            <strong>Actualizado:</strong> {pig.updatedAt}{" "}
            <Link to={`/pigs/${pig._id}`} className="text-blue-600 underline ml-2">
              Ver detalles
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default Searcher;
