const yts = require('yt-search');
const https = require('https');

async function downloadMP3(link) {
    try {
        const youtubeUrl = new URL(link);
        const videoId = youtubeUrl.searchParams.get('v');

        if (!videoId) throw new Error('Video ID tidak ditemukan');

        const options = {
            method: 'GET',
            hostname: 'youtube-mp36.p.rapidapi.com',
            port: null,
            path: `/dl?id=${videoId}`,
            headers: {
                'x-rapidapi-key': '3eb539a2d9msh6a71fb36c867c07p10828djsn1ca4ae3f0bed',
                'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                const chunks = [];

                res.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                res.on('end', () => {
                    try {
                        const body = Buffer.concat(chunks).toString();
                        const result = JSON.parse(body);

                        if (result.status === 'ok' && result.link) {
                            resolve(result);
                        } else {
                            reject(new Error('Respon API tidak valid'));
                        }
                    } catch (error) {
                        reject(new Error('Gagal parsing JSON dari API'));
                    }
                });
            });

            req.on('error', (error) => reject(error));
            req.end();
        });
    } catch (error) {
        throw new Error(`downloadMP3 Error: ${error.message}`);
    }
}

async function cariYT(text) {
    try {
        const r = await yts(text);
        if (!r.all.length) throw new Error('Video tidak ditemukan');

        return r.all[0];
    } catch (error) {
        throw new Error(`cariYT Error: ${error.message}`);
    }
}

async function ytmp3a(query) {
    try {
        const hasil = await cariYT(query);
        const hasil2 = await downloadMP3(hasil.url);

        return {
            title: hasil.title,
            videoId: hasil.videoId,
            thumbnail: hasil.thumbnail,
            desc: hasil.description,
            time: hasil.timestamp,
            second: hasil.seconds,
            ago: hasil.ago,
            views: hasil.views,
            author: {
                namaChannel: hasil.author.name,
                link: hasil.author.url,
            },
            linkUnduh: {
                link: hasil2.link || 'Tidak tersedia',
                ukuranFile: hasil2.filesize || 'Tidak tersedia'
            }
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            error: true,
            message: error.message
        };
    }
}

// Ekspor fungsi agar bisa digunakan di file lain
module.exports = { ytmp3a };
