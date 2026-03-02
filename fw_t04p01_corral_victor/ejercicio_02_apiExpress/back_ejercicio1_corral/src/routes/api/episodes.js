const episodesController = require("../../controllers/episodes.controller");
const router = require("express").Router();

//TODO hacer que /api/episodes filtre /api/episodes?season=1;

//TODO meter autenticación para crear, actualizar y eliminar episodes (POST, PUT, DELETE)



router.get("/api/episodes", episodesController.getEpisodes);
router.post("/api/episodes", episodesController.createEpisode);

router.get("/api/episodes/:id", episodesController.getEpisodeById);
router.put("/api/episodes/:id", episodesController.updateEpisode);
router.delete("/api/episodes/:id", episodesController.deleteEpisode);



module.exports = router;

