// -> Importamos
const { Schema, model } = require("mongoose");
// <- Importamos

const AlbumSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "album.jpg"
    },
    year: {
        type: Number,
        required: true
    },
    artist_id: {
        type: Schema.ObjectId,
        ref: "Artist",
        required: true
    },
    num_songs: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Exportamos ->
module.exports = model("Album", AlbumSchema, "albums");
// <- Exportamos