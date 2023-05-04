// -> Importaciones
    // - Dependencias
const express = require("express");
const multer = require("multer");
    // - middlewares
const auth = require("../middlewares/auth-middleware");
    // - Controllador
const AlbumController = require("../controllers/album-controller");
// <- Importaciones

// Configuración para subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/img_albums/");
    },
    filename: (req, file, cb) => {
        cb(null, "album-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

// Cargamos el Router
const router = express.Router();

// Ruta de prueba
router.get("/test_album", AlbumController.test);

// -> Rutas de Album
router.post("/save", auth.authToken, AlbumController.save);
router.get("/view_album/:id", auth.authToken, AlbumController.viewAlbum);
router.get("/list_by_artist/:artistId/:page?", auth.authToken, AlbumController.listAlbumsByArtist);
router.put("/update/:id", auth.authToken, AlbumController.updateAlbum);
router.delete("/remove/:id", auth.authToken, AlbumController.removeAlbum);
router.post("/upload/:id", [auth.authToken, uploads.single("file1")], AlbumController.upload);
router.get("/view_image/:id", auth.authToken, AlbumController.viewImage);
router.get("/count", auth.authToken, AlbumController.count);
// <- Rutas de Album

// Exportamos el Router
module.exports = router;