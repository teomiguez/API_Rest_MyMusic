// -> Importamos
const { Schema, model } = require("mongoose");
// <- Importamos

const SongSchema = Schema({
    name: {
        type: String,
        required: true
    },
    track: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    file: {
        type: String,
        default: "none.mp3"
        //required: true
    },
    album_id: {
        type: Schema.ObjectId,
        ref: "Album",
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Exportamos ->
module.exports = model("Song", SongSchema, "songs");
// <- Exportamos