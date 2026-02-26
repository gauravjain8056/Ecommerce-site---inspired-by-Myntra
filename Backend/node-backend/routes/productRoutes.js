const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

// Multer storage config — save to /uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        cb(ext && mime ? null : new Error("Only image files allowed"), ext && mime);
    },
});

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Seller-only routes (with optional image upload)
router.post("/", verifyToken, requireRole("seller"), upload.single("image"), createProduct);
router.put("/:id", verifyToken, requireRole("seller"), upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, requireRole("seller"), deleteProduct);

module.exports = router;
