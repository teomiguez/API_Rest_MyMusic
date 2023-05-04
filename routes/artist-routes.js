// -> Importaciones
    // - Dependencias
const express = require("express");
const multer = require("multer");
    // - middlewares
const auth = require("../middlewares/auth-middleware");
    // - Controllador
const ArtistController = require("../controllers/artist-controller");
// <- Importaciones

// Configuración para subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/img_artists/");
    },
    filename: (req, file, cb) => {
        cb(null, "artist-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

// Cargamos el Router
const router = express.Router();

// Ruta de prueba
router.get("/test_artist", ArtistController.test);

// -> Rutas de User
router.post("/save", auth.authToken, ArtistController.save);
router.get("/view_artist/:id", auth.authToken, ArtistController.viewArtist);
router.get("/list/:page?", auth.authToken, ArtistController.listArtists);
router.put("/update/:id", auth.authToken, ArtistController.update);
router.delete("/delete/:id", auth.authToken, ArtistController.remove);
router.post("/upload/:id", [auth.authToken, uploads.single("file1")], ArtistController.upload);
router.post("/view_image/:id", auth.authToken, ArtistController.viewImage);
router.get("/count", auth.authToken, ArtistController.count);

// <- Rutas de user

// Exportamos el Router
module.exports = router;