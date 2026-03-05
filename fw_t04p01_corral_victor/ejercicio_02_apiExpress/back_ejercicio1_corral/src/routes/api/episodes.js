const episodesController = require("../../controllers/episodes.controller");
const router = require("express").Router();

//TODO hacer que /api/episodes filtre /api/episodes?season=1;

//TODO meter autenticación para crear, actualizar y eliminar episodes (POST, PUT, DELETE)



router.get("/", episodesController.getAllEpisodes);
router.post("/", episodesController.createEpisode);

router.get("/:id", episodesController.getEpisodeById);
router.put("/:id", episodesController.updateEpisode);
router.delete("/:id", episodesController.deleteEpisode);



module.exports = router;

