const mongoose = require("mongoose");

const watchItemSchema = new mongoose.Schema({
  userId: {
    type: String, // Supabase user ID
    required: true,
  },
  tmdbId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
  },
  mediaType: {
    type: String,
    enum: ["movie", "tv", "anime", "drama"],
    required: true,
  },
  status: {
    type: String,
    enum: ["watching", "completed", "plan_to_watch", "dropped"],
    default: "plan_to_watch",
  },
  progressEpisodes: {
    type: Number,
    default: 0,
  },
  totalEpisodes: {
    type: Number,
  },
  progressMinutes: {
    type: Number,
    default: 0,
  },
  runtime: {
    type: Number,
  },
  ratingByUser: {
    type: Number,
    min: 0,
    max: 10,
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("WatchItem", watchItemSchema);
