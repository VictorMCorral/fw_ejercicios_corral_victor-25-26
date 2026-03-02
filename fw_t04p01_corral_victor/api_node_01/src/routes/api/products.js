const router = require("express").Router();
const { createProductRules, validate } = 
                               require("../../validators/product.validator");


const productsController = require("../../controllers/products.controller");

const { checkToken } = require("../../middlewares/auth.middleware");


// Públicas
router.get("/", productsController.getAllProducts);
router.get("/search", productsController.searchProducts);
router.get("/:id", productsController.getProductById);

// Privadas (requieren JWT)
router.post("/", checkToken, createProductRules, validate, productsController.createProduct);
router.put("/:id", checkToken, productsController.updateProduct);
router.delete("/:id", checkToken, productsController.deleteProduct);

module.exports = router

