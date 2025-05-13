import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../services/authService';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';
import Spinner from '../components/Common/Spinner';

// Placeholder Icons
const AppleLogo = () => <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M223.3,169.59a8.07,8.07,0,0,0-2.8-3.4C203.53,154.53,200,134.64,200,120c0-17.67,13.47-33.06,21.5-40.67a8,8,0,0,0,0-11.62C208.82,55.74,187.82,48,168,48a72.2,72.2,0,0,0-40,12.13,71.56,71.56,0,0,0-90.71,9.09A74.63,74.63,0,0,0,16,123.4a127.06,127.06,0,0,0,40.14,89.73A39.8,39.8,0,0,0,83.59,224h87.68a39.84,39.84,0,0,0,29.12-12.57,125,125,0,0,0,17.82-24.6C225.23,174,224.33,172,223.3,169.59Zm-34.63,30.94a23.76,23.76,0,0,1-17.4,7.47H83.59a23.82,23.82,0,0,1-16.44-6.51A111.14,111.14,0,0,1,32,123,58.5,58.5,0,0,1,48.65,80.47,54.81,54.81,0,0,1,88,64h.78A55.45,55.45,0,0,1,123,76.28a8,8,0,0,0,10,0A55.44,55.44,0,0,1,168,64a70.64,70.64,0,0,1,36,10.35c-13,14.52-20,30.47-20,45.65,0,23.77,7.64,42.73,22.18,55.3A105.82,105.82,0,0,1,188.67,200.53ZM128.23,30A40,40,0,0,1,167,0h1a8,8,0,0,1,0,16h-1a24,24,0,0,0-23.24,18,8,8,0,1,1-15.5-4Z"></path></svg>;
const FacebookLogo = () => <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"></path></svg>;


const LoginPage = () => {
  const [formData, setFormData] = useState({ emailOrUsername: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(formData);
      login(data); // data should be { token, user }
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-brand-text-dark tracking-light text-2xl sm:text-[28px] font-bold leading-tight text-center pb-3 pt-2 sm:pt-5">
        Log in to SocialApp
      </h2>
      {/* Social Login Buttons - Non-functional for now */}
      <div className="flex flex-col gap-3 py-3">
        <Button variant="primary" className="gap-2 pl-4" fullWidth onClick={() => alert('Apple Login not implemented')}>
          <AppleLogo /> Continue with Apple
        </Button>
        <Button variant="primary" className="gap-2 pl-4" fullWidth onClick={() => alert('Facebook Login not implemented')}>
          <FacebookLogo /> Continue with Facebook
        </Button>
      </div>

      <p className="text-brand-text-light text-sm font-normal leading-normal py-3 text-center">OR</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="text"
          name="emailOrUsername"
          placeholder="Email or Username"
          value={formData.emailOrUsername}
          onChange={handleChange}
          error={error.toLowerCase().includes('user not found') || error.toLowerCase().includes('email') || error.toLowerCase().includes('username') ? error : null}
          label="Email or Username"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          error={error.toLowerCase().includes('credentials') || error.toLowerCase().includes('password') ? error : null}
          label="Password"
        />
        {error && !error.toLowerCase().includes('user not found') && !error.toLowerCase().includes('credentials') && !error.toLowerCase().includes('email') && !error.toLowerCase().includes('username') && !error.toLowerCase().includes('password') && (
            <p className="text-sm text-brand-error text-center">{error}</p>
        )}
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? <Spinner size="sm" color="white" /> : 'Log in'}
        </Button>
      </form>

      <p className="text-brand-text-light text-sm font-normal leading-normal py-3 text-center">
        <Link to="/forgot-password" /* Implement later */ className="underline hover:text-brand-primary">
          Forgot Password?
        </Link>
      </p>
      <p className="text-brand-text-light text-sm font-normal leading-normal pt-1 pb-3 text-center">
        New to SocialApp?{' '}
        <Link to="/register" className="underline hover:text-brand-primary font-semibold">
          Sign up now.
        </Link>
      </p>
    </>
  );
};

export default LoginPage;