import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    // required: true
  },
  longitude: {
    type: Number,
    // required: true
  },
  timestamp: { type: Date, default: Date.now },
  totalDistanceTraveled: {
    type: Number,
    default: 0, // Distance in kilometers
  },
});

export const LocationModel= mongoose.model("Location", locationSchema);
