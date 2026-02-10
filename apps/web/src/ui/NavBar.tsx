import ButtonCustom from "./ButtonCustom";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/features/authSlice";
import Swal from "sweetalert2";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    // Confirmación con SweetAlert2
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se cerrará la sesión actual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate("/login");
        Swal.fire("Sesión cerrada", "Has salido de la aplicación.", "success");
      }
    });
  };

  return (
    <nav className="flex flex-wrap p-2 m-2 gap-3">
      <ButtonCustom className="linkNavBar" onClick={() => navigate(-1)}>
        Atrás
      </ButtonCustom>
      <ButtonCustom to={"/"} className="linkNavBar">
        Inicio
      </ButtonCustom>

      <ButtonCustom className="linkNavBar " to="/searcher">
        Buscador
      </ButtonCustom>
      <ButtonCustom className="linkNavBar " to="/pigs">
        Ver todos los cerdos
      </ButtonCustom>
      <ButtonCustom className="linkNavBar " to="/pigs/new">
        Agregar un cerdo
      </ButtonCustom>
      <ButtonCustom className="linkNavBar" to="/vacunas">
        Vacunas
      </ButtonCustom>

      {user && (
        <ButtonCustom className="linkNavBar" onClick={handleLogout}>
          Logout
        </ButtonCustom>
      )}

      {user?.username === 'admin' && (<ButtonCustom className="linkNavBar" to="/users/list">
          Lista de usuarios
        </ButtonCustom>)}

      <ButtonCustom className="linkNavBar" onClick={() => navigate(1)}>
        Adelante
      </ButtonCustom>
    </nav>
  );
};

export default NavBar;
