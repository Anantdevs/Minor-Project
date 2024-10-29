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
    thumbnail: {
      id: String,
      url: String,
    },
    privacy: { type: String, enum: ['public', 'member'], default: 'public' },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    }, 
    
  },
  {
    timestamps: true,
  }
);

export const Album = mongoose.model("Album", schema);
