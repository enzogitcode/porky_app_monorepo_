import { useGetServidasOGestacionQuery } from "../redux/features/pigSlice";
import ButtonCustom from "../ui/ButtonCustom";
import Card from "../ui/Card";
import Container from "../ui/Container";

const Home = () => {

  const user = 1; // TODO: Reemplazar con el hook de autenticación cuando esté implementado
  //TODO significa to do, es una marca para recordar que hay que volver a esa parte del código más tarde

  const { data, isLoading, isError } = useGetServidasOGestacionQuery();

  if (!user) {
    return (
      <Container>
        <h1 className="text-5xl font-bold text-red-700 text-center">
          Por favor, inicie sesión para ver las cerdas próximas a parir.
        </h1>
      </Container>
    );
  }

  if (isError) {
    console.error();
    return (
      <h1 className="text-center text-red-500 mt-10 text-lg">
        Ocurrió un error al cargar las cerdas 😢
      </h1>
    );
  }
  if (isLoading)
    return (
      <div>
        <h1>Se están cargando los datos</h1>
      </div>
    );

  if (data?.length === 0) {
    return (
      <Container>
        <h1 className="text-5xl font-bold text-red-700 text-center">
          NO hay cerdas próximas a parir!
        </h1>
      </Container>
    );
  }

  return (
    <Container className="grid grid-rows-[1fr auto] font-stretch-90%">
      <h1 className="text-5xl font-bold text-red-700 text-center">
        Próximas cerdas a parir
      </h1>
      <Container className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 p-1">
        {data?.map((item) => (
          <Card className="flex flex-col p-3" key={item._id}>
            <h3 className="text-4xl text-pink-700">
              Cerda N° {item.nroCaravana}
            </h3>
            <h4>ID: {item._id}</h4>
            <p>
              <strong>Lechones Total Paridos:</strong> {item.lechonesTotal}
            </p>
            {(item.estadio === "servida" ||
              item.estadio === "gestación confirmada") &&
              item.posibleFechaParto && (
                <div className="border-2 border-red-800 rounded-b-3xl p-4 gap-4">
                  <h4>Posible fecha de parto:</h4>
                  <p className="text-2xl">
                    <strong>Fecha Servicio:</strong>{" "}
                    {new Date(item.fechaServicioActual).toLocaleDateString()}
                  </p>

                  <p className="text-2xl">
                    <strong>
                      Mínima:{" "}
                      {new Date(
                        item.posibleFechaParto.inicio
                      ).toLocaleDateString()}
                    </strong>
                  </p>

                  <p className="text-2xl">
                    <strong>
                      Máxima:{" "}
                      {new Date(item.posibleFechaParto.fin).toLocaleDateString(
                        "es-ES"
                      )}
                    </strong>
                  </p>

                  <div className="mt-2">
                    <ButtonCustom
                      to={`/pigs/${item._id}`}
                      className="detailsButton mt-2"
                    >
                      Ver Detalles de la cerda
                    </ButtonCustom>
                  </div>
                </div>
              )}
            <p>
              <strong>Actualizado:</strong>{" "}
              {new Date(item.updatedAt).toLocaleDateString()}
            </p>
          </Card>
        ))}
      </Container>
    </Container>
  );
};

export default Home;
