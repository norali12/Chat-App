import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { getUsersForSidebar, getMessagesWithOtherUser, sendMessage } from "../controllers/message.controller.js";


const router = express.Router();

router.get("/users", protectedRoute, getUsersForSidebar)
router.get("/:id", protectedRoute, getMessagesWithOtherUser)
router.post("/send/:id", protectedRoute, sendMessage)
// router.put("/update/:id", protectedRoute, editMessage) //update message
// router.delete("/delete/:id", protectedRoute, deleteMessage) //delete message
// router.post("/send-schedule", protectedRoute, sendScheduleMessage) //send schedule message

//the user can send or receive documents too ??


export default router;  //why the same as user.route.js ??