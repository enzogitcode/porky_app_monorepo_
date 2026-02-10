import Container from "../../ui/Container";
import ButtonCustom from "../../ui/ButtonCustom";

const IndexHomeVacunas = () => {
  return (
    <Container className="flex flex-col gap-2 text-center md:flex md:flex-wrap md:flex-row">
      <div className="flex justify-center-safe items-center-safe">
        <ButtonCustom className="updateButton text-2xl" to="/vacunas/list">
          Ver listado de vacunas
        </ButtonCustom>
      </div>
      <div className="flex justify-center-safe items-center-safe">
        <ButtonCustom className="updateButton text-2xl" to="/vacunas/register">
          Agregar una vacuna
        </ButtonCustom>
      </div>
      <div className="flex justify-center-safe items-center-safe">
        <ButtonCustom className="updateButton text-2xl" to="/vacunas/vacunar">
          Vacunar múltiples cerdas
        </ButtonCustom>
      </div>
    </Container>
  );
};

export default IndexHomeVacunas;
