import React, { useState } from "react";
import FormContainer from "../../ui/FormContainer";
import InputCustom from "../../ui/InputCustom";
import Container from "../../ui/Container";
import ButtonCustom from "../../ui/ButtonCustom";
import { useCreateVacunaMutation } from "../../redux/features/vacunaSlice";
import { useNavigate } from "react-router-dom";

const RegisterVacunaForm: React.FC = () => {
  /* const [dosisNro, setDosisNro] = useState<number|string>("")
  const [medida, setMedida] = useState("mg") */
  const navigate = useNavigate();

  const [VacunaForm, setVacunaForm] = useState({
    nombre: "",
    laboratorio: "",
    proveedor: "",
    dosis: "",
    descripcion: "",
  });

  const [createVacuna, { isLoading }] = useCreateVacunaMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVacuna(VacunaForm).unwrap(); // ✅ ahora sí espera el resultado
      navigate("/vacunas/list"); // si fue exitoso
    } catch (error: any) {
      // si es string, lo mostramos directo
      if (typeof error === "string") {
        alert(error);
        console.log(error);
      } else if (error?.data) {
        // RTK Query suele poner el mensaje en error.data.message
        console.log(error?.data);
        alert(error.data.message);
      } else {
        alert("Error desconocido");
      }
    }
  };

  return (
    <Container className="text-center">
      <FormContainer className="text-center rounded-3xl p-2 gap-5 ">
        <InputCustom
          value={VacunaForm.nombre}
          label="Nombre"
          inputClassName="text-center focus:outline-rosadefault focus:inline-sky-500 "
          className="text-center"
          name="nombre"
          onChange={(e) =>
            setVacunaForm({ ...VacunaForm, nombre: e.target.value })
          }
          type="text"
        />

        <InputCustom
          inputClassName="text-center"
          className="text-center"
          label="Laboratorio"
          value={VacunaForm.laboratorio ?? ""}
          name="laboratorio"
          type="text"
          onChange={(e) =>
            setVacunaForm({ ...VacunaForm, laboratorio: e.target.value })
          }
        />
        <InputCustom
          inputClassName="text-center"
          className="text-center"
          label="Proveedor"
          value={VacunaForm.proveedor ?? ""}
          name="proveedor"
          type="text"
          onChange={(e) =>
            setVacunaForm({ ...VacunaForm, proveedor: e.target.value })
          }
        />
        <InputCustom
          inputClassName="text-center"
          className="text-center"
          label="Descripción"
          value={VacunaForm.descripcion ?? ""}
          name="descripcion"
          type="text"
          onChange={(e) =>
            setVacunaForm({ ...VacunaForm, descripcion: e.target.value })
          }
        />
        <div>
          <InputCustom
            inputClassName="text-center"
            className="text-center"
            type="text"
            label="Dosis"
            value={VacunaForm.dosis ?? ""}
            onChange={(e) =>
              setVacunaForm({ ...VacunaForm, dosis: e.target.value })
            }
          />
        </div>

        <ButtonCustom
          type="submit"
          onClick={handleSubmit}
          className="text-center updateButton"
        >
          {isLoading ? "Enviando..." : "Enviar"}
        </ButtonCustom>
      </FormContainer>
    </Container>
  );
};

export default RegisterVacunaForm;
