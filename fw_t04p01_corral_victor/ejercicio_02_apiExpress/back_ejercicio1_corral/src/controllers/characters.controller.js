const moongose = require("mongoose");
const Character = require("../models/character.model");
//TODO todo esto hay que modificarlo a characters

exports.getAllCharacters = async (req, res) => {
    console.log(req.query);
    try {
        const { page = 1, limit = 10 } = req.query;
        const characters = await Character.find()
            .skip((page - 1) * limit)
            .limit(limit);
        return res.status(200).json(characters);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener los personajes",
            error: error.message
        });
    }
};

exports.createCharacter = async (req, res) => {
    try {
        const { name, img, age, species, specialTraits, role, firstAppearance } = req.body;
        const newCharacter = new Character({
            name,
            img,
            age,
            species,
            specialTraits: [
                ...specialTraits
            ],
            role,
            firstAppearance
        });
        await newCharacter.save();
        res.status(201).json(newCharacter);
    } catch (error) {
        res.status(500).json({
            message: "Error al crear el personaje",
            error: error.message
        });
    }
};

exports.updateCharacter = async (req, res) => {
    const { id } = req.params;
    const character = await Character.findById(id);
    if (!character) {
        return res.status(404).json({
            message: "Personaje no encontrado"
        });
    }
    
    try {
        character.name = req.body.name || character.name;
        character.img = req.body.img || character.img;
        character.age = req.body.age || character.age;
        character.species = req.body.species || character.species;
        character.specialTraits = req.body.specialTraits || character.specialTraits;
        character.role = req.body.role || character.role;
        character.firstAppearance = req.body.firstAppearance || character.firstAppearance;
        await character.save();
        res.status(200).json(character);
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el personaje",
            error: error.message
        });
    }
};

exports.deleteCharacter = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCharacter = await Character.findByIdAndDelete(id);
        if (!deletedCharacter) {
            return res.status(404).json({
                message: "Personaje no encontrado"
            });
        }
        res.status(200).json({
            message: "Personaje eliminado correctamente",
            character: deletedCharacter
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el personaje",
            error: error.message
        });
    }
};