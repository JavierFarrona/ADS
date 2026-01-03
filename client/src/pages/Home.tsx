import { useEffect, useState } from "react";
import { api } from "../api";
import type { Animal } from "../api";
import { useNavigate } from "react-router-dom";

// Componente de la página principal (Home)
// Muestra el listado de animales con buscador
function Home() {
  const [animals, setAnimals] = useState<Animal[]>([]); // Estado para lista de animales
  const [q, setQ] = useState(""); // Estado para el texto de búsqueda
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigate = useNavigate(); // Hook para navegación

  // Función asíncrona para obtener animales de la API
  async function fetchAnimals(query?: string) {
    setLoading(true);
    try {
      // Si hay query usa el endpoint de búsqueda, si no, el listado general
      const url = query ? `/animals/search?q=${encodeURIComponent(query)}` : "/animals";
      const { data } = await api.get(url);
      setAnimals(data.data);
    } catch {
      setAnimals([]); // En caso de error, limpia la lista
    } finally {
      setLoading(false);
    }
  }

  // Carga inicial de animales al montar el componente
  useEffect(() => {
    fetchAnimals();
  }, []);

  return (
    <div>
      {/* Barra de herramientas con buscador */}
      <div className="toolbar">
        <input
          className="input"
          placeholder="Search animals"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-outline" onClick={() => fetchAnimals(q)}>Search</button>
      </div>
      
      {/* Indicador de carga */}
      {loading && <div>Loading...</div>}
      
      {/* Mensaje si no hay resultados */}
      {!loading && animals.length === 0 && (
        <div className="empty">No hay animales por ahora. Crea uno con el botón “New”.</div>
      )}
      
      {/* Lista de tarjetas de animales */}
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
