import mongoose from "mongoose";

const ShelterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Shelter", ShelterSchema);
