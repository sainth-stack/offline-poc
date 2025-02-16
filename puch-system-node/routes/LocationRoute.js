import express from "express";
import { addLocation, getAllLocations } from "../Controller/LocationController.js";

const router = express.Router();

router.post("/", addLocation); // Add a new location
router.get("/", getAllLocations); // Get all locations

export default router;
