import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import Container from "../../ui/Container";
import ButtonCustom from "../../ui/ButtonCustom";
import { resetUserPin } from "../../redux/features/authSlice";

const ResetPin = () => {
  const { username } = useParams<{ username: string }>(); // viene de /users/reset-pin/:username
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newPin, setNewPin] = useState("");
  const dispatch = useAppDispatch();

  const handleReset = async () => {
    if (!username || username.trim() === "") {
      setMessage("Usuario inválido");
      return;
    }

    setLoading(true);
    setMessage("");
    setNewPin("");

    try {
      const result = await dispatch(resetUserPin({username})).unwrap();
      setNewPin(result.tempPin);
      setMessage(`PIN temporal generado: ${result.tempPin}`);
    } catch (err: any) {
      setMessage(err?.message || "Error al resetear PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="containerBg flex flex-col gap-4 justify-center-safe h-screen text-center">
      <h1 className="text-3xl font-bold">Resetear PIN</h1>
      <p className="text-lg">
        Usuario: <strong>{username}</strong>
      </p>

      {newPin && (
        <p className="text-green-600 font-bold">
          PIN temporal: {newPin}
        </p>
      )}

      {message && <p>{message}</p>}

      <ButtonCustom
        className="updateButton"
        onClick={handleReset}
        disabled={loading}
      >
        {loading ? "Reseteando..." : "Resetear PIN"}
      </ButtonCustom>
    </Container>
  );
};

export default ResetPin;
