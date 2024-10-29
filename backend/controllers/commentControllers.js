import { Comment } from '../models/Comment.js'; // Adjust path as necessary

// Get comments for a specific song
export const getCommentsForSong = async (req, res) => {
  try {
    const comments = await Comment.find({ song: req.params.songId })
      .populate('author', 'username') // Populate author with username
      .populate('replies'); // Optionally populate replies

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

// Add a new comment to a specific song
export const addComment = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id; // Assume user is set in req.user after authentication

  if (!content || !userId) {
    return res.status(400).json({ message: 'Content and user ID are required' });
  }

  try {
    const newComment = new Comment({
      content,
      author: userId,
      song: req.params.songId,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Error posting comment' });
  }
};

// In your commentControllers.js
export const addReply = async (req, res) => {
    const { content } = req.body;
    const { commentId } = req.params;
  
    try {
      // Create a new reply comment
      const newReply = new Comment({
        content,
        author: req.user._id, // Assuming you have user ID from the request
        parentComment: commentId,
      });
  
      await newReply.save();
  
      // Update the parent comment to include the reply
      await Comment.findByIdAndUpdate(
        commentId,
        { $push: { replies: newReply._id } },
        { new: true }
      );
  
      return res.status(201).json(newReply);
    } catch (error) {
      return res.status(500).json({ message: "Error saving reply" });
    }
  };
  