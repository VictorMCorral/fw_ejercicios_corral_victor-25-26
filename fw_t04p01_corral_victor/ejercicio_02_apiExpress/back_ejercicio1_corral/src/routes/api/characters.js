const charactersController = require("../../controllers/characters.controller");
const router = require("express").Router();
const { createCharacterRules, updateCharacterRules, validate } = require("../../validators/characters.validator");


router.get("/", charactersController.getAllCharacters);
router.post("/", [createCharacterRules, validate], charactersController.createCharacter);

router.get("/:id", charactersController.getCharacterById);
router.put("/:id", [updateCharacterRules, validate], charactersController.updateCharacter);
router.delete("/:id", charactersController.deleteCharacter);


module.exports = router

