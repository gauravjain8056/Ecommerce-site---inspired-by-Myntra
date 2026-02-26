const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const {
    createBuyRequest,
    getAllBuyRequests,
    getMyBuyRequests,
    updateRequestStatus,
} = require("../controllers/buyRequestController");

// Customer: submit a new buy request
router.post("/", verifyToken, requireRole("customer"), createBuyRequest);

// Customer: view their own requests
router.get("/my", verifyToken, requireRole("customer"), getMyBuyRequests);

// Seller: view all incoming requests
router.get("/", verifyToken, requireRole("seller"), getAllBuyRequests);

// Seller: update request status (approve / reject)
router.patch("/:id", verifyToken, requireRole("seller"), updateRequestStatus);

module.exports = router;
