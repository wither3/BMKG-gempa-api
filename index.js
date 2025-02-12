const express = require("express");
const axios = require("axios");
const { ytmp3a } = require("./api/ytmp3");

const app = express();

const FIREBASE_URL = "https://tempatrahasia-201bd-default-rtdb.asia-southeast1.firebasedatabase.app/data.json";

// Route untuk mengambil data dari Firebase
app.get("/cek/dataku", async (req, res) => {
  try {
    const response = await axios.get(FIREBASE_URL);
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data JSON" });
  }
});

// Endpoint API untuk YouTube to MP3
app.get("/api/ytmp3", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: true, message: "Parameter 'query' diperlukan!" });

    const result = await ytmp3a(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
