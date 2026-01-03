import express from "express";
import mongoose from "mongoose";
import Joi from "joi";
import Animal from "../models/Animal.js";

const router = express.Router();

// Esquema de validación para animales
const animalSchema = Joi.object({
  name: Joi.string().min(1).required(),
  species: Joi.string().min(1).required(),
  age: Joi.number().integer().min(0).required(),
  shelterId: Joi.string().hex().length(24).required(), // ID del refugio (24 caracteres hex)
  description: Joi.string().allow("").optional()
});

// GET /animals
// Obtiene la lista de todos los animales
router.get("/", async (req, res, next) => {
  try {
    const animals = await Animal.find().lean();
    res.json({ ok: true, data: animals });
  } catch (err) {
    next(err);
  }
});

// GET /animals/search?q=query
// Busca animales por texto en nombre y descripción
router.get("/search", async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) {
      // Si no hay query, devuelve todos
      const animals = await Animal.find().lean();
      return res.json({ ok: true, data: animals });
    }
    // Búsqueda de texto usando el índice creado en el modelo
    const animals = await Animal.find({ $text: { $search: q } }).lean();
    res.json({ ok: true, data: animals });
  } catch (err) {
    next(err);
  }
});

// GET /animals/:id
// Obtiene un animal por su ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }
    const animal = await Animal.findById(id).lean();
    if (!animal) {
      return res.status(404).json({ ok: false, error: "Animal not found" });
    }
    res.json({ ok: true, data: animal });
  } catch (err) {
    next(err);
  }
});

// POST /animals
// Crea un nuevo animal
router.post("/", async (req, res, next) => {
  try {
    const { error, value } = animalSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ ok: false, error: error.details.map(d => d.message) });
    }
    const doc = await Animal.create({
      ...value,
      shelterId: new mongoose.Types.ObjectId(value.shelterId)
    });
    res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// PUT /animals/:id
// Actualiza un animal existente
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }
    const { error, value } = animalSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ ok: false, error: error.details.map(d => d.message) });
    }
    const updated = await Animal.findByIdAndUpdate(
      id,
      { ...value, shelterId: new mongoose.Types.ObjectId(value.shelterId) },
      { new: true }
    ).lean();
    if (!updated) {
      return res.status(404).json({ ok: false, error: "Animal not found" });
    }
    res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /animals/:id
// Elimina un animal
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }
    const deleted = await Animal.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({ ok: false, error: "Animal not found" });
    }
    res.json({ ok: true, data: { id: deleted._id } });
  } catch (err) {
    next(err);
  }
});

export default router;
