import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    singer: {
      type: String,
      required: true,
    },
    thumbnail: {
      id: String,
      url: String,
    },
    audio: {
      id: String,
      url: String,
    },

    album: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] ,
    
  },
  {
    timestamps: true,
  }
);

export const Song = mongoose.model("Song", schema);
