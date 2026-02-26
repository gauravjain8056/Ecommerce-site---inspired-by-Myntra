const BuyRequest = require("../models/BuyRequest");

// POST /api/buy-requests — customer only
const createBuyRequest = async (req, res) => {
    try {
        const { productId, quantity, message } = req.body;
        if (!productId || !quantity)
            return res.status(400).json({ message: "Product ID and quantity are required." });

        const request = await BuyRequest.create({
            product: productId,
            customer: req.user.id,
            quantity,
            message: message || "",
        });

        // Populate for immediate response
        const populated = await request.populate([
            { path: "product", select: "name price image" },
            { path: "customer", select: "name email" },
        ]);

        res.status(201).json({ message: "Buy request submitted successfully.", request: populated });
    } catch (err) {
        res.status(500).json({ message: "Failed to submit buy request.", error: err.message });
    }
};

// GET /api/buy-requests — seller only — all requests
const getAllBuyRequests = async (req, res) => {
    try {
        const requests = await BuyRequest.find()
            .populate("product", "name price image category")
            .populate("customer", "name email")
            .sort({ createdAt: -1 });

        res.json({ requests });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch buy requests.", error: err.message });
    }
};

// GET /api/buy-requests/my — customer — their own requests
const getMyBuyRequests = async (req, res) => {
    try {
        const requests = await BuyRequest.find({ customer: req.user.id })
            .populate("product", "name price image")
            .sort({ createdAt: -1 });
        res.json({ requests });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch your requests.", error: err.message });
    }
};

// PATCH /api/buy-requests/:id — seller only — update status
const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["pending", "approved", "rejected"].includes(status))
            return res.status(400).json({ message: "Invalid status value." });

        const request = await BuyRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate("product", "name price").populate("customer", "name email");

        if (!request) return res.status(404).json({ message: "Buy request not found." });
        res.json({ message: `Request marked as ${status}.`, request });
    } catch (err) {
        res.status(500).json({ message: "Failed to update request.", error: err.message });
    }
};

module.exports = { createBuyRequest, getAllBuyRequests, getMyBuyRequests, updateRequestStatus };
