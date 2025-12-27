import { useEffect, useState } from "react";
import { api } from "../api";
import type { Shelter } from "../api";

function Shelters() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{ name: string; address: string; capacity: number }>({
    name: "",
    address: "",
    capacity: 0
  });

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/shelters");
      setShelters(data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createShelter() {
    await api.post("/shelters", form);
    setForm({ name: "", address: "", capacity: 0 });
    await load();
  }

  async function updateShelter(id: string) {
    await api.put(`/shelters/${id}`, form);
    setEditingId(null);
    await load();
  }

  async function deleteShelter(id: string) {
    await api.delete(`/shelters/${id}`);
    await load();
  }

  return (
    <div>
      <div className="subtitle">Crear nuevo shelter</div>
      <form className="form" onSubmit={(e) => { e.preventDefault(); createShelter(); }}>
        <label>
          Nombre
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          Dirección
          <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </label>
        <label>
          Capacidad
          <input className="input" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
        </label>
        <div className="actions">
          <button className="btn btn-primary" type="submit">Crear</button>
        </div>
      </form>

      <div className="subtitle">Shelters</div>
      {loading && <div>Loading...</div>}
      <ul className="list">
        {shelters.map((s) => (
          <li key={s._id} className="card">
            {editingId === s._id ? (
              <form className="form" onSubmit={(e) => { e.preventDefault(); updateShelter(s._id); }}>
                <label>
                  Nombre
                  <input className="input" defaultValue={s.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label>
                  Dirección
                  <input className="input" defaultValue={s.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </label>
                <label>
                  Capacidad
                  <input className="input" type="number" defaultValue={s.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
                </label>
                <div className="actions">
                  <button className="btn btn-primary" type="submit">Guardar</button>
                  <button className="btn btn-outline" type="button" onClick={() => setEditingId(null)}>Cancelar</button>
                </div>
              </form>
            ) : (
              <>
                <div className="title">{s.name}</div>
                <div>{s.address}</div>
                <div>Capacidad: {s.capacity}</div>
                <div className="actions">
                  <button className="btn btn-outline" onClick={() => { setEditingId(s._id); setForm({ name: s.name, address: s.address, capacity: s.capacity }); }}>Editar</button>
                  <button className="btn btn-danger" onClick={() => deleteShelter(s._id)}>Eliminar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Shelters;
