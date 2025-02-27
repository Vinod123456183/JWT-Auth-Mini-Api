const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
module.exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    let salt = await bcrypt.genSaltSync(10);
    let hashedPassword = await bcrypt.hashSync(password, salt);

    user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    let token = generateToken({ email });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email || Password Wong  " });
    }

    let result = bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        let token = generateToken({ email });
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        // res.status(200).send(user);
        res.status(200).send("Login Success");
      } else {
        res.status(400).json({ message: "Email || Password Wong  " });
      }
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports.logoutUser = function (req, res) {
  res.clearCookie("token");
  res.status(200).send("Logout Success");
};

module.exports.getUserProfile = function (req, res) {
  console.log(req.user);
  res.send("Logged In User Profile");
};
