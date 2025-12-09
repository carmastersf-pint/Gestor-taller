import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { Pool } from "pg";
import { fileURLToPath } from "url";

// Necesario para usar __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- CONEXIÓN A POSTGRES ----
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ---- PRUEBA DE CONEXIÓN ----
pool.connect()
  .then(() => console.log("Postgres conectado correctamente ✔️"))
  .catch(err => console.error("Error conectando a Postgres ❌", err));

// ---- RUTAS ----

// Página principal
app.get("/", (req, res) => {
  res.send("Gestor CarMasters funcionando con PostgreSQL ✔️");
});

// Obtener clientes
app.get("/clientes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clientes ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error en /clientes", err);
    res.status(500).send("Error en clientes");
  }
});

// Crear cliente
app.post("/clientes", async (req, res) => {
  try {
    const { nombre, telefono, correo } = req.body;

    const result = await pool.query(
      "INSERT INTO clientes (nombre, telefono, correo, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [nombre, telefono, correo]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creando cliente", err);
    res.status(500).send("Error creando cliente");
  }
});

// ---- ARCHIVOS ESTÁTICOS ----
app.use(express.static(path.join(__dirname, "public")));

// ---- SERVIDOR ----
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

// Ruta de prueba de conexión API
app.get("/api/status", (req, res) => {
  res.json({ message: "API conectada ✔️" });
});
