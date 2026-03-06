const { body, validationResult } = require('express-validator');


const createEpisodesRules = [
    body('code')
        .notEmpty().withMessage('El código es obligatorio')
        .matches(/^S\d{2}E\d{2}$/)
        .withMessage('El formato debe ser SxxExx (ejemplo: S01E05)'),
    body('year')
        .notEmpty().withMessage('El año es obligatorio')
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('El año debe ser un número válido'),

    body('characters')
        .notEmpty().withMessage('El campo characters es obligatorio')
        .isArray({ min: 1, max: 3 }).withMessage('Debe ser un array de entre 1 y 3 personajes'),

    body('characters.*')
        .isMongoId().withMessage('Cada personaje debe ser un ID de MongoDB válido (ObjectId)'),
];
const updateEpisodesRules = [
    body('code')
        .optional()
        .notEmpty().withMessage('El código es obligatorio')
        .matches(/^S\d{2}E\d{2}$/)
        .withMessage('El formato debe ser SxxExx (ejemplo: S01E05)'),
    body('year')
        .optional()
        .notEmpty().withMessage('El año es obligatorio')
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('El año debe ser un número válido'),

    body('characters')
        .optional()
        .notEmpty().withMessage('El campo characters es obligatorio')
        .isArray({ min: 1, max: 3 }).withMessage('Debe ser un array de entre 1 y 3 personajes'),

    body('characters.*')
        .isMongoId().withMessage('Cada personaje debe ser un ID de MongoDB válido (ObjectId)'),
];

// Middleware que comprueba si hubo errores
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { createEpisodesRules, updateEpisodesRules, validate };
