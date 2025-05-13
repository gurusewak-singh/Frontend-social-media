import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';
import Spinner from '../components/Common/Spinner';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await registerUser(formData);
      setSuccess(data.message + " You can now log in.");
      // Optionally redirect to login after a delay or clear form
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-brand-text-dark tracking-light text-2xl sm:text-[28px] font-bold leading-tight text-left pb-3 pt-2 sm:pt-5">
        Create an account
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        <Input
          type="text"
          name="username"
          placeholder="Username (5-15 characters)"
          value={formData.username}
          onChange={handleChange}
          error={error.toLowerCase().includes('username') ? error : null}
          label="Username"
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          error={error.toLowerCase().includes('email') ? error : null}
          label="Email"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password (min. 8 characters)"
          value={formData.password}
          onChange={handleChange}
          error={error.toLowerCase().includes('password') ? error : null}
          label="Password"
        />
        
        <div className="py-1">
          <label className="flex gap-x-3 items-center">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="h-5 w-5 rounded border-gray-400 text-brand-primary focus:ring-brand-primary"
            />
            <p className="text-brand-text-dark text-sm font-normal leading-normal">
              I agree to the SocialApp <Link to="/terms" className="underline hover:text-brand-primary">Terms of Service</Link>.
            </p>
          </label>
        </div>

        {error && <p className="text-sm text-brand-error text-center">{error}</p>}
        {success && <p className="text-sm text-green-600 text-center">{success}</p>}

        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? <Spinner size="sm" color="white" /> : 'Register'}
        </Button>
      </form>

      <p className="text-brand-text-light text-sm font-normal leading-normal py-3 text-center">
        Already have an account?{' '}
        <Link to="/login" className="underline hover:text-brand-primary font-semibold">
          Login
        </Link>
      </p>
    </>
  );
};

export default RegisterPage;