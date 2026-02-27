
import Message from "../models/message.model.js"
import User from "../models/user.model.js"


export const getUsersForSidebar = async (req, res) => {
    try {
        
        const loggedInUserId = req.user._id;  // coming from protectedRoute middleware

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password") // $ne means not equal , this tells mongoose to get all users except the logged in user

        res.status(200).json(filteredUsers)

    } catch (error) {
        console.error("Error in getUsersForSidebar:", error.message)
        res.status(500).json({ message: "Failed to fetch users" })
    }
}


export const getMessagesWithOtherUser = async (req, res) => {
    try {
        
        const senderId= req.user._id;
        const recieverId = req.params.id;

        const messages = await Message.find(
            {$or:[
            {senderId:senderId, recieverId:recieverId}, //my messages that the other user recieves
            {senderId:recieverId, recieverId:senderId}  //other user's messages that I recieve
            ]}
        )
        res.status(200).json(messages)
    } catch (error) {
        console.error("Error in getMessagesWithOtherUser:", error.message)
        res.status(500).json({ message: "Failed to fetch messages" })
    }
}


export const sendMessage = async (req, res) => {
    try {
        const recieverId = req.params.id;
        const {text, image} = req.body;
        const senderId = req.user._id;

        let imageUrl;

        if(image){
            const uploadedResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadedResponse.secure_url
            
        }

        const newMessage = await Message.create({
            senderId,
            recieverId,
            text,
            image:imageUrl
        })

        // real-time functionality => socket.io

        res.status(200).json(newMessage)
    } catch (error) {
        console.error("Error in sendMessage:", error.message)
        res.status(500).json({ message: "Failed to send message" })
    }
}



