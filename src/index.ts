import express from "express";
import dotenv from "dotenv";
import { db } from "./config/firebase.js";

// Configuración de variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4566;

app.use(express.json());

app.get("/ping", async (req, res) => {
  try {
    // Escribe un documento de prueba
    await db
      .collection("test")
      .doc("ping")
      .set({ message: "pong", timestamp: Date.now() });
    // Lee el documento de prueba
    const doc = await db.collection("test").doc("ping").get();
    res.json({ data: doc.data() });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
