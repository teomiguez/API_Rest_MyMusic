// -> Importaciones
// Models
const User = require("../models/User");

// Dependencias
const fs = require("fs");
const path = require("path");

// Helpers
const checkData = require("../helpers/check-data");
const validateData = require("../helpers/validate-data");
const encryptData = require("../helpers/encypted-data");
const jwt = require("../helpers/jwt");
const Artist = require("../models/Artist");
// <- Importaciones

// Accion de prueba
const test = (req, res) => {
    return res.status(200).send({
        status: "succes",
        message: "Accion de prueba del UserController"
    });
}

// Acciones de User ->
// 1. Registro
const register = async (req, res) => {
    const params = req.body;
    
    if (!checkData.checkUserData(params))
    {
        return res.status(400).send({
            status: "error",
            message: "Petición incompleta..."
        });
    } 

    if (!validateData.validateUser(params))
    {
        return res.status(405).send({
            status: "error",
            message: "Error en la validación..."
        });
    }
    
    try
    {
        const userExist = await User.find({
            $or: [
                { email: params.email.toLowerCase() },
                { nickname: params.nickname.toLowerCase() }
            ]
        });
        
        if ((userExist) && (userExist.length >= 1))
        {
            return res.status(200).send({
                status: "error",
                message: "El usuario existe"
            });
        }
        
        let pwd = await encryptData.encyptedPassword(params.password, 10);
        params.password = pwd;
        
        let newUser = new User(params);
    
        newUser.save();

        let userSaved = newUser.toObject();

        delete userSaved.password;
        delete userSaved.role;
    
        return res.status(200).send({
            status: "succes",
            message: "Registro exitoso",
            user: userSaved
        });

    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al validar el usuario"
        });
    }
}

// 2. Login
const login = async (req, res) => {
    const params = req.body;

    if ((!params.password) || (!params.email))
    {
        return res.status(400).send({
            status: "error",
            message: "Petición incompleta..."
        });
    }

    try {
        const user = await User.findOne({ email: params.email }).select("+password +role");
        const pwd = encryptData.comparePasswords(params.password, user.password);

        let userLogin = user.toObject();
        delete userLogin.password;

        if (!pwd)
        {
            return res.status(400).send({
                status: "error",
                message: "Usuario o constraseña invalidos..."
            });
        }

        const token = jwt.createToken(user);

        return res.status(200).send({
            status: "succes",
            message: "Login exitoso",
            user: userLogin,
            token: token
        });
    }
    catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al buscar el usuario"
        });
    }
}

// 3. Ver un perfil de usuario
const viewProfile = async (req, res) => {
    const userId = req.params.id;

    try
    {
        const user = await User.findById(userId);
        
        return res.status(200).send({
            status: "succes",
            userId,
            user
        });
    }
    catch (error)
    {
        return res.status(405).send({
            status: "error",
            message: "El usuario no existe..."
        });
    }

}

// 4. Actualizar mi perfil
const update = async (req, res) => {
    let userIdentity = req.user;
    let userToUpdate = req.body;

    if ((userToUpdate.email) || (userToUpdate.nickname))
    {
        let users = await User.find({
            $or: [
                { email: userToUpdate.email.toLowerCase() },
                { nickname: userToUpdate.nickname.toLowerCase() }
            ]
        });
    
        let userIsset = false;
    
        users.forEach(user => {
            if ((user) && (user._id != userIdentity.id))
            {
                userIsset = true;
            }
        });
        
        if (userIsset)
        {
            return res.status(404).send({
                status: "error",
                message: "el usuario ya existe"
            });
        }
    }

    if (userToUpdate.password)
    {
        let pwd = await encyptedPassword(userToUpdate.password, 10);
        userToUpdate.password = pwd;
    }
    else
    {
        delete userToUpdate.password;
    }

    try
    {        
        let userUpdate = await User.findByIdAndUpdate({_id: userIdentity.id}, userToUpdate, { new: true });

        if (!userUpdate)
        {
            return res.status(400).send({
                status: "error",
                message: "Error al cargar el usuario"
            });
        }

        return res.status(200).send({
            status: "succes",
            message: "Usuario actualizado",
            user: userUpdate
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al cargar el usuario"
        });
    }
}

// 5. Subir imagen
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
        let userUpdate = await User.findOneAndUpdate({_id: req.user.id}, {profile_image: req.file.filename}, {new: true});

        return res.status(200).send({
            status: "success",
            message: "Imagen cargada",
            file: req.file,
            user: userUpdate
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

// 6. Ver imagen
const viewImage = async (req, res) => {
    let fileName, filePath;
    let id = req.user.id;

    if (req.params.id) id = req.params.id;
        
    try
    {
        let user = await User.findById(id);
        fileName = user.profile_image;
    }
    catch (error)
    {
        return res.status(404).send({
            status: "error",
            message: "Error al buscar el usuario"
        });
    }
    
    filePath = "./uploads/img_users/" + fileName;

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
        let count = (await User.find({})).length;

        if ((!count) || (count <= 0))
        {
            return res.status(200).send({
                status: "succes",
                message: "No hay usuarios registrados"
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

// <- Acciones de User

// -> Exportacion
module.exports = {
    test,
    register,
    login,
    viewProfile,
    update,
    upload,
    viewImage,
    count
}
// <- Exportacion

