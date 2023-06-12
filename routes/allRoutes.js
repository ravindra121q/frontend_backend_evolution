const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/userModel");
const router = express.Router();
const bcrypt = require("bcrypt");
const { blacklist } = require("../blacklistt/blacklist");
const { auth } = require("../middlewares/auth");
const { PostsModel } = require("../models/postsModel");

router.post("/users/register", async (req, res) => {
  const { name, email, gender, password, age, city, is_married } = req.body;
  const user_exists = await UserModel.findOne({ email });
  if (user_exists) {
    res.json({ msg: "User already exist, please login" });
  } else {
    bcrypt.hash(password, 4, async (err, hash) => {
      const user = new UserModel({
        name,
        email,
        gender,
        password: hash,
        age,
        city,
        is_married,
      });
      await user.save();
      res.json({ msg: "User Added" });
    });
  }
});

router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        var token = jwt.sign(
          { user_id: user._id },
          `${process.env.secretKey}`,
          { expiresIn: "7d" }
        );
        res.json({ msg: "Successfully Logged In", token });
      } else {
        res.json({ msg: "Wrong Data" });
      }
    });
  } else {
    res.json({ msg: "User Not Found" });
  }
});

router.post("/posts/add", auth, async (req, res) => {
  const { title, body, device, no_of_comments } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  var decoded = jwt.verify(token, `${process.env.secretKey}`);
  if (decoded) {
    const post = new PostsModel({
      title,
      body,
      device,
      no_of_comments,
      userId: decoded.user_id,
    });
    await post.save();
    res.status(200).json({ msg: "Post Added" });
  }
});

router.patch("/posts/update/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { title, body, device, no_of_comments } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  var decoded = jwt.verify(token, `${process.env.secretKey}`);
  const userPost = await PostsModel.find({ userId: decoded.id, _id: id });
  if (userPost) {
    await PostsModel.findByIdAndUpdate(id, req.body);
    res.status(200).json({ posts: "Post Updated" });
  } else {
    res.status(200).json({ msg: "User Post Not found" });
  }
});

router.delete("/posts/delete/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { title, body, device, no_of_comments } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  var decoded = jwt.verify(token, `${process.env.secretKey}`);
  const userPost = await PostsModel.find({ userId: decoded.id, _id: id });
  if (userPost) {
    await PostsModel.findByIdAndDelete(id, req.body);
    res.status(200).json({ posts: "Post Deleted" });
    return
  } else {
    res.status(200).json({ msg: "User Post Not found" });
  }
});

router.get("/posts", auth,async (req, res) => {
  
  
  const token = req.headers.authorization?.split(" ")[1];
  var decoded = jwt.verify(token, `${process.env.secretKey}`);
  var decoded = jwt.verify(token, `${process.env.secretKey}`);
  const userPost = await PostsModel.find({ userId: decoded.user_id });
  if (userPost) {
    res.status(200).json({ post: userPost });
  } else {
    res.status(200).json({ msg: "Please login in again" });
  }
});

router.get("/posts/top", auth,async (req, res) => {
  
  
  const token = req.headers.authorization?.split(" ")[1];
  var decoded = jwt.verify(token, `${process.env.secretKey}`);
  var decoded = jwt.verify(token, `${process.env.secretKey}`);
  const userPost = await PostsModel.find({ userId: decoded.user_id }).sort({no_of_comments:-1});
  if (userPost) {
    res.status(200).json({ post: userPost });
  } else {
    res.status(200).json({ msg: "Please login in again" });
  }
});

router.get("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  token.push(blacklist);
});
module.exports = { router };
