import React, { useState } from 'react';
import Button from '../Common/Button';
import Spinner from '../Common/Spinner';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      // This function will be passed down from PostCard or its parent
      await onCommentAdded(postId, { text });
      setText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
        rows="2"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <div className="text-right mt-2">
        <Button type="submit" variant="primary" className="h-8 px-3 text-xs" disabled={loading}>
          {loading ? <Spinner size="sm" color="white" /> : 'Comment'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;