import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import type { Animal, Shelter } from "../api";
import { useNavigate, useParams } from "react-router-dom";

type Mode = "view" | "edit" | "create";

// Componente para ver detalles, crear o editar un animal
// Recibe el modo de operación como prop
function AnimalDetails({ mode }: { mode: Mode }) {
  const params = useParams(); // Obtiene parámetros de la URL (ej: id)
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<Animal | null>(null); // Datos del animal actual
  const [shelter, setShelter] = useState<Shelter | null>(null); // Datos del refugio asociado
  const [shelters, setShelters] = useState<Shelter[]>([]); // Lista de refugios disponibles para el select
  const [form, setForm] = useState<Animal>({ // Estado del formulario
    name: "",
    species: "",
    age: 0,
    shelterId: "",
    description: ""
  });
  const [busy, setBusy] = useState(false); // Estado para deshabilitar botones durante peticiones

  // Determina el modo actual basándose en la prop recibida
  const currentMode: Mode = useMemo(() => {
    if (mode === "create") return "create";
    if (mode === "edit") return "edit";
    return "view";
  }, [mode]);

  // Efecto para cargar los datos del animal si estamos en modo view o edit
  useEffect(() => {
    async function load() {
      if (currentMode === "create") return;
      const id = params.id!;
      const { data } = await api.get(`/animals/${id}`);
      setAnimal(data.data);
      // Rellena el formulario con los datos cargados
      setForm({
        _id: data.data._id,
        name: data.data.name,
        species: data.data.species,
        age: data.data.age,
        shelterId: data.data.shelterId,
        description: data.data.description || ""
      });
      // Carga información extra del refugio para mostrar en modo vista
      const shelterResp = await api.get(`/shelters/${data.data.shelterId}`);
      setShelter(shelterResp.data.data);
    }
    load();
  }, [params.id, currentMode]);

  // Efecto para cargar la lista de refugios (necesaria para el dropdown en crear/editar)
  useEffect(() => {
    async function loadShelters() {
      const { data } = await api.get("/shelters");
      setShelters(data.data);
      // Si estamos creando, pre-selecciona el primer refugio por defecto
      if (currentMode === "create" && data.data.length > 0) {
        setForm((prev) => ({ ...prev, shelterId: data.data[0]._id }));
      }
    }
    loadShelters();
  }, [currentMode]);

  // Maneja el envío del formulario (Crear o Actualizar)
  async function onSave() {
    setBusy(true);
    try {
      if (currentMode === "create") {
        await api.post("/animals", form);
      } else {
        await api.put(`/animals/${form._id}`, form);
      }
      navigate("/"); // Vuelve al home tras guardar
    } finally {
      setBusy(false);
    }
  }

  // Maneja la eliminación del animal
  async function onDelete() {
    if (!animal?._id) return;
    setBusy(true);
    try {
      await api.delete(`/animals/${animal._id}`);
      navigate("/");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {/* MODO VISTA: Muestra detalles y botones de acción */}
      {currentMode === "view" && animal && (
        <div className="details">
          <div className="title">{animal.name}</div>
          <div className="meta">{animal.species} • {animal.age} years</div>
          <div className="desc">{animal.description}</div>
          {shelter && (
            <div className="shelter">
              <div className="subtitle">Shelter</div>
              <div>{shelter.name}</div>
              <div>{shelter.address}</div>
              <div>Capacity: {shelter.capacity}</div>
            </div>
          )}
          <div className="actions">
            <button className="btn btn-primary" onClick={() => navigate(`/animals/${animal._id}/edit`)}>Editar</button>
            <button className="btn btn-danger" onClick={onDelete}>Eliminar</button>
          </div>
        </div>
      )}

      {/* MODO EDICIÓN / CREACIÓN: Muestra formulario */}
      {(currentMode === "edit" || currentMode === "create") && (
        <form className="form" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
          <label>
            Name
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Species
            <input className="input" value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} />
          </label>
          <label>
            Age
            <input className="input" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} />
          </label>
          <label>
            Shelter
            <select className="select" value={form.shelterId} onChange={(e) => setForm({ ...form, shelterId: e.target.value })}>
              {shelters.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </label>
          <label>
            Description
            <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="actions">
            <button className="btn btn-primary" type="submit" disabled={busy}>{currentMode === "create" ? "Crear" : "Guardar"}</button>
            {currentMode === "edit" && (
              <button type="button" className="btn btn-danger" onClick={onDelete} disabled={busy}>Eliminar</button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default AnimalDetails;
