import React, { useState, useEffect } from "react";

const Comment = ({ comment, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReply(comment._id, replyText); // Use comment._id instead of comment.id
      setReplyText("");
      setShowReplyBox(false);
    }
  };

  return (
    <div className="ml-4 mb-4">
      <div className="bg-gray-700 p-2 rounded text-white">
        <p>{comment.content}</p> {/* Updated to comment.content */}
        <button
          className="text-sm text-blue-400"
          onClick={() => setShowReplyBox(!showReplyBox)}
        >
          Reply
        </button>
      </div>

      {showReplyBox && (
        <form onSubmit={handleReplySubmit} className="ml-4 mt-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="Write a reply..."
          />
          <button
            type="submit"
            className="bg-green-500 text-white rounded p-1 mt-2"
          >
            Reply
          </button>
        </form>
      )}

      {comment.replies.length > 0 && (
        <div className="ml-4 mt-2">
          {comment.replies.map((reply) => (
            <Comment key={reply._id} comment={reply} onReply={onReply} /> 
          ))}
        </div>
      )}
    </div>
  );
};

const CommentSection = ({ songId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // Fetch comments when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comment/song/${songId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you use token-based auth
          },
        });
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [songId]);

  const handleReply = async (parentId, text) => {
    try {
      const response = await fetch(`/api/comment/comment/${parentId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include auth token
        },
        body: JSON.stringify({ content: text }),
      });

      const newReply = await response.json();
      if (response.ok) {
        setComments((prevComments) => {
          const addReplyToComment = (commentsArray) => {
            return commentsArray.map((comment) => {
              if (comment._id === parentId) {
                return {
                  ...comment,
                  replies: [...comment.replies, newReply], // Add the new reply
                };
              }
              return {
                ...comment,
                replies: addReplyToComment(comment.replies),
              };
            });
          };

          return addReplyToComment(prevComments);
        });
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      try {
        const response = await fetch(`/api/comment/song/${songId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include auth token
          },
          body: JSON.stringify({ content: commentText }),
        });

        const newComment = await response.json();
        if (response.ok) {
          setComments((prevComments) => [...prevComments, newComment]); // Add the new comment
          setCommentText(""); // Clear the input field
        }
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded">
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full p-2 rounded bg-gray-900 text-white"
          placeholder="Add a comment..."
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-2 mt-2">
          Comment
        </button>
      </form>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[300px] max-h-[160px] overflow-y-auto">
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} onReply={handleReply} /> 
            /* Updated to comment._id */
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
