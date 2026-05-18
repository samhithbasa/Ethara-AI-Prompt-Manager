const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Require Admin Role!" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error!", error: error.message });
  }
};

module.exports = isAdmin;
