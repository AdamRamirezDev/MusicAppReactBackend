const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());

//Endopoints de busqueda
app.get("/api/search", async (req, res) => {
    const { q } = req.query;

    if(!q) return res.status(400).json({error: "Query missing"});

    try {
        const response = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(q)}`);
        const data = await response.json();
        console.log("Endpoint de busqueda: ", data)
        res.json({data : data.data});
        
    } catch(error){
        res.status(500).json({error: "Error al conectar con Deezer"});
    }
});

// Endopoints de albumes populares
app.get("/api/albums", async (req, res) => {
    try{
        const response = await fetch("https://api.deezer.com/chart/0/albums?limit=10");
        const data = await response.json();
        res.json({data: data.data});
        console.log("Endpoint de albumes populares: ",data)
    } catch(error){
        console.error("Error al obtener albumes: ", error);
        res.status(500).json({error: "Error al obtener albumes"});
    }
});

//Endpoint para obtener las canciones mas escuchadas
app.get("/api/tracks", async (req, res) => {

    try {
        const response = await fetch("https://api.deezer.com/chart/0/tracks?limit=10");
        const data = await response.json();
        res.json(data);

    } catch(error){
        res.status(500).json({error: "Error al obtener canciones populares"});
    }
});

//Endpoint para obtener las playlists populares
app.get("/api/playlists", async (req, res)=> {
    try {
        const response = await fetch("https://api.deezer.com/chart/0/playlists?limit=10");
        const data = await response.json();
        res.json({data: data.data}); // Formato consistente con otros endpoints
        console.log("Endpoint de playlists populares: ", data);
    } catch(error){
        console.error("Error al obtener playlists:", error);
        res.status(500).json({error: "Error al obtener playlist populares"});
    }
});

//Endpoint para obtener las canciones de un album
app.get("/api/album/:id/tracks", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`https://api.deezer.com/album/${id}/tracks`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "application/json"
            }
        });
        const data = await response.json();
        console.log("Endpoint de canciones de album",data)
        res.json(data);
        
    } catch (error) {
        console.error("Error al obtener las canciones del album:", error);
        res.status(500).json({error: "Error al obtener las canciones del album"});
    }
});

//Endpoint para obtener las canciones de una playlist
app.get("/api/playlist/:id/tracks", async (req, res) => {
    const { id } = req.params;

    try {
        const playlistResponse = await fetch(`https://api.deezer.com/playlist/${id}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; MyMusicApp/1.0; +http://localhost)",
                "Accept": "application/json",
            },
        });
        const playlistData = await playlistResponse.json();
        
        if (playlistData.error) {
            throw new Error(playlistData.error.message || 'Error al obtener la playlist');
        }

        const tracksResponse = await fetch(`https://api.deezer.com/playlist/${id}/tracks`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; MyMusicApp/1.0; +http://localhost)",
                "Accept": "application/json",
            },
        });
        const tracksData = await tracksResponse.json();
        
        if (tracksData.error) {
            throw new Error(tracksData.error.message || 'Error al obtener las canciones');
        }

        console.log("Endpoint de canciones de playlist:", tracksData);
        res.json({ data: tracksData.data }); // Formato consistente con otros endpoints
    } catch (error) {
        console.error("Error al obtener las canciones de la playlist:", error);
        res.status(500).json({ error: "Error al obtener las canciones de la playlist" });
    }
});

app.listen(PORT, () => {
    console.log(`proxy server running on port: ${PORT}`);
})
