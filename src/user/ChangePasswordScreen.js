import axios from 'axios';
import React, { useState } from 'react';
import { HOST_URL } from '../utils/config';
import { useNavigate } from 'react-router-dom';
import passreset from '../Asset/Login/images/changesPassword.png';

const ChangePasswordScreen = () => {
  const navigate = useNavigate();
  const [userid, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate password strength
  const isRequired = (field) => !field && 'This field is required';
  const isPasswordStrong = (password) => {
    const checks = [
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*]/.test(password),
      password.length >= 8,
    ];
    return checks.every(Boolean);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[!@#$%^&*]/.test(password)) strength += 20;
    return Math.min(strength, 100);
  };

  // Validate each field
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'userid':
        error = isRequired(value) || '';
        break;
      case 'password':
        if (isRequired(value)) {
          error = isRequired(value);
          setPasswordStrength(0);
        } else if (!isPasswordStrong(value)) {
          error = '* Password must include: ';
          if (!/[A-Z]/.test(value)) error += 'an uppercase letter, ';
          if (!/[a-z]/.test(value)) error += 'a lowercase letter, ';
          if (!/\d/.test(value)) error += 'a number, ';
          if (!/[!@#$%^&*]/.test(value)) error += 'a special character, ';
          if (value.length < 8) error += 'and be at least 8 characters long.';
          error = error.replace(/,\s*$/, '') + '.';
        } else {
          setPasswordStrength(calculatePasswordStrength(value));
        }
        break;
      case 'repeatPassword':
        error = isRequired(value) || (value !== password && '* Passwords do not match.');
        break;
      default:
        break;
    }
    return error;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const fieldsToValidate = { userid, password, repeatPassword };
    let isValid = true;
    const newErrors = {};

    for (const [name, value] of Object.entries(fieldsToValidate)) {
      const error = validateField(name, value);
      if (error) {
        isValid = false;
      }
      newErrors[name] = error;
    }

    setErrors(newErrors);

    if (!isValid) {
      setMessage('Please fix the errors before submitting.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${HOST_URL}ECommChangePass/ChangePassword`, { userid, password, repeatPassword });

      if (response.status === 200) {
        setMessage('Your password has been changed successfully!');
        navigate('/userlogin');
        // Clear form on success
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setMessage('Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error('API Error:', error);
      setMessage('Error changing password. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form fields
  const handleReset = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setPasswordStrength(0);
    setErrors({});
    setMessage('');
  };

  // Back navigation
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="flex items-center justify-evenly min-h-screen bg-[#F9DACF]">
      <div className="max-h-96 w-96 mix-blend-multiply">
        <img src={passreset} alt="passreset" />
      </div>
      <div className="w-full max-w-md p-8 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userid" className="block mb-2 text-gray-700">
              Username:
            </label>
            <input
              id="userid"
              type="text"
              value={userid}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-2 border rounded-lg ${errors.userid ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your username"
            />
            {errors.userid && <p className="text-red-500 text-sm mt-1">{errors.userid}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-gray-700">
              New Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                setPasswordStrength(calculatePasswordStrength(value));
              }}
              className={`w-full p-3 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your new password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            <div className="mt-2">
              <p>Password Strength: {passwordStrength}%</p>
              <div
                className="h-2 rounded bg-gray-300"
                style={{
                  width: `${passwordStrength}%`,
                  background: passwordStrength > 60 ? 'green' : 'red',
                }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="repeatPassword" className="block mb-2 text-gray-700">
              Confirm Password:
            </label>
            <input
              id="repeatPassword"
              type="password"
              value={repeatPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-2 border rounded-lg ${errors.repeatPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Confirm your new password"
            />
            {errors.repeatPassword && <p className="text-red-500 text-sm mt-1">{errors.repeatPassword}</p>}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className={`w-full p-2 text-white rounded-lg ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? 'saving...' : 'submit'}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full p-2 text-white rounded-lg bg-gray-400 hover:bg-gray-500"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full p-2 text-white rounded-lg bg-red-500 hover:bg-red-600"
            >
              Back
            </button>
          </div>
        </form>

        {message && (
          <p className={`text-center mt-4 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordScreen;