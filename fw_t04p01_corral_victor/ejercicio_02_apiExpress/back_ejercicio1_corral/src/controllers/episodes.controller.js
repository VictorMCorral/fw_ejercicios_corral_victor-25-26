const Episodes = require("../models/episode.model");
const mongoose = require("mongoose");

//TODO todo esto hay que modificarlo a episodes
exports.getAllEpisodes = async (req, res) => {
    try {
        const season = parseInt(req.query.season);
        let filtro = {};
        console.log("Season:", season);

        if (season || !isNaN(season)) {
            filtro = { code: { $regex: `S${season.toString().padStart(2, '0')}` } };
        }

        const episodes = await Episodes.find(filtro);

        return res.status(200).json({
            Episodes: episodes
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al obtener los episodios",
            error: error.message
        });
    }
};

exports.createEpisode = async (req, res) => {
    // try {
    //     const { name, img, age, species, specialTraits, role, firstAppearance } = req.body;
    //     const newCharacter = new Character({
    //         name,
    //         img,
    //         age,
    //         species,
    //         specialTraits: [
    //             ...specialTraits
    //         ],
    //         role,
    //         firstAppearance
    //     });

    //     await newCharacter.save();
    //     res.status(201).json(newCharacter);
    // } catch (error) {
    //     res.status(500).json({
    //         message: "Error al crear el personaje",
    //         error: error.message
    //     });
    // }
};

exports.getEpisodeById = async (req, res) => {
}

exports.updateEpisode = async (req, res) => {

};

exports.deleteEpisode = async (req, res) => {

};

