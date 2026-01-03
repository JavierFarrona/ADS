import mongoose from "mongoose";

// Definición del esquema para la colección 'shelters'
const ShelterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // Nombre del refugio
    address: { type: String, required: true, trim: true }, // Dirección física
    capacity: { type: Number, required: true, min: 0 } // Capacidad máxima de animales
  },
  { timestamps: true } // Añade createdAt y updatedAt
);

export default mongoose.model("Shelter", ShelterSchema);
