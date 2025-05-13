import React, { useState } from 'react';
import { createPost } from '../../services/postService';
import Button from '../Common/Button';
import Input from '../Common/Input'; // For image URL
import Spinner from '../Common/Spinner';
import { useAuth } from '../../hooks/useAuth';

const CreatePostForm = ({ onPostCreated }) => {
  const [textContent, setTextContent] = useState('');
  const [image, setImage] = useState(''); // Input for image URL
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!textContent.trim() && !image.trim()) {
      setError('Post must have either text content or an image URL.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const postData = { textContent: textContent.trim() };
      if (image.trim()) {
        postData.image = image.trim();
      }
      const result = await createPost(postData); // result.post has the new post
      onPostCreated(result.post);
      setTextContent('');
      setImage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-brand-white p-4 sm:p-6 shadow-lg rounded-lg mb-6">
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-shadow"
        rows="3"
        placeholder={`What's on your mind, ${user?.username}?`}
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
      ></textarea>
      <Input
        type="url"
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        name="imageUrl"
        className="mb-3"
      />
      {error && <p className="text-brand-error text-sm mb-3">{error}</p>}
      <div className="text-right">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner size="sm" color="white" /> : 'Post'}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;