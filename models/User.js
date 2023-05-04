// -> Importamos
const { Schema, model } = require("mongoose");
// <- Importamos

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    biography: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "user", // user o admin
        select: false
    },
    profile_image: {
        type: String,
        default: "user.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Exportamos ->
module.exports = model("User", UserSchema, "users");
// <- Exportamos