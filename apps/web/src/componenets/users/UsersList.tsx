import { useEffect, useState } from "react";
import Container from "../../ui/Container";
import ButtonCustom from "../../ui/ButtonCustom";
import { apiUrl } from "../../redux/apiUrl";

interface User {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/users`, {
          method: "GET",
          credentials: "include", // 🔑 cookie JWT
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al obtener usuarios");
        }

        setUsers(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Container className="containerBg text-center">
        <p>Cargando usuarios...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="containerBg text-center text-red-600">
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <Container className="containerBg flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-center">Usuarios</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Usuario</th>
              <th className="p-2 border">Rol</th>
              <th className="p-2 border">Creado</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  <ButtonCustom
                    className="dangerButton"
                    to={`/users/reset-pin/${user?.username}`}
                  >
                    Reset PIN
                  </ButtonCustom>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default UsersList;
