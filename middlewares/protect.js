const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model"); // Make sure this path is correct

module.exports.protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user based on the decoded email (make sure to use 'decoded' here, not 'data')
      const user = await userModel
        .findOne({ email: decoded.email })
        .select("-password"); // Exclude password from user data

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user to request object
      req.user = user;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // If no token is found in the cookies
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
