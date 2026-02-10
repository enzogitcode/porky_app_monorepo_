import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store/store";

const ProtectedRoute = () => {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  // 1️⃣ Mientras se autentica (login o rehidratación)
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Cargando...
      </div>
    );
  }

  // 2️⃣ No autenticado → redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Autenticado → renderiza las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;
