const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Coding", "Math", "Science", "General", "Language", "Other"],
      default: "General",
    },
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    quality: {
      type: String,
      enum: ["Good", "Average", "Poor"],
      default: "Good",
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prompt", promptSchema);