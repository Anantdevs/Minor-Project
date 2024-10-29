import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  getCommentsForSong,
  addComment,
  addReply,
} from "../controllers/commentControllers.js"; // Make sure to create this controller

const router = express.Router();

// Get comments for a specific song
router.get("/song/:songId", isAuth, getCommentsForSong);

// Add a new comment to a specific song
router.post("/song/:songId", isAuth, addComment);

// Add a reply to a specific comment
router.post("/comment/:commentId/reply", isAuth, addReply);

export default router;
