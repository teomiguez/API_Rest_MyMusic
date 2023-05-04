// -> Importaciones
// Models
const Song = require("../models/Song");
const Album = require("../models/Album");
const Artist = require("../models/Artist");

// Dependencias
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

// Helpers
const checkData = require("../helpers/check-data");
const validateData = require("../helpers/validate-data");
const { param } = require("../routes/album-routes");
// <- Importaciones

// Accion de prueba
const test = (req, res) => {
    return res.status(200).send({
        status: "succes",
        message: "Accion de prueba del SongController"
    });
}

// Acciones de Song ->
// 1. Guardar una canción
const save = async (req, res) => {
    const params = req.body;

    if (!checkData.checkSongData(params))
    {
        return res.status(400).send({
            status: "error",
            message: "Petición incompleta"
        });
    }

    if (!(await validateData.validateSong(params)))
    {
        return res.status(404).send({
            status: "error",
            message: "Error de validación"
        });
    }

    try
    {
        const newSong = Song(params);
        newSong.save();

        let songSaved = newSong.toObject();

        return res.status(200).send({
            status: "success",
            message: "Canción guardada exitosamente",
            songSaved
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al guardar la canción"
        });
    }
}

// 2. Ver datos de canción
const viewDataSong = async (req, res) => {
    const id = req.params.id;

    try
    {
        const song = await Song.findById(id).select("-__v").populate("album_id");

        // despues podría modificar la duración para que en vez de verse en segundos sea en minutos con el formato XX:XX, o simplemente al guardar una canción ponerlo así

        return res.status(200).send({
            status: "succes",
            song: song
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al buscar la canción"
        });
    }
}

// 3. Listar canciones de un album
const listSongsByAlbum = async (req, res) => {
    const albumId = req.params.album_id;
    const itemsPerPage = 5;
    let page = 1;

    if (req.params.page) page = req.params.page;

    try
    {
        const album = await Album.findById(albumId).select("-__v");
        const artist = await Artist.findById(album.artist_id).select("-__v");
        const songs = await Song.find({ album_id: albumId }).select("-album_id -__v").paginate(page, itemsPerPage);
        const totalSongs = (await Song.find({ album_id: albumId })).length;
        const totalPages = Math.ceil(totalSongs / itemsPerPage);

        return res.status(200).send({
            status: "succes",
            artist: artist,
            album: album,
            totalSongs: totalSongs,
            songs: songs,
            page: page,
            totalPages: totalPages
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al buscar los albums"
        });
    }
}

// 4. Actualizar canción
const updateSong = async (req, res) => {
    const id = req.params.id;
    const params = req.body;

    if (!validateData.validateSongToUpdate(params))
    {
        return res.status(404).send({
            status: "error",
            message: "Error de validación"
        });
    }

    try
    {
        const songUpdate = await Song.findByIdAndUpdate(id, params, {new: true});

        return res.status(200).send({
            status: "success",
            message: "Canción actualizada con exito",
            songUpdate
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al buscar y modificar la canción"
        });
    }
}

// 5. Borrar una canción
const removeSong = async (req, res) => {
    const id = req.params.id;

    try
    {
        const songRemove = await Song.findByIdAndRemove(id);

        return res.status(200).send({
            status: "success",
            message: "Canción borrada exitosamente",
            songRemove
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al buscar la canción"
        });
    }
}

// 6. Subir archivo
const upload = async (req, res) => {
    if (!req.file)
    {
        return res.status(404).send({
            status: "error",
            message: "Petición incompleta..."
        });
    }

    const id = req.params.id;
    let filename = req.file.filename;
    let image = req.file.originalname;
    let imageSplit = image.split("\.");
    let path = imageSplit[1];

    if (!validateData.validatePathToSong(path))
    {
        const filePath = req.file.path;
        const fileDelete = fs.unlinkSync(filePath);

        return res.status(404).send({
            status: "error",
            message: "La extensión es invalida -> el archivo fué borrado",
            fileDelete
        });
    }

    try
    {
        let songUpdate = await Song.findOneAndUpdate({_id: id}, {file: filename}, {new: true});

        return res.status(200).send({
            status: "success",
            message: "Archivo cargado",
            file: req.file,
            song: songUpdate
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al guardar la imagen"
        });
    }
}

// 7. Ver archivo
const viewSong = async (req, res) => {
    let fileName, filePath;
    let id = req.params.id;
        
    try
    {
        let song = await Song.findById(id);
        fileName = song.file;
    }
    catch (error)
    {
        return res.status(404).send({
            status: "error",
            message: "Error al buscar el album"
        });
    }

    filePath = "./uploads/file_songs/" + fileName;

    fs.stat(filePath, (error, exist) => {
        if (!exist)
        {
            return res.status(404).send({
                status: "error",
                message: "La imagen no existe"
            });
        }
        
        return res.sendFile(path.resolve(filePath));
    });
}

// 8. Contador
const count = (req, res) => {

}

// <- Acciones de Song

// -> Exportacion
module.exports = {
    test,
    save,
    viewDataSong,
    listSongsByAlbum,
    updateSong,
    removeSong,
    upload,
    viewSong,
    count
}
// <- Exportacion