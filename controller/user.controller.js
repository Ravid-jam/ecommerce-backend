const cloudinary = require("../config/cloudinary");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
exports.Register = async (req, res) => {
  try {
    const { name, email, password, role, profile_pic } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        message: "Email already exists",
      });
    } else if (!name || !email || !password || !role || !profile_pic) {
      return res.status(400).send({
        message: "Name, email, password,role and profile_pic are required",
      });
    }
    const uploadImage = await cloudinary.uploader.upload(profile_pic, {
      folder: "ecommerce/profile_pics",
    });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profile_pic: {
        id: uploadImage.asset_id,
        url: uploadImage.secure_url,
      },
    });
    await newUser.save();
    res.status(201).send({
      message: "User registered successfully",
      data: newUser,
      status: true,
    });
  } catch (e) {
    return res.status(400).send({
      message: "Invalid registration data",
    });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        message: "Invalid login credentials",
      });
    }

    const token = await jwt.sign(
      { email: user.email, password: user.password, role: user.role },
      process.env.JET_SECRET_KEY,
      {
        expiresIn: "1D",
      }
    );

    res.send({
      message: "User logged in successfully",
      data: user,
      token: token,
      status: true,
    });
  } catch (e) {
    return res.status(400).send({
      message: "Invalid login credentials",
    });
  }
};
