import React from 'react';
import { Link } from 'react-router-dom';

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return <p className="text-sm text-gray-500 mt-2">No comments yet.</p>;
  }

  return (
    <div className="mt-4 space-y-3">
      {comments.map((comment) => (
        <div key={comment._id || comment.createdAt} className="p-2 bg-gray-50 rounded-md">
          <div className="flex items-center text-xs mb-1">
            <Link to={`/profile/${comment.userId?._id}`} className="font-semibold text-brand-text-dark hover:underline">
              {comment.userId?.username || 'User'}
            </Link>
            <span className="text-gray-400 ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-700">{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;