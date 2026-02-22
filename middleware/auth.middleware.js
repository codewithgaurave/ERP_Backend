 import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user || !req.user.status) {
      return res.status(401).json({ success: false, message: "User not found or inactive" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
