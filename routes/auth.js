const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  user.lastLogin = new Date();
  await user.save();

  res.json({
    message: "Login successful",
    token,
    lastLogin: user.lastLogin,
  });
});

router.post("/block", async (req, res) => {
  const { userIds } = req.body;
  
  try {
    await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { blocked: true } }
    );
    res.status(200).json({ message: "Users blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error blocking users", error });
  }
});

module.exports = router;