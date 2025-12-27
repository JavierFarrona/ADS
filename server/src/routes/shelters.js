import express from "express";
import mongoose from "mongoose";
import Joi from "joi";
import Shelter from "../models/Shelter.js";

const router = express.Router();

const shelterSchema = Joi.object({
  name: Joi.string().min(1).required(),
  address: Joi.string().min(1).required(),
  capacity: Joi.number().integer().min(0).required()
});

router.get("/", async (req, res, next) => {
  try {
    const shelters = await Shelter.find().lean();
    res.json({ ok: true, data: shelters });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
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

router.post("/", async (req, res, next) => {
  try {
    const { error, value } = shelterSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ ok: false, error: error.details.map(d => d.message) });
    }
    const doc = await Shelter.create(value);
    res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }
    const { error, value } = shelterSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ ok: false, error: error.details.map(d => d.message) });
    }
    const updated = await Shelter.findByIdAndUpdate(id, value, { new: true }).lean();
    if (!updated) {
      return res.status(404).json({ ok: false, error: "Shelter not found" });
    }
    res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
});

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
