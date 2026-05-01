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
} = require("../controllers/promptController");
const protect = require("../middleware/authMiddleware");

router.use(protect); // All prompt routes are protected

router.post("/", createPrompt);
router.post("/bulk-delete", bulkDeletePrompts);
router.post("/import", importPrompts);
router.get("/", getAllPrompts);
router.get("/:id", getPromptById);
router.put("/:id", updatePrompt);
router.delete("/:id", deletePrompt);

module.exports = router;