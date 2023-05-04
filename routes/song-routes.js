// -> Importaciones
    // - Dependencias
const express = require("express");
const multer = require("multer");
    // - middlewares
const auth = require("../middlewares/auth-middleware");
    // - Controllador
const SongController = require("../controllers/song-controller");
// <- Importaciones

// Configuración para subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/file_songs/");
    },
    filename: (req, file, cb) => {
        cb(null, "song-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

// Cargamos el Router
const router = express.Router();

// Ruta de prueba
router.get("/test_song", SongController.test);

// -> Rutas de User
router.post("/save", auth.authToken, SongController.save);
router.get("/view_data/:id", auth.authToken, SongController.viewDataSong);
router.get("/list_by_album/:album_id/:page?", auth.authToken, SongController.listSongsByAlbum);
router.put("/update/:id", auth.authToken, SongController.updateSong);
router.delete("/remove/:id", auth.authToken, SongController.removeSong);
router.put("/upload/:id", [auth.authToken, uploads.single("song")], SongController.upload);
router.get("/view_song/:id", auth.authToken, SongController.viewSong);
router.get("/count", auth.authToken, SongController.count);
// <- Rutas de user

// Exportamos el Router
module.exports = router;