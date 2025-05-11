// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import taskRoutes from './routes/tasks.js';




dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/tasks', taskRoutes);

app.get("/", (req, res) => {
  res.send("Backend is live and running on EC2!");
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
