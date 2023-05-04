// -> Importaciones
    // - Dependencias
const express = require("express");
const multer = require("multer");
    // - middlewares
const auth = require("../middlewares/auth-middleware");
    // - Controllador
const UserController = require("../controllers/user-controller");
const User = require("../models/User");
// <- Importaciones

// Configuración para subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/img_users/");
    },
    filename: (req, file, cb) => {
        cb(null, "user-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

// Cargamos el Router
const router = express.Router();

// Ruta de prueba
router.get("/test_user", UserController.test);

// -> Rutas de User
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/view_profile/:id", auth.authToken, UserController.viewProfile);
router.put("/update/", auth.authToken, UserController.update);
router.post("/upload/", [auth.authToken, uploads.single("file0")], UserController.upload);
router.post("/view_image/:name?", auth.authToken, UserController.viewImage);
router.get("/count", auth.authToken, UserController.count);

// <- Rutas de user

// Exportamos el Router
module.exports = router;