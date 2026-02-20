import jwt from "jsonwebtoken"
import User from "../models/user.model.js"


export const protectedRoute = async (req, res, next)=>{
  try{
    //check if the token is exist
    const token = req.cookies.token

    if(!token){
      return res.status(401).json({error: "Unauthorized - No token provided"})
    }

    //verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    if(!decodedToken){
      return res.status(401).json({error: "Unauthorized - Invalid token"})  //when this will happen ??
    }

    //find the user by id
    const user = await User.findById(decodedToken.userId).select("-password")   //select every thing except the password
    
    if(!user){
      return res.status(401).json({error: "Unauthorized - User not found"})  //when this will happen ??
    }

    //attach the user to the request
    req.user = user //why ??
    next()
    
  }catch(error){
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
   console.error(error);
   res.status(500).json({ error: 'Internal server error' });
  }
}