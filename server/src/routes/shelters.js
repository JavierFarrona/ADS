import express from "express";
import mongoose from "mongoose";
import Joi from "joi";
import Shelter from "../models/Shelter.js";

const router = express.Router();

// Esquema de validación para los datos de un refugio (Shelter)
// name: cadena obligatoria, min 1 caracter
// address: cadena obligatoria, min 1 caracter
// capacity: número entero obligatorio, min 0
const shelterSchema = Joi.object({
  name: Joi.string().min(1).required(),
  address: Joi.string().min(1).required(),
  capacity: Joi.number().integer().min(0).required()
});

// GET /shelters
// Obtiene la lista de todos los refugios
router.get("/", async (req, res, next) => {
  try {
    // .lean() devuelve objetos JS planos en lugar de documentos Mongoose (mejor rendimiento)
    const shelters = await Shelter.find().lean();
    res.json({ ok: true, data: shelters });
  } catch (err) {
    next(err); // Pasa el error al middleware de manejo de errores
  }
});

// GET /shelters/:id
// Obtiene un refugio específico por su ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    // Verifica si el ID tiene el formato válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }
    const shelter = await Shelter.findById(id).lean();
    if (!shelter) {
      return res.status(404).json({ ok: false, error: "Shelter not found" });
    }
    res.json({ ok: true, data: shelter });
  } catch (err) {
    next(err);
  }
});

// POST /shelters
// Crea un nuevo refugio
router.post("/", async (req, res, next) => {
  try {
    // Valida el cuerpo de la petición contra el esquema
    const { error, value } = shelterSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ ok: false, error: error.details.map(d => d.message) });
    }
    // Crea y guarda el nuevo documento en la base de datos
    const doc = await Shelter.create(value);
    res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// PUT /shelters/:id
// Actualiza un refugio existente
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }
    // Valida los nuevos datos
    const { error, value } = shelterSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ ok: false, error: error.details.map(d => d.message) });
    }
    // Busca por ID y actualiza. { new: true } devuelve el documento ya actualizado.
    const updated = await Shelter.findByIdAndUpdate(id, value, { new: true }).lean();
    if (!updated) {
      return res.status(404).json({ ok: false, error: "Shelter not found" });
    }
    res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /shelters/:id
// Elimina un refugio
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }
    const deleted = await Shelter.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({ ok: false, error: "Shelter not found" });
    }
    res.json({ ok: true, data: { id: deleted._id } });
  } catch (err) {
    next(err);
  }
});

export default router;
