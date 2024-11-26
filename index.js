const axios = require('axios');
const cheerio = require('cheerio');

export default async function handler(req, res) {
    // Menambahkan header CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); // Mengizinkan semua origin
    res.setHeader('Access-Control-Allow-Methods', 'GET'); // Mengizinkan metode GET
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Mengizinkan header tertentu

    // Jika permintaan adalah OPTIONS, kirimkan respons 200
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const url = 'https://www.bmkg.go.id/'; // Ganti dengan URL yang sesuai
    try {
        // Mengambil data dari halaman web
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Menyimpan data gempa
        const gempaData = [];

        // Mengambil setiap elemen dengan kelas 'row'
        $('.row').each((index, element) => {
            const waktu = $(element).find('.waktu').text().trim(); // Ambil waktu langsung
            const magnitude = $(element).find('li .ic.magnitude').parent().text().trim(); // Mengambil teks setelah elemen dengan kelas 'ic magnitude'
            const kedalaman = $(element).find('li .ic.kedalaman').parent().text().trim(); // Mengambil teks setelah elemen dengan kelas 'ic kedalaman'
            const koordinat = $(element).find('li .ic.koordinat').parent().text().trim(); // Mengambil teks setelah elemen dengan kelas 'ic koordinat'
            const lokasi = $(element).find('li .ic.lokasi').parent().text().trim(); // Mengambil teks setelah elemen dengan kelas 'ic lokasi'
            const dirasakan = $(element).find('li .ic.dirasakan').parent().text().trim(); // Mengambil teks setelah elemen dengan kelas 'ic dirasakan'
            const gambarUrl = $(element).find('a img').attr('src'); // Mengambil URL gambar
            
            // Menyimpan data ke dalam array jika waktu tidak kosong
            if (waktu) {
                gempaData.push({
                    waktu,
                    magnitude,
                    kedalaman,
                    koordinat,
                    lokasi,
                    dirasakan,
                    gambarUrl
                });
            }
        });

        // Mengirimkan data sebagai respons
        res.status(200).json(gempaData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
}

