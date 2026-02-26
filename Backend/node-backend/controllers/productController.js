const Product = require("../models/Product");

// GET /api/products — public (supports ?category=Men)
const getAllProducts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = { $regex: new RegExp(`^${req.query.category}$`, "i") };
        }
        const products = await Product.find(filter)
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });
        res.json({ products });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch products.", error: err.message });
    }
};

// GET /api/products/:id — public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("createdBy", "name email");
        if (!product) return res.status(404).json({ message: "Product not found." });
        res.json({ product });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch product.", error: err.message });
    }
};

// POST /api/products — seller only (multipart/form-data with optional image file)
const createProduct = async (req, res) => {
    try {
        const { name, description, price, originalPrice, category, stock } = req.body;
        if (!name || price === undefined)
            return res.status(400).json({ message: "Name and price are required." });

        // Image: use uploaded file path, or fallback to URL if provided in body
        let image = req.body.image || "";
        if (req.file) {
            image = `http://localhost:${process.env.PORT || 8080}/uploads/${req.file.filename}`;
        }

        const product = await Product.create({
            name,
            description,
            price,
            originalPrice: originalPrice || price,
            image,
            category,
            stock,
            createdBy: req.user.id,
        });

        res.status(201).json({ message: "Product created.", product });
    } catch (err) {
        res.status(500).json({ message: "Failed to create product.", error: err.message });
    }
};

// PUT /api/products/:id — seller only
const updateProduct = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) {
            updates.image = `http://localhost:${process.env.PORT || 8080}/uploads/${req.file.filename}`;
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );
        if (!product) return res.status(404).json({ message: "Product not found." });
        res.json({ message: "Product updated.", product });
    } catch (err) {
        res.status(500).json({ message: "Failed to update product.", error: err.message });
    }
};

// DELETE /api/products/:id — seller only
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found." });
        res.json({ message: "Product deleted." });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete product.", error: err.message });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
