const Prompt = require("../models/Prompt");

// CREATE PROMPT
const createPrompt = async (req, res) => {
  try {
    const { title, category, prompt, response, quality, tags } = req.body;

    const newPrompt = await Prompt.create({
      userId: req.user.id,
      title,
      category,
      prompt,
      response,
      quality,
      tags,
    });

    res.status(201).json({
      message: "Prompt created successfully!",
      data: newPrompt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// GET ALL PROMPTS (for logged in user)
const getAllPrompts = async (req, res) => {
  try {
    const { category, quality, search, page = 1, limit = 9 } = req.query;

    let filter = { userId: req.user.id };

    if (category) filter.category = category;
    if (quality) filter.quality = quality;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { prompt: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Prompt.countDocuments(filter);
    const prompts = await Prompt.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      count: prompts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: prompts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// BULK DELETE PROMPTS
const bulkDeletePrompts = async (req, res) => {
  try {
    const { ids } = req.body;
    await Prompt.deleteMany({ _id: { $in: ids }, userId: req.user.id });
    res.status(200).json({ message: "Prompts deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// IMPORT PROMPTS
const importPrompts = async (req, res) => {
  try {
    const { prompts } = req.body;
    const promptsWithUserId = prompts.map(p => ({
      ...p,
      userId: req.user.id,
      _id: undefined, // Let MongoDB generate new IDs
      createdAt: undefined,
      updatedAt: undefined
    }));
    await Prompt.insertMany(promptsWithUserId);
    res.status(201).json({ message: "Prompts imported successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// GET SINGLE PROMPT
const getPromptById = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found!" });
    }

    // Make sure user owns this prompt
    if (prompt.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied!" });
    }

    res.status(200).json({ data: prompt });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// UPDATE PROMPT
const updatePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found!" });
    }

    // Make sure user owns this prompt
    if (prompt.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied!" });
    }

    const updatedPrompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    );

    res.status(200).json({
      message: "Prompt updated successfully!",
      data: updatedPrompt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// DELETE PROMPT
const deletePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found!" });
    }

    // Make sure user owns this prompt
    if (prompt.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied!" });
    }

    await Prompt.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Prompt deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// GET ADMIN PROMPTS (Admin only)
const getAdminPrompts = async (req, res) => {
  try {
    const { status = "pending" } = req.query;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status!" });
    }

    const prompts = await Prompt.find({ status }).populate("userId", "name email").sort({ createdAt: -1 });
    
    const pendingCount = await Prompt.countDocuments({ status: "pending" });
    const approvedCount = await Prompt.countDocuments({ status: "approved" });
    const rejectedCount = await Prompt.countDocuments({ status: "rejected" });

    res.status(200).json({ 
      data: prompts,
      counts: { pending: pendingCount, approved: approvedCount, rejected: rejectedCount }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// UPDATE PROMPT STATUS (Admin only)
const updatePromptStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status!" });
    }

    const prompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found!" });
    }

    res.status(200).json({ message: `Prompt ${status} successfully!`, data: prompt });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// EXPORT DATASET (Admin only)
const exportDataset = async (req, res) => {
  try {
    const prompts = await Prompt.find({ status: "approved" });
    
    const jsonlData = prompts.map(p => JSON.stringify({
      prompt: p.prompt,
      response: p.response,
      category: p.category,
      quality: p.quality,
      tags: p.tags
    })).join("\n");

    res.setHeader("Content-Type", "application/x-jsonlines");
    res.setHeader("Content-Disposition", "attachment; filename=dataset.jsonl");
    res.status(200).send(jsonlData);
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// VOTE PROMPT
const votePrompt = async (req, res) => {
  try {
    const { type } = req.body;
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found!" });
    }

    const userId = req.user.id;

    prompt.upvotes = prompt.upvotes.filter(id => id.toString() !== userId);
    prompt.downvotes = prompt.downvotes.filter(id => id.toString() !== userId);

    if (type === "upvote") {
      prompt.upvotes.push(userId);
    } else if (type === "downvote") {
      prompt.downvotes.push(userId);
    }

    await prompt.save();

    res.status(200).json({ message: "Vote registered!", data: prompt });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

module.exports = {
  createPrompt,
  getAllPrompts,
  getPromptById,
  updatePrompt,
  deletePrompt,
  bulkDeletePrompts,
  importPrompts,
  getAdminPrompts,
  updatePromptStatus,
  exportDataset,
  votePrompt,
};