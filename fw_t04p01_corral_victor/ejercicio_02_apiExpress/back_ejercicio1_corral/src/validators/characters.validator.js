const { body, validationResult } = require('express-validator');

// Reglas para crear un personaje
const createCharacterRules = [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres'),

    body('img')
        .notEmpty().withMessage('La imagen es obligatoria')
        .isURL().withMessage('Debe ser una URL válida') //verifica que sea una URL
        .matches(/\.(jpeg|jpg|gif|png|webp|svg)$/i) // Verifica que la URL termine con una extensión de imagen válida
        .withMessage('La URL debe ser de una imagen válida (jpg, png, gif, webp, svg)'),

    body('age')
        .notEmpty().withMessage('La edad es obligatoria')
        .isInt({ min: 0 }).withMessage('La edad debe ser un número positivo'),

    body('species')
        .notEmpty().withMessage('La especie es obligatoria')
        .isString().withMessage('La especie debe ser un texto')
        .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres'),

    body('role')
        .notEmpty().withMessage('El rol es obligatorio')
        .isString().withMessage('El rol debe ser un texto')
        .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres'),

    body('specialTraits')
        .notEmpty().withMessage('Los rasgos especiales son obligatorios')
        .isArray({ min: 1, max: 3 }).withMessage('Los rasgos especiales deben ser un array de entre 1 y 3 elementos'),
];
const updateCharacterRules = [
    body('name')
        .optional()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres'),

    body('img')
        .optional()
        .notEmpty().withMessage('La imagen es obligatoria')
        .isURL().withMessage('Debe ser una URL válida') //verifica que sea una URL
        .matches(/\.(jpeg|jpg|gif|png|webp|svg)$/i) // Verifica que la URL termine con una extensión de imagen válida
        .withMessage('La URL debe ser de una imagen válida (jpg, png, gif, webp, svg)'),

    body('age')
        .optional()
        .notEmpty().withMessage('La edad es obligatoria')
        .isInt({ min: 0 }).withMessage('La edad debe ser un número positivo'),

    body('species')
        .optional()
        .notEmpty().withMessage('La especie es obligatoria')
        .isString().withMessage('La especie debe ser un texto')
        .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres'),

    body('role')
        .optional()
        .notEmpty().withMessage('El rol es obligatorio')
        .isString().withMessage('El rol debe ser un texto')
        .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres'),

    body('specialTraits')
        .optional()
        .notEmpty().withMessage('Los rasgos especiales son obligatorios')
        .isArray({ min: 1, max: 3 }).withMessage('Los rasgos especiales deben ser un array de entre 1 y 3 elementos'),
];

// Middleware que comprueba si hubo errores
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { createCharacterRules, updateCharacterRules, validate };
