const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");


router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.username !== req.body.username) {
      return res.status(401).json({ error: "You can only update your own post" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found");
    }

   
    if (post.username !== req.body.username) {
      return res.status(401).json("You can only delete your own post");
    }

    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json("Post has been deleted");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});


  


// GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({ categories: { $in: [catName] } });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

module.exports = router;
