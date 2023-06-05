// routes/users.js
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const fs = require("fs");

// Update User
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    try {
      let updatedUser = req.body;

      if (req.file) {
        // If a new profile picture is uploaded
        const oldUser = await User.findById(req.params.id);
        const oldProfilePicPath = `./images/${oldUser.profilePic}`;

        // Delete the old profile picture file
        if (fs.existsSync(oldProfilePicPath)) {
          fs.unlinkSync(oldProfilePicPath);
        }

        updatedUser.profilePic = req.file.filename;
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updatedUser },
        { new: true }
      );

      const { password, ...others } = user._doc;
      return res.status(200).json(others);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("You can only update your own account");
  }
});

module.exports = router;
