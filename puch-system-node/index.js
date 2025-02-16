import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import locationRoutes from "./routes/LocationRoute.js";
import connectDB from "./config/Db.js";

dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB

// Routes
app.use("/api/locations", locationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});