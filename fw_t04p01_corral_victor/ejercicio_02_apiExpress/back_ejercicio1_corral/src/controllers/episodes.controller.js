const Episodes = require("../models/episode.model");
const Characters = require("../models/character.model");
const mongoose = require("mongoose");

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
    try {
        const { code, title, summary, year, characters } = req.body;

        const existingCharacters = await Characters.find({ _id: { $in: characters } });
        if (existingCharacters.length !== characters.length) {
            return res.status(400).json({
                message: "Algunos personajes no existen en la base de datos"
            });
        }

        const newCharacter = new Episodes({
            code,
            title,
            summary,
            year,
            characters,
        });

        await newCharacter.save();
        res.status(201).json(newCharacter);
    } catch (error) {
        res.status(500).json({
            message: "Error al crear el episodio",
            error: error.message
        });
    }
};

exports.getEpisodeById = async (req, res) => {
    try {
        const { id } = req.params;
        const episode = await Episodes.findById(id);
        if (!episode) {
            return res.status(404).json({
                message: "Episodio no encontrado"
            });
        }
        return res.status(200).json(episode);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al obtener el episodio",
            error: error.message
        });
    }
}

exports.updateEpisode = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, title, summary, year, characters } = req.body;
        console.log("Characters to update:", characters);

        if (req.body.characters) {
            const existingCharacters = await Characters.find({ _id: { $in: characters } });
            console.log("Existing Characters:", existingCharacters);
            if (existingCharacters.length !== characters.length) {
                return res.status(400).json({
                    message: "Algunos personajes no existen en la base de datos"
                });
            }
        }

        const episode = await Episodes.findById(id);
        if (!episode) {
            return res.status(404).json({
                message: "Episodio no encontrado"
            });
        }
        episode.code = code || episode.code;
        episode.title = title || episode.title;
        episode.summary = summary || episode.summary;
        episode.year = year || episode.year;
        episode.characters = characters || episode.characters;
        await episode.save();
        return res.status(200).json(episode);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al actualizar el episodio",
            error: error.message
        });
    }
};

exports.deleteEpisode = async (req, res) => {
    try {
        const { id } = req.params;
        const episode = await Episodes.findById(id);
        if (!episode) {
            return res.status(404).json({
                message: "Episodio no encontrado"
            });
        }
        await episode.deleteOne();
        return res.status(200).json({
            message: "Episodio eliminado correctamente"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al eliminar el episodio",
            error: error.message
        });
    }
};

