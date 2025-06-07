import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/auth.model.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;
    if (!username || !fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const usernameuser = await User.findOne({ username });
    if (usernameuser) {
      return res.status(400).json({ message: "Username is already taken" });
    }
    const emailuser = await User.findOne({ email });
    if (emailuser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      username,
      fullname,
      email,
      password: hashedPassword,
    });
    // Save the user to the database
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      return res
        .status(201)
        .json({
          _id: newUser._id,
          username: newUser.username,
          fullname: newUser.fullname,
          email: newUser.email,
          followers: newUser.followers,
          following: newUser.following,
          profileImg: newUser.profileImg,
          coverImg: newUser.coverImg,
        });
    }
    else{
        res.status(400).json({ message: "User registration failed" });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async(req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({ message: "Invalid username or password" });
        }
        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        generateTokenAndSetCookie(user._id, res);
        return res.status(200).json({
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const logout = (req, res) => {
       try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logged out successfully" });
       } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Internal server error" });
       }
};

export const getMe = async (req, res) => { 
    try {
        const user=await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}
