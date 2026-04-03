const express = require("express");
const router = express.Router();
const WatchItem = require("../models/WatchItem");

// Middleware to get userId from header (Supabase)
const getUserId = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Missing user ID" });
  }
  req.userId = userId;
  next();
};

router.use(getUserId);

// Get all watch items for a user
router.get("/", async (req, res) => {
  try {
    const items = await WatchItem.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new watch item
router.post("/add", async (req, res) => {
  try {
    const existing = await WatchItem.findOne({ userId: req.userId, tmdbId: req.body.tmdbId });
    if (existing) {
      return res.status(400).json({ error: "Item already in watchlist" });
    }
    const newItem = new WatchItem({ ...req.body, userId: req.userId });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a watch item
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await WatchItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Item not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a watch item
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await WatchItem.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
