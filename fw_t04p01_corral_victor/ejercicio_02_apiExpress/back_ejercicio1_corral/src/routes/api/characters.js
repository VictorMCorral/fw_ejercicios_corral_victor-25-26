const charactersController = require("../../controllers/characters.controller");
const router = require("express").Router();

//TODO hacer que /api/characters filtre /api/characters?page=1&limit=4;
//TODO meter autenticación para crear, actualizar y eliminar personajes (POST, PUT, DELETE)

router.get("/", charactersController.getAllCharacters);
router.post("/", charactersController.createCharacter);

// router.get("/api/characters/:id", charactersController.getCharacterById);
router.put("/:id", charactersController.updateCharacter);
router.delete("/:id", charactersController.deleteCharacter);


module.exports = router

