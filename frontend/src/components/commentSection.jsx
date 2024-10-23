import React, { useState } from "react";

const Comment = ({ comment, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText("");
      setShowReplyBox(false);
    }
  };

  return (
    <div className="ml-4 mb-4">
      <div className="bg-gray-700 p-2 rounded text-white">
        <p>{comment.text}</p>
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
            <Comment key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const handleReply = (parentId, text) => {
    const addReplyToComment = (commentsArray, parentId) => {
      return commentsArray.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: new Date().getTime(),
                text,
                replies: [],
              },
            ],
          };
        } else {
          return {
            ...comment,
            replies: addReplyToComment(comment.replies, parentId),
          };
        }
      });
    };

    setComments((prevComments) =>
      parentId === null
        ? [
            ...prevComments,
            { id: new Date().getTime(), text, replies: [] },
          ]
        : addReplyToComment(prevComments, parentId)
    );
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      handleReply(null, commentText);
      setCommentText("");
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
            <Comment key={comment.id} comment={comment} onReply={handleReply} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;