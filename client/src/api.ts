import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" }
});

export type Animal = {
  _id?: string;
  name: string;
  species: string;
  age: number;
  shelterId: string;
  description?: string;
};

export type Shelter = {
  _id: string;
  name: string;
  address: string;
  capacity: number;
};
