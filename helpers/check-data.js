// -> Funciones de check-data
const checkUserData = (params) => {
    let check = false;

    if ((params.name) && (params.surname) && (params.nickname) && (params.email) && (params.password))
    {
        check = true;
    }

    return check;
}

const checkArtistData = (params) => {
    let check = false;

    if ((params.name) && (params.description))
    {
        check = true;    
    }

    return check;
}

const checkAlbumData = (params) => {
    let check = false;

    if ((params.title) && (params.description) && (params.year) && (params.artist_id))
    {
        check = true;
    }

    return check;
}
// FALTA: required -> file
const checkSongData = (params) => {
    let check = false;

    if ((params.name) && (params.track) && (params.duration) && (params.album_id))
    {
        check = true;
    }

    return check;
}
// <- Funciones de check-data

// -> Exportacion
module.exports = {
    checkUserData,
    checkArtistData,
    checkAlbumData,
    checkSongData
}
// <- Exportacion