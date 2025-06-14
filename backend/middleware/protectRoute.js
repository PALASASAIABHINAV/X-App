import User from "../models/auth.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    // Check if the user is authenticaated
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, please login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const user = await User.findById(decoded.userId).select("-password"); // Exclude password from the user object
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user; // Attach the user to the request object
    // If authenticated, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
