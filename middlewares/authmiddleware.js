const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
          res.status(401);
          throw new Error("User not found");
        }

        next();
      }
    } catch (error) {
      res.status(401);
      throw new Error(
        "Not Authorized, token expired or invalid. Please login again."
      );
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, no token attached to header.");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    console.log("Admin middleware started");
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
  
    if (adminUser && adminUser.role === "admin") {
      console.log("Admin check passed");
      next();
    } else {
      res.status(403).json({ message: "You are not authorized as admin." });
    }
  });
module.exports = { authMiddleware, isAdmin };