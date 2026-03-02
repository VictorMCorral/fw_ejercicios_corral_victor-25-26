const Product = require("../models/character.model");
const mongoose = require("mongoose");

//TODO todo esto hay que modificarlo a episodes
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener los productos",
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Product.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await Product.findByIdAndDelete(id);

        res.status(200).json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // id inválido (no es ObjectId)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const product = await Product.findById(id);

        // No existe
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const products = async () => { await Product.findByDepartment("informatica"); }

const product = async () => {
    await Product.findById(id);
    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    
    const disponible = product.isInStock();
    
    res.json({
        name: product.name,
        disponible: true
    });
    
}

const searchProducts = async (req, res) => {
    try {
        //Parámetros que vienen en la URL:
        const { department, available } = req.query;

        const filter = {};

        //Añadimos las condiciones al filtro
        if (department) filter.department = department;
        if (available !== undefined) filter.available = available === "true";
        //Recuerda: En la URL todo llega como string

        const results = await Product.find(filter);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductById,
    searchProducts
};
