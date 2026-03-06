const episodesController = require("../../controllers/episodes.controller");
const router = require("express").Router();
const { createEpisodesRules, updateEpisodesRules, validate } = require("../../validators/episodes.validator");

router.get("/", episodesController.getAllEpisodes);
router.post("/", [createEpisodesRules, validate], episodesController.createEpisode);


router.get("/:id", episodesController.getEpisodeById);
router.put("/:id", [updateEpisodesRules, validate], episodesController.updateEpisode);
router.delete("/:id", episodesController.deleteEpisode);



module.exports = router;

