// -> Importaciones
// Models
const Artist = require("../models/Artist");
const Album = require("../models/Album");
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
        message: "Accion de prueba del ArtistController"
    });
}

// Acciones de Artist ->
// 1. Guardar un artista
const save = async (req, res) => {
    const params = req.body;

    if (!checkData.checkArtistData(params))
    {
        return res.status(400).send({
            status: "error",
            message: "Petición incompleta..."
        });    
    }

    if (!validateData.validateArtist(params))
    {
        return res.status(404).send({
            status: "error",
            message: "Datos invalidos..."
        });    
    }

    let newArtist = Artist(params);

    try
    {
        newArtist.save();

        let artistSaved = newArtist.toObject();

        return res.status(200).send({
            status: "success",
            message: "Artista guardado con exito",
            artistSaved
        });  
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al guardar el artista..."
        });  
    }
}

// 2. Ver un artista
const viewArtist = async (req, res) => {
    const id = req.params.id;

    try
    {
        let artist = await Artist.findById(id);

        return res.status(200).send({
            status: "success",
            id,
            artist
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al buscar el artista"
        });
    }
}

// 3. Listar artista
const listArtists = async (req, res) => {
    let page = 1;
    const itemsPerPage = 5;

    if (req.params.page) page = parseInt(req.params.page);

    try
    {
        let artists = await Artist.find({}).sort("name").paginate(page, itemsPerPage);
        let totalArtist = (await Artist.find({})).length;
        let totalPages = Math.ceil(totalArtist / itemsPerPage);
        
        return res.status(200).send({
            status: "success",
            message: "Listado...",
            totalArtist,
            page,
            totalPages,
            itemsPerPage,
            artists
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al buscar artistas"
        });
    }
}

// 4. Modificar artista
const update = async (req, res) => {
    const id = req.params.id;
    const params = req.body;

    if (!validateData.validateArtistToUpdate(params))
    {
        return res.status(404).send({
            status: "error",
            message: "Datos invalidos"
        });
    }

    try
    {
        let artistUpdate = await Artist.findByIdAndUpdate(id, params, {new: true});

        return res.status(200).send({
            status: "success",
            message: "Artista actualizado",
            id,
            artistUpdate
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al buscar el artista"
        });
    }
}

// 5. Borrar artista
const remove = async (req, res) => {
    const id = req.params.id;

    try
    {
        const artistDelete = await Artist.findByIdAndRemove(id);
        const albumsToDelete = await Album.find({ artist_id: id });
        
        albumsToDelete.forEach( async (album) => {
            let songsDelete = await Song.find({ album_id: album._id }).remove();
            album.remove();
        });

        return res.status(200).send({
            status: "success",
            message: "El artista, sus albums y canciones fueron removidos",
            artistDelete
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al buscar el artista"
        });
    }
}

// 5. Subir una imagen
const upload = async (req, res) => {
    if (!req.file)
    {
        return res.status(404).send({
            status: "error",
            message: "Petición incompleta..."
        });
    }

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
        let artistUpdate = await Artist.findOneAndUpdate({_id: req.params.id}, {image: req.file.filename}, {new: true});

        return res.status(200).send({
            status: "success",
            message: "Imagen cargada",
            file: req.file,
            artist: artistUpdate
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

// 6. Ver una imagen
const viewImage = async (req, res) => {
    let fileName, filePath;
    let id = req.params.id;
        
    try
    {
        let artist = await Artist.findById(id);
        fileName = artist.image;
    }
    catch (error)
    {
        return res.status(404).send({
            status: "error",
            message: "Error al buscar el artista"
        });
    }

    filePath = "./uploads/img_artists/" + fileName;

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

// 7. Contador
const count = async (req, res) => {
    try
    {
        let count = (await Artist.find({})).length;

        if ((!count) || (count <= 0))
        {
            return res.status(200).send({
                status: "succes",
                message: "No hay artistas registrados"
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

// <- Acciones de Artist

// -> Exportacion
module.exports = {
    test,
    save,
    viewArtist,
    listArtists,
    update,
    remove,
    upload,
    viewImage,
    count
}
// <- Exportacion