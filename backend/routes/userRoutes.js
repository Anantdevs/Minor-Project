import express from "express";
import {
  loginUser,
  logoutUser,
  myProfile,
  registerUser,
  saveToPlaylist,
  updateUpiId,
  getUserById
} from "../controllers/userControllers.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);
router.get("/logout", isAuth, logoutUser);
router.post("/song/:id", isAuth, saveToPlaylist);
router.put("/update-upi-id", isAuth, updateUpiId);
router.get('/:id', getUserById); 


export default router;
