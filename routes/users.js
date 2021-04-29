const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating one
router.post("/", async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const userExist = await User.findOne({ userName: userName });

    if (userExist) {
      return res.status(422).json({ error: "User already exist" });
    }
    const user = new User({ userName: userName, password: password });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//login route
router.post("/signin", async (req, res) => {
  try {
    let token;
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const userLogin = await User.findOne({ userName: userName });
    console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();
      console.log(token);

      // res.cookie("jwtoken",token,{
      //   expires:new Date(Date.now()+25000000000),
      //   httpOnly:true
      // })

      if (!isMatch) {
        res.status(400).json({ error: "Invalid credential" });
      } else {
        res.json({ message: " Sign sucessfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid credential" });
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
