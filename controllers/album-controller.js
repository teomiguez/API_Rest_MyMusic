// -> Importaciones
// Models
const Album = require("../models/Album");
const Artist = require("../models/Artist");
const Song = require("../models/Song");

// Dependencias
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

// Helpers
const checkData = require("../helpers/check-data");
const validateData = require("../helpers/validate-data");
// <- Importaciones

// Accion de prueba
const test = (req, res) => {
    return res.status(200).send({
        status: "succes",
        message: "Accion de prueba del AlbumController"
    });
}

// Acciones de Album ->
// 1. Guardar album
const save = (req, res) => {
    const params = req.body;

    if (!checkData.checkAlbumData(params))
    {
        return res.status(400).send({
            status: "error",
            message: "Petición incompleta"
        }); 
    }

    if (!validateData.validateAlbum(params))
    {
        return res.status(404).send({
            status: "error",
            message: "Error de validación"
        }); 
    }

    const newAlbum = Album(params);
    newAlbum.save();

    let albumSaved = newAlbum.toObject();

    return res.status(200).send({
        status: "success",
        message: "Album guardado exitosamente",
        album: albumSaved
    });
}

// 2. Ver un Album
const viewAlbum = async (req, res) => {
    const album_id = req.params.id
    try
    {
        const album = await Album.findById(album_id).populate("artist_id");

        return res.status(200).send({
            status: "succes",
            id: album_id,
            album: album
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al buscar el album"
        });
    }
}

// 3. Ver los albums de un artista
const listAlbumsByArtist = async (req, res) => {
    const artist_id = req.params.artistId;
    const itemsPerPage = 5;
    let page = 1;

    if (req.params.page) page = req.params.page;

    try
    {
        const artist = await Artist.findById(artist_id).select("-__v");
        const albums = await Album.find({ artist_id: artist_id }).select("-artist_id -__v").paginate(page, itemsPerPage);
        const totalAlbums = (await Album.find({ artist_id: artist_id })).length;
        const totalPages = Math.ceil(totalAlbums / itemsPerPage);

        return res.status(200).send({
            status: "succes",
            artist: artist,
            totalAlbums: totalAlbums,
            albums: albums,
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

// 4. Actualizar album
const updateAlbum = async (req, res) => {
    const id = req.params.id;
    const params = req.body;

    if (!validateData.validateAlbumToUpdate(params))
    {
        return res.status(404).send({
            status: "error",
            message: "Error de validación"
        });
    }

    try
    {
        const albumUpdate = await Album.findByIdAndUpdate(id, params, { new: true });
        
        return res.status(200).send({
            status: "success",
            id: id,
            albumUpdate: albumUpdate
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al buscar y actualizar el album"
        });
    }
}

// 5. Borrar un album
const removeAlbum = async (req, res) => {
    const id = req.params.id;

    try
    {
        const albumRemoved = await Album.findById(id).remove();
        const songsRemoved = await Song.find({ algbum_id: id }).remove();
        
        return res.status(200).send({
            status: "success",
            albumRemoved: albumRemoved,
            songRemoved: songsRemoved
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al buscar y borrar el album"
        });
    }
}

// 6. Subir una imagen
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

    if (!validateData.validatePathToImage(path))
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
        let albumUpdate = await Album.findOneAndUpdate({_id: id}, {image: filename}, {new: true});

        return res.status(200).send({
            status: "success",
            message: "Imagen cargada",
            file: req.file,
            album: albumUpdate
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

// 7. Ver una imagen
const viewImage = async (req, res) => {
    let fileName, filePath;
    let id = req.params.id;
        
    try
    {
        let album = await Album.findById(id);
        fileName = album.image;
    }
    catch (error)
    {
        return res.status(404).send({
            status: "error",
            message: "Error al buscar el album"
        });
    }

    filePath = "./uploads/img_albums/" + fileName;

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
const count = async (req, res) => {
    try
    {
        let count = (await Album.find({})).length;

        if ((!count) || (count <= 0))
        {
            return res.status(200).send({
                status: "succes",
                message: "No hay albums registrados"
            });
        }

        return res.status(200).send({
            status: "succes",
            cantidad: count
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al contar"
        });
    }
}

// <- Acciones de Album

// -> Exportacion
module.exports = {
    test,
    save,
    viewAlbum,
    listAlbumsByArtist,
    updateAlbum,
    removeAlbum,
    upload,
    viewImage,
    count
}
// <- Exportacion