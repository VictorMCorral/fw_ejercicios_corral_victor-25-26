const router = require('express').Router();
const { checkToken } = require("../middlewares/auth.middleware");

router.use('/episodes', checkToken, require('./api/episodes'));

router.use("/characters", checkToken, require("./api/characters"));

router.use("/users", require("./api/users"));

module.exports = router;
