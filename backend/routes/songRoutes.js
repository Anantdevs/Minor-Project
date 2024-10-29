import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";
import {
  addSong,
  addThumbnail,
  createAlbum,
  deleteSong,
  getAllAlbums,
  getAllSongs,
  getAllSongsByAlbum,
  getSingleSong,
  getUserAlbums,
  likeSong,
  unlikeSong,
  searchSong
} from "../controllers/songControllers.js";

const router = express.Router();

router.post("/album/new", isAuth, uploadFile, createAlbum);
router.get('/albums', isAuth, getUserAlbums); 
router.post('/like/:id', likeSong);
router.post('/unlike/:id', unlikeSong);

router.get('/search', searchSong);


router.get("/album/all", isAuth, getAllAlbums);
router.post("/new", isAuth, uploadFile, addSong);
router.post("/:id", isAuth, uploadFile, addThumbnail);
router.get("/single/:id", isAuth, getSingleSong);
router.delete("/:id", isAuth, deleteSong);
router.get("/all", isAuth, getAllSongs);
router.get("/album/:id", isAuth, getAllSongsByAlbum);

export default router;
