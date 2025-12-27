import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import animalsRouter from "./routes/animals.js";
import sheltersRouter from "./routes/shelters.js";
import Animal from "./models/Animal.js";
import Shelter from "./models/Shelter.js";
import { MongoMemoryServer } from "mongodb-memory-server";

const app = express();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/petrescue";
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", async (req, res) => {
  const count = await Animal.countDocuments();
  res.json({ ok: true, service: "petrescue-api", animals: count });
});

app.use("/animals", animalsRouter);
app.use("/shelters", sheltersRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ ok: false, error: "Internal server error" });
});

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
  let connected = false;
  try {
    await mongoose.connect(MONGO_URI);
    connected = true;
  } catch (err) {
    connected = false;
  }
  if (!connected) {
    const mem = await MongoMemoryServer.create();
    const uri = mem.getUri();
    await mongoose.connect(uri);
  }
  await ensureSeed();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch(() => {
  process.exit(1);
});
