const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/promptController");
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

router.use(protect); // All prompt routes are protected

router.post("/", createPrompt);
router.post("/bulk-delete", bulkDeletePrompts);
router.post("/import", importPrompts);
router.get("/", getAllPrompts);

// Admin routes (Must be before /:id)
router.get("/admin/prompts", isAdmin, getAdminPrompts);
router.get("/admin/export", isAdmin, exportDataset);
router.patch("/admin/status/:id", isAdmin, updatePromptStatus);

router.get("/:id", getPromptById);
router.put("/:id", updatePrompt);
router.delete("/:id", deletePrompt);

// Voting route
router.post("/:id/vote", votePrompt);

module.exports = router;