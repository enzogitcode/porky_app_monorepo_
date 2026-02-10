import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateMyPin, selectLoading, selectError } from "../../redux/features/authSlice";
import Container from "../../ui/Container";
import ButtonCustom from "../../ui/ButtonCustom";
import InputCustom from "../../ui/InputCustom";

const ResetMyPin = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================
  // Manejar reset del PIN
  // =====================================
  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");

    if (!pin || pin.length < 4) {
      return alert("El PIN debe tener al menos 4 dígitos");
    }

    if (pin !== confirmPin) {
      return alert("Los PIN no coinciden");
    }

    try {
      await dispatch(updateMyPin({ pin })).unwrap();
      setSuccess("PIN actualizado correctamente");
      setPin("");
      setConfirmPin("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="containerBg flex flex-col gap-4 justify-center-safe h-screen text-center">
      <form onSubmit={handleReset} className="bg-white p-8 rounded-lg shadow-lg flex flex-col gap-6 max-w-md mx-auto">
        <h1 className="text-3xl font-bold">Cambiar mi PIN</h1>

        <InputCustom
          label="Nuevo PIN"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          inputClassName="text-center"
        />

        <InputCustom
          label="Confirmar PIN"
          type="password"
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value)}
          inputClassName="text-center"
        />

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600 font-bold">{success}</p>}

        <ButtonCustom className="updateButton" type="submit" disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar PIN"}
        </ButtonCustom>
      </form>
    </Container>
  );
};

export default ResetMyPin;
