import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import animalsRouter from "./routes/animals.js";
import sheltersRouter from "./routes/shelters.js";
import Animal from "./models/Animal.js";
import Shelter from "./models/Shelter.js";

const app = express();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/petrescue";
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors()); // Permite todos los orígenes para facilitar el desarrollo local
app.use(express.json()); // Parsea cuerpos JSON
app.use(morgan("dev")); // Log de peticiones HTTP en consola

// Endpoint de salud / estado
app.get("/", async (req, res) => {
  const count = await Animal.countDocuments();
  res.json({ ok: true, service: "petrescue-api", animals: count });
});

// Rutas de la API
app.use("/animals", animalsRouter);
app.use("/shelters", sheltersRouter);

// Manejo global de errores
app.use((err, req, res, next) => {
  res.status(500).json({ ok: false, error: "Internal server error" });
});

// Función para asegurar datos iniciales (semilla) si la DB está vacía
async function ensureSeed() {
  const sc = await Shelter.countDocuments();
  const ac = await Animal.countDocuments();
  if (sc < 5) {
    const shelters = await Shelter.insertMany([
      { name: "Downtown Shelter", address: "123 Main St", capacity: 50 },
      { name: "East Haven", address: "45 River Rd", capacity: 30 },
      { name: "West Paws", address: "78 Oak Ave", capacity: 40 },
      { name: "North Care", address: "9 Pine Blvd", capacity: 35 },
      { name: "South Hope", address: "200 Elm St", capacity: 25 }
    ]);
    if (ac < 5) {
      const [s1, s2, s3, s4, s5] = shelters;
      await Animal.insertMany([
        { name: "Bella", species: "Dog", age: 3, shelterId: s1._id, description: "Friendly and playful" },
        { name: "Max", species: "Dog", age: 5, shelterId: s2._id, description: "Calm and loyal" },
        { name: "Luna", species: "Cat", age: 2, shelterId: s3._id, description: "Curious and affectionate" },
        { name: "Charlie", species: "Cat", age: 4, shelterId: s4._id, description: "Independent and gentle" },
        { name: "Rocky", species: "Dog", age: 6, shelterId: s5._id, description: "Energetic and strong" }
      ]);
    }
  }
}

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
  
  await ensureSeed();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch(() => {
  process.exit(1);
});
