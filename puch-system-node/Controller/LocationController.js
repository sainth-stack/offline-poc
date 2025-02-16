import { LocationModel } from "../models/LocationModel.js";

// Add a new location
export const addLocation = async (req, res) => {
  try {
    const { latitude, longitude, timestamp } = req.body;
    const location = new LocationModel({ latitude, longitude, timestamp });
    await location.save();
    res.status(201).json({ message: "Location saved", location });
  } catch (error) {
    res.status(500).json({ error: "Failed to save location" });
  }
};

// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await LocationModel.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};
