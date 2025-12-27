import { useEffect, useState } from "react";
import { api } from "../api";
import type { Animal } from "../api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function fetchAnimals(query?: string) {
    setLoading(true);
    try {
      const url = query ? `/animals/search?q=${encodeURIComponent(query)}` : "/animals";
      const { data } = await api.get(url);
      setAnimals(data.data);
    } catch {
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnimals();
  }, []);

  return (
    <div>
      <div className="toolbar">
        <input
          className="input"
          placeholder="Search animals"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-outline" onClick={() => fetchAnimals(q)}>Search</button>
      </div>
      {loading && <div>Loading...</div>}
      {!loading && animals.length === 0 && (
        <div className="empty">No hay animales por ahora. Crea uno con el botón “New”.</div>
      )}
      <ul className="list">
        {animals.map((a) => (
          <li key={a._id} className="card" onClick={() => navigate(`/animals/${a._id}`)}>
            <div className="title">{a.name}</div>
            <div className="meta">{a.species} • {a.age} years</div>
            <div className="desc">{a.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
