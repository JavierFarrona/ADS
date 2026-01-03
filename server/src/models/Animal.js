import mongoose from "mongoose";

// Definición del esquema para la colección 'animals'
const AnimalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // Nombre del animal, obligatorio y sin espacios extra
    species: { type: String, required: true, trim: true }, // Especie (Perro, Gato, etc.), obligatorio
    age: { type: Number, required: true, min: 0 }, // Edad, número positivo
    shelterId: { type: mongoose.Schema.Types.ObjectId, ref: "Shelter", required: true }, // Referencia al refugio donde está
    description: { type: String, default: "" } // Descripción opcional
  },
  { timestamps: true } // Añade automáticamente createdAt y updatedAt
);

// Índice de texto para permitir búsquedas eficientes por nombre y descripción
AnimalSchema.index({ name: "text", description: "text" });

export default mongoose.model("Animal", AnimalSchema);
