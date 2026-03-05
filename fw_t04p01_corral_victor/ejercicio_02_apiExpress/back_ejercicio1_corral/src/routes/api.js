const router = require('express').Router();

router.use('/episodes', require('./api/episodes'));

router.use("/characters", require("./api/characters"));

// router.use("/users", require("./api/users"));


// router.use("/auth", require("./api/auth"));


// Exportamos el router para poder usarlo en otros archivos
module.exports = router;
