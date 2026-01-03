import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import AnimalDetails from "./pages/AnimalDetails";
import Shelters from "./pages/Shelters";
import "./App.css";

// Componente principal de la aplicación
// Define la estructura base (header, navegación) y las rutas
function App() {
  const navigate = useNavigate();

  return (
    <div className="container">
      {/* Cabecera con navegación */}
      <header className="header">
        <div className="nav">
          <Link to="/" className="brand">PetRescue</Link>
          <Link to="/shelters">Shelters</Link>
        </div>
        {/* Botón para crear nuevo animal */}
        <button className="new-btn" onClick={() => navigate("/animals/new")}>New</button>
      </header>
      <main>
        {/* Definición de rutas y componentes asociados */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/animals/new" element={<AnimalDetails mode="create" />} />
          <Route path="/animals/:id" element={<AnimalDetails mode="view" />} />
          <Route path="/animals/:id/edit" element={<AnimalDetails mode="edit" />} />
          <Route path="/shelters" element={<Shelters />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
