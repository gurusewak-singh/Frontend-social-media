// src/components/Profile/EditProfileForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Use the updated hook
import { editProfile as editProfileService } from '../../services/userService';
import Input from '../Common/Input';
import Button from '../Common/Button';
import Spinner from '../Common/Spinner';

const EditProfileForm = ({ onProfileUpdated, toggleEditMode }) => {
  const { user: currentUser, updateUser } = useAuth(); // Get updateUser from context
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    profilePic: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        profilePic: currentUser.profilePic || '',
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Construct the payload with only the fields that are meant to be updated.
      // The backend should also ideally handle partial updates.
      const payload = {
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        profilePic: formData.profilePic,
      };
      
      const response = await editProfileService(payload); // Service call
      updateUser(response.user); // Update user in AuthContext & localStorage

      if (onProfileUpdated) { // This prop updates ProfilePage's local state if it has one
        onProfileUpdated(response.user);
      }
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        if(toggleEditMode) toggleEditMode(false); // Close edit form
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      console.error("Edit Profile Error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <Input
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        // Backend should validate if username/email are changed to existing ones
      />
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-brand-text-dark mb-1">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows="3"
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-brand-text-dark focus:outline-0 focus:ring-0 border border-gray-300 bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary p-4 text-base font-normal leading-normal"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us a little about yourself (max 100 characters)"
        />
      </div>
      <Input
        label="Profile Picture URL"
        name="profilePic"
        type="url"
        value={formData.profilePic}
        onChange={handleChange}
        placeholder="https://example.com/image.png"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={() => toggleEditMode(false)} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner size="sm" color="white" /> : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;