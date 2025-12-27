import mongoose from "mongoose";

const AnimalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    species: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    shelterId: { type: mongoose.Schema.Types.ObjectId, ref: "Shelter", required: true },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

AnimalSchema.index({ name: "text", description: "text" });

export default mongoose.model("Animal", AnimalSchema);
