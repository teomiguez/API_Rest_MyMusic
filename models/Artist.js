// -> Importamos
const { Schema, model } = require("mongoose");
// <- Importamos

const ArtistSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "artist.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Exportamos ->
module.exports = model("Artist", ArtistSchema, "artists");
// <- Exportamos