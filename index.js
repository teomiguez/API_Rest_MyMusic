// Importamos dependencias ->
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");
// <- Importamos dependencias

// Iniciamos la App - Enviamos un mensaje
console.log("Arranca mymusic🎸");

// Conectamos a la base de datos
connection();

// Creamos el servidor node
const app = express();
const port = 3900;

// Configuramos el cors
app.use(cors());

// Convertimos los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuracion de rutas ->
// Importamos los archivos de ruta
const UserRoutes = require("./routes/user-routes");
const ArtistRoutes = require("./routes/artist-routes");
const AlbumRoutes = require("./routes/album-routes");
const SongRoutes = require("./routes/song-routes");

// Configuramos las rutas y agregamos un prefijo distinto para cada una
app.use("/api/user", UserRoutes);
app.use("/api/artist", ArtistRoutes);
app.use("/api/album", AlbumRoutes);
app.use("/api/song", SongRoutes);
// <- Configuracion de rutas

// Ruta de prueba
app.get("/route-test", (req, res) => {
    return res.status(200).json(
        {
            "name": "route-test"
        }
    )
})

// Poner el servidor a escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor escuchando en el puerto: " + port);
})