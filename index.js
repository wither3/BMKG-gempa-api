const express = require('express');
const { ytmp3a } = require('./ytmp3');

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint API untuk YouTube to MP3
app.get('/api/ytmp3', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ error: true, message: "Parameter 'query' diperlukan!" });

        const result = await ytmp3a(query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
