import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {

  const { fullName, email, password } = req.body

  try {
    //check if the fields are empty
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Please fill all the Data" })
    }

    //check if the password is valid 
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" })
    }
    // check if the user already exists
    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ error: "User already exists" })
    }
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,

    })

    if (newUser) {
      //generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        message: "User created successfully"
      })
    } else {
      res.status(400).json({ error: "Invalid user data" })
    }

  } catch (error) {
    console.log("Error in signup function", error.message)
    res.status(500).json({ error: "Internal server error" })

  }

}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    //check if the fields are empty
    if (!email || !password) {
      return res.status(400).json({ error: "Please enter the Email and Password" })
    }
    //check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "User not found, Please signup first" })
    }
    //compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" })
    }
    //generate jwt token
    generateToken(user._id, res)

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      message: "User logged in successfully"
    })
  } catch (error) {
    console.log("Error in login function", error.message)
    res.status(500).json({ error: "Internal server error" })
  }

}

export const logout = (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
    })
    res.status(200).json({
      message: "User logged out successfully"
    })

  } catch (error) {
    console.log("Error in logout function", error.message)
    res.status(500).json({ error: "Internal server error" })
  }

  // extra practice: solve the security issues of token
}

export const updateProfile = async (req, res) => {
  try {
    // const {fullName, email , password}= req.body
    // if(!fullName || !email || !password){
    //   return res.status(400).json({error: "Please fill all the Data"})
    // }
    // const user = await User.findById(req.user._id)
    // if(!user){
    //   return res.status(404).json({error: "User not found"})
    // }
    // user.fullName = fullName
    // user.email = email
    // user.password = password
    // await user.save()
    // res.status(200).json({
    //   _id: user._id,
    //   fullName: user.fullName,
    //   email: user.email,
    //   profilePic: user.profilePic,
    //   message: "User profile updated successfully"})

    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ error: "Please provide the profile picture" })
    }

    const uploadedResponse = await cloudinary.uploader.upload(profilePic)

    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadedResponse.secure_url }, { new: true })
    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      message: "User profile picture updated successfully"
    })

  } catch (error) {
    console.log("Error in updateProfile function", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      profilePic: req.user.profilePic,
      message: "User is authenticated"
    })
  } catch (error) {
    console.log("Error in checkAuth function", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
} 



