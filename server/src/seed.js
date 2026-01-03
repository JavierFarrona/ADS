import mongoose from "mongoose";
import Animal from "./models/Animal.js";
import Shelter from "./models/Shelter.js";

// URI de conexión por defecto
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/petrescue";

async function run() {
  // Conectar a la base de datos
  await mongoose.connect(MONGO_URI);

  // Limpiar colecciones existentes (borrar datos antiguos)
  // .catch(() => {}) ignora errores si la colección no existe
  await Animal.collection.drop().catch(() => {});
  await Shelter.collection.drop().catch(() => {});

  // Crear refugios de ejemplo
  const shelters = await Shelter.insertMany([
    { name: "Downtown Shelter", address: "123 Main St", capacity: 50 },
    { name: "East Haven", address: "45 River Rd", capacity: 30 },
    { name: "West Paws", address: "78 Oak Ave", capacity: 40 },
    { name: "North Care", address: "9 Pine Blvd", capacity: 35 },
    { name: "South Hope", address: "200 Elm St", capacity: 25 }
  ]);

  const [s1, s2, s3, s4, s5] = shelters;

  // Crear animales de ejemplo y asignarlos a los refugios creados
  await Animal.insertMany([
    { name: "Bella", species: "Dog", age: 3, shelterId: s1._id, description: "Friendly and playful" },
    { name: "Max", species: "Dog", age: 5, shelterId: s2._id, description: "Calm and loyal" },
    { name: "Luna", species: "Cat", age: 2, shelterId: s3._id, description: "Curious and affectionate" },
    { name: "Charlie", species: "Cat", age: 4, shelterId: s4._id, description: "Independent and gentle" },
    { name: "Rocky", species: "Dog", age: 6, shelterId: s5._id, description: "Energetic and strong" }
  ]);

  console.log("Seed completed");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
