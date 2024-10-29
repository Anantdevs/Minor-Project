import { Album } from "../models/Album.js";
import { Song } from "../models/Song.js";
import TryCatch from "../utils/TryCatch.js";
import getDataurl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";

export const createAlbum = TryCatch(async (req, res) => {
  // if (req.user.role !== "admin")
  //   return res.status(403).json({
  //     message: "You are not admin",
  //   });

  const { title, description ,privacy} = req.body;

  const file = req.file;

  if (!title || !description || !file || !privacy) {
    return res.status(400).json({
      message: "Title, description, file, and privacy are required.",
    });
  }

  const fileUrl = getDataurl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  await Album.create({
    title,
    description,
    thumbnail: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
    privacy, // Save the privacy setting
    userId: req.user._id, // Link the album to the logged-in user


  });

  res.json({
    message: "Album Added",
  });
});


export const likeSong = async (req, res) => {
  const songId = req.params.id;
  const userId = req.body.userId; // Get userId from the request body

  try {
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).send('Song not found');
    }

    // Check if the user has already liked the song
    if (song.likes.includes(userId)) {
      return res.status(400).send('You have already liked this song');
    }

    // Add userId to likes array
    song.likes.push(userId);
    await song.save();

    return res.status(200).send(song);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
export const unlikeSong=async (req, res) => {
  const { userId } = req.body; // Expect userId in the request body
  const { id } = req.params; 

  try {
    // Find the song by ID
    const song = await Song.findById(id);
    
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // Remove the user ID from the likes array if it exists
    song.likes = song.likes.filter(like => like.toString() !== userId);
    
    // Save the updated song
    await song.save();

    return res.status(200).json(song); // Return the updated song
  } catch (error) {
    console.error('Error unliking the song:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const searchSong=async (req, res) => {
  const { query } = req.query;

  try {
    const songs = await Song.find({
      title: { $regex: query, $options: 'i' } // Case-insensitive search
    });
    return res.status(200).json(songs);
  } catch (error) {
    console.error('Error searching for songs:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getUserAlbums = async (req, res) => {
  try {
    const userId = req.user._id;
    const albums = await Album.find({ userId });
    res.json(albums);
    
  } catch (error) {
    console.error(error);
    console.log("it is called with failure ");

    return res.status(500).json({ message: 'Server error' });
  }
};


export const getAllAlbums = TryCatch(async (req, res) => {
  const albums = await Album.find();
  res.json(albums);
});

export const addSong = TryCatch(async (req, res) => {
  const { title, description, singer, album } = req.body;

  const file = req.file;
  const userId = req.user._id;

  const fileUrl = getDataurl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content, {
    resource_type: "video",
  });

  await Song.create({
    title,
    description,
    singer,
    audio: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
    album,
    userId,

  });

  res.json({
    message: "Song Added",
  });
});

export const addThumbnail = TryCatch(async (req, res) => {
  // if (req.user.role !== "admin")
  //   return res.status(403).json({
  //     message: "You are not admin",
  //   });

  const file = req.file;

  const fileUrl = getDataurl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  await Song.findByIdAndUpdate(
    req.params.id,
    {
      thumbnail: {
        id: cloud.public_id,
        url: cloud.secure_url,
      },
    },
    { new: true }
  );

  res.json({
    message: "thumbnail Added",
  });
});

export const getAllSongs = TryCatch(async (req, res) => {
  const songs = await Song.find();

  res.json(songs);
});

export const getAllSongsByAlbum = TryCatch(async (req, res) => {
  const album = await Album.findById(req.params.id);
  const songs = await Song.find({ album: req.params.id });

  res.json({ album, songs });
});

export const deleteSong = TryCatch(async (req, res) => {
  const song = await Song.findById(req.params.id);

  await song.deleteOne();

  res.json({ message: "Song Deleted" });
});

export const getSingleSong = TryCatch(async (req, res) => {
  const song = await Song.findById(req.params.id);
  res.json(song);
});
