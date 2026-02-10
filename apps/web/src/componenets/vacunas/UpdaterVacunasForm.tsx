import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useGetVacunaByIdQuery,
  useUpdateVacunaMutation,
} from "../../redux/features/vacunaSlice";
import Container from "../../ui/Container";
import Card from "../../ui/Card";
import ButtonCustom from "../../ui/ButtonCustom";
import InputCustom from "../../ui/InputCustom";

const UpdaterVacunasForm = () => {
  const { id } = useParams<{ id: string }>();
  const { data: vacuna, isLoading, isError, refetch } = useGetVacunaByIdQuery(id!, { skip: !id });
  const [updateVacuna] = useUpdateVacunaMutation();

  // Estado del formulario con los datos actuales
  const [formData, setFormData] = useState({
    nombre: "",
    laboratorio: "",
    proveedor: "",
    dosis: "",
    descripcion: "",
  });

  // Estado para saber qué campo está en edición
  const [editing, setEditing] = useState<Record<string, boolean>>({
    nombre: false,
    laboratorio: false,
    proveedor: false,
    dosis: false,
    descripcion: false,
  });

  // Inicializar el formulario con los datos de la vacuna
  useEffect(() => {
    if (vacuna) {
      setFormData({
        nombre: vacuna.nombre,
        laboratorio: vacuna.laboratorio ?? "",
        proveedor: vacuna.proveedor ?? "",
        dosis: vacuna.dosis ?? "",
        descripcion: vacuna.descripcion ?? "",
      });
    }
  }, [vacuna]);

  // Cambiar valores en el formulario
  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Guardar solo el campo editado
  const handleSave = async (key: keyof typeof formData) => {
    if (!id) return;
    try {
      const payload: any = { [key]: formData[key] }; // 👈 solo ese campo
      await updateVacuna({ id, data: payload }).unwrap();
      setEditing((prev) => ({ ...prev, [key]: false })); // volver a modo lectura
      await refetch()
    } catch (err) {
      console.error("Error al actualizar campo:", err);
      alert("Error al actualizar campo");
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError || !vacuna) return <p>No se encontró la vacuna</p>;

  // Renderizar cada campo con botón Editar/Guardar
  const renderField = (
    label: string,
    key: keyof typeof formData,
    type: "text" | "textarea"
  ) => (
    <div className="flex justify-between items-center">
      <div className="flex-1 mr-2">
        <strong>{label}:</strong>{" "}
        {editing[key] ? (
          type === "textarea" ? (
            <textarea
              value={formData[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="border rounded-lg p-1 h-20 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
          ) : (
            <InputCustom
              type={type}
              value={formData[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          )
        ) : (
          <span>{formData[key] || "-"}</span>
        )}
      </div>
      <ButtonCustom
        onClick={() =>
          editing[key] ? handleSave(key) : setEditing((prev) => ({ ...prev, [key]: true }))
        }
        className={`py-1 px-3 rounded-lg ${
          editing[key] ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
        } text-white transition`}
      >
        {editing[key] ? "Guardar" : "Editar"}
      </ButtonCustom>
    </div>
  );

  return (
    <Container className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
      {/* Datos actuales */}
      <Card className="p-4 shadow rounded-lg">
        <h2 className="text-lg font-bold mb-2">Datos actuales</h2>
        <p><strong>Nombre:</strong> {vacuna.nombre}</p>
        <p><strong>Laboratorio:</strong> {vacuna.laboratorio}</p>
        <p><strong>Proveedor:</strong> {vacuna.proveedor}</p>
        <p><strong>Dosis:</strong> {vacuna.dosis}</p>
        <p><strong>Descripción:</strong> {vacuna.descripcion}</p>
      </Card>

      {/* Formulario editable */}
      <Card className="p-4 shadow rounded-lg flex flex-col gap-4">
        <h2 className="text-lg font-bold mb-2">Editar campos</h2>
        {renderField("Nombre", "nombre", "text")}
        {renderField("Laboratorio", "laboratorio", "text")}
        {renderField("Proveedor", "proveedor", "text")}
        {renderField("Dosis", "dosis", "text")}
        {renderField("Descripción", "descripcion", "textarea")}
      </Card>
    </Container>
  );
};

export default UpdaterVacunasForm;
