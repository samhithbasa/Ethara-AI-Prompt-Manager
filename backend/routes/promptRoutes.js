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
  getPendingPrompts,
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
router.get("/:id", getPromptById);
router.put("/:id", updatePrompt);
router.delete("/:id", deletePrompt);

// Admin routes
router.get("/admin/pending", isAdmin, getPendingPrompts);
router.patch("/admin/status/:id", isAdmin, updatePromptStatus);
router.get("/admin/export", isAdmin, exportDataset);

// Voting route
router.post("/:id/vote", votePrompt);

module.exports = router;