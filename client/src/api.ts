import axios from "axios";

// URL base de la API, tomada de variables de entorno o por defecto a localhost:4000
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

// Instancia de axios preconfigurada
export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" }
});

// Definición de tipos TypeScript para Animal
export type Animal = {
  _id?: string; // Opcional porque al crear no tiene ID aún
  name: string;
  species: string;
  age: number;
  shelterId: string;
  description?: string;
};

// Definición de tipos TypeScript para Refugio
export type Shelter = {
  _id: string;
  name: string;
  address: string;
  capacity: number;
};
