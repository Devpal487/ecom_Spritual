import React, { useState } from 'react';
import { useTheme } from '../utils/Provider/ThemeContext';
import { validateEmail } from '../utils/validators';
import AnimationWave from '../utils/WaveAnimation/AnimationWave';

const ForgotPasswordScreen = () => {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: ''
    });

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const validateForm = () => {
        let valid = true;
        let errors = {};

        if (!validateEmail(email)) {
            errors.email = '* Valid email address is required';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return; 

        setLoading(true);
        setMessage('');

        try {
            console.log('Password reset request for:', email);

            setMessage('Password reset link has been sent to your email.');
        } catch (error) {
            console.error('Failed to request password reset:', error);
            setMessage('Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative bg-gray-100 overflow-hidden">
        
           <AnimationWave/>
        {/* ${theme.backgroundColor} ${theme.textColor}  */}
        <div className={`min-h-screen flex items-center justify-center bg-transparent relative z-10`}>
            <div className={`w-full max-w-md p-8 rounded-lg shadow-lg bg-transparent ${theme.textColor} border border-gray-300`}>
                <h2 className={`text-3xl font-bold mb-6 text-center ${theme.textColor}`}>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className={`block mb-2 ${theme.textColor}`} htmlFor="email">Email Address :  </label>
                        <input
                            id="email"
                            name="email"
                            // type="email"
                            value={email}
                            onChange={handleEmailChange}
                            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 ${theme.textColor} ${theme.fontSize}`}
                            placeholder="Enter your email address"
                            
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <button
                        type="submit"
                        className={`w-full p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 ${theme.fontSize}`}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                {message && <p className={`mt-4 text-center ${theme.textColor}`}>{message}</p>}
            </div>
        </div>
        </div>
    );
};

export default ForgotPasswordScreen;