require("dotenv").config();

const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
    console.log("Tabla lista");
  } catch (err) {
    console.error("Error creando tabla", err);
  }
}

initDB();

app.post("/items", async (req, res) => {
  const { value } = req.body;

  if (!value) return res.status(400).send("Value required");

  //carga CPU
  let total = 0;
  for (let i = 1; i <= 1000; i++) {
    for (let j = 1; j <= 1000; j++) {
      total += i + j;
    }
  }

  try {
    await pool.query("INSERT INTO items(value) VALUES($1)", [value]);
    res.send("Saved");
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

app.get("/items", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));
