// -> Importaciones
const validator = require("validator");
const Artist = require("../models/Artist");
const Album = require("../models/Album");
const Song = require("../models/Song");
// <- Importacionies

// -> Funciones de validate-data
const validateUser = (params) => {
    let validate = false;
    let name = false;
    let surname = false;
    let nickname = false;
    let email = false;
    let password = false;

    if (params.name)
    {
        name = !validator.isEmpty(params.name) &&
            validator.isLength(params.name, { min: 3, max: undefined }) &&
            validator.isAlpha(params.name, "es-ES", {ignore: '\s'});
    } else { name = true; }

    if (params.surname)
    {
        surname = !validator.isEmpty(params.surname) &&
            validator.isLength(params.surname, { min: 3, max: undefined }) &&
            validator.isAlpha(params.surname, "es-ES", {ignore: '\s'});
    } else { surname = true;  }

    if (params.nickname)
    {
        nickname = !validator.isEmpty(params.nickname) && 
            validator.isLength(params.nickname, { min: 3, max: 15 }) &&
            (validator.isAlphanumeric(params.nickname) || validator.isAlpha(params.nickname));
    } else { nickname = true; }

    if (params.email)
    {
        email = !validator.isEmpty(params.email) && 
            validator.isLength(params.email, { min: 3, max: undefined }) &&
            validator.isEmail(params.email);
    } else { email = true;  }

    if (params.password)
    {
        password = !validator.isEmpty(params.password) &&
                        validator.isLength(params.password, { min: 6, max: 16 });
    } else { password = true;  }
    
    if ((name) && (surname) && (nickname) && (email) && (password))
    {
        validate = true;
    }

    return validate;
}

const validateUserToUpdate = (params) => {

}

const validateArtist = (params) => {
    let validate = false;

    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3, max: undefined }) &&
        validator.isAlpha(params.name, "es-ES", {ignore: '\s'});
    
    let description = !validator.isEmpty(params.description) &&
        validator.isLength(params.description, { min: undefined, max: 200 });

    if ((name) && (description)) validate = true;

    return validate;
}

const validateArtistToUpdate = (params) => {
    let validate = false;
    let name = false;
    let description = false;

    if (params.name)
    {
        name = !validator.isEmpty(params.name) &&
            validator.isLength(params.name, { min: 3, max: undefined }) &&
            validator.isAlpha(params.name, "es-ES", {ignore: '\s'});
    } else { name = true; }

    if (params.description)
    {
        description = !validator.isEmpty(params.description) &&
            validator.isLength(params.description, { min: undefined, max: 200 });
    } else { description = true; }

    if ((name) && (description)) validate = true;

    return validate;
}

const validateAlbum = async (params) => {
    let validate = false;

    let title = !validator.isEmpty(params.title) &&
            validator.isLength(params.title, { min: 3, max: undefined });
    let description = !validator.isEmpty(params.description) &&
            validator.isLength(params.description, { min: undefined, max: 200 });
    let year = !validator.isEmpty(params.year);
    let artist_id = await validateArtistId(params.artist_id);

    if ((title) && (description) && (year) && (artist_id))
    {
        validate = true;
    }

    return validate;
}

const validateAlbumToUpdate = async (params) => {
    let validate = false;

    let title = false;
    let description = false;
    let year = false;
    let artist_id = false;

    if (params.title)
    {  
        title = !validator.isEmpty(params.title) &&
            validator.isLength(params.title, { min: 1, max: undefined });
    } else { title = true; }

    if (params.description)
    {    
        description = !validator.isEmpty(params.description) &&
                validator.isLength(params.description, { min: undefined, max: 200 });
    } else { description = true; }

    if (params.year)
    {    
        year = !validator.isEmpty(params.title);
    } else { year = true; }

    if (params.artist_id)
    {    
        artist_id = await validateArtistId(params.artist_id);
    } else { artist_id = true; }

    if ((title) && (description) && (year) && (artist_id))
    {
        validate = true;
    }

    return validate;
}

const validateSong = async (params) => {
    let validate = false;

    let name = !validator.isEmpty(params.name) &&
            validator.isLength(params.name, { min: 1, max: undefined });
    let track = !validator.isEmpty(params.track) &&
        await validateTrackOfSongs(params.album_id, params.track);
    let duration = !validator.isEmpty(params.duration);
    let album_id = await validateAlbumId(params.album_id);

    if ((name) && (track) && (duration) && (album_id))
    {
        validate = true;
    }

    return validate;
}

const validateSongToUpdate = async (params) => {
    let validate = false;

    let name = false;
    let track = false;
    let duration = false;
    let album_id = false;

    if (params.name)
    {
        name = !validator.isEmpty(params.name) &&
                validator.isLength(params.name, { min: 1, max: undefined });
    } else { name = true; }

    if (params.track)
    {
        track = !validator.isEmpty(params.track) &&
            await validateTrackOfSongs(params.album_id, params.track);
    } else { track = true; }

    if (params.duration)
    {
        duration = !validator.isEmpty(params.duration);
    } else { duration = true; }

    if (params.album_id)
    {
        album_id = await validateAlbumId(params.album_id);
    } else { album_id = true; }


    if ((name) && (track) && (duration) && (album_id))
    {
        validate = true;
    }

    return validate;
}

const validatePathToImage = (path) => {
    let validate = false;

    if ((path == "jpeg") || (path == "jpg") || (path == "png") || (path == "gif")) validate = true;

    return validate;
}

const validatePathToSong = (path) => {
    let validate = false;

    if ((path == "mp3") || (path == "aac") || (path == "ogg") || (path == "wav")) validate = true;

    return validate;
}
// <- Funciones de validate-data

// -> Funciones propias para validar Models
const validateArtistId = async (id) => {
    try
    {
        const artist = await Artist.findById(id);
        if (artist) return true;
    }
    catch (error)
    {
        return false;
    }
}

const validateAlbumId = async (id) => {
    try
    {
        const album = await Album.findById(id);
        if (album) return true;
    }
    catch (error)
    {
        return false;
    }
}

const validateTrackOfSongs = async (album_id, track) => {
    let validate = true;
    
    try
    {
        const songsOfAlbum = await Song.find({ album_id: album_id });

        songsOfAlbum.forEach(song => {
            let trackSong = song.track;
            if (trackSong == track) validate = false;
        });


        return validate;
    }
    catch (error)
    {
        return validate;
    }
}
// <- Funciones propias para validar Models

// -> Exportaciones
module.exports = {
    validateUser,
    validateUserToUpdate,
    validateArtist,
    validateArtistToUpdate,
    validateAlbum,
    validateAlbumToUpdate,
    validateSong,
    validateSongToUpdate,
    validatePathToImage,
    validatePathToSong
}
// <- Exportaciones