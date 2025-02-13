const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("Conectado ao SQLite.");
  }
});

db.run(
  `CREATE TABLE IF NOT EXISTS enderecos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cep TEXT UNIQUE,
    logradouro TEXT,
    bairro TEXT,
    cidade TEXT,
    estado TEXT
  )`
);

app.post("/buscar", async (req, res) => {
  const { cep } = req.body;
  if (!cep || cep.length !== 8) {
    return res.status(400).json({ error: "CEP inválido!" });
  }

  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    if (response.data.erro) {
      return res.status(404).json({ error: "CEP não encontrado!" });
    }

    const { logradouro, bairro, localidade: cidade, uf: estado } = response.data;

    db.run(
      `INSERT OR IGNORE INTO enderecos (cep, logradouro, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?)`,
      [cep, logradouro, bairro, cidade, estado],
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao salvar no banco!" });
        }
        res.json({ message: "Endereço salvo!", endereco: response.data });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o CEP!" });
  }
});

app.get("/enderecos", (req, res) => {
  const { ordenarPor = "cidade", ordem = "asc" } = req.query;
  const colunasValidas = ["cidade", "bairro", "estado"];
  if (!colunasValidas.includes(ordenarPor)) {
    return res.status(400).json({ error: "Campo de ordenação inválido!" });
  }

  const query = `SELECT * FROM enderecos ORDER BY ${ordenarPor} ${ordem === "desc" ? "DESC" : "ASC"}`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar endereços!" });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
