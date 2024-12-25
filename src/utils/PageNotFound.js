import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './Provider/ThemeContext';
import NotFoundImage from '../Asset/PageNotFound/404-error.jpg'; // Add your 404 image path

const PageNotFound = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); 

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${theme.backgroundColor} ${theme.textColor} p-4`}>
      <img 
        src={NotFoundImage} 
        alt="Page Not Found" 
        className="w-3/4 md:w-1/2 lg:w-1/3 max-w-lg"
      />
      <h1 className={`text-4xl font-bold mt-4 ${theme.textColor}`}>404</h1>
      <p className={`text-lg mt-2 ${theme.textColor}`}>Oops! The page you're looking for doesn't exist.</p>
      <button 
        onClick={handleGoHome} 
        className={`mt-4 ${theme.primaryColor} text-white py-2 px-4 rounded hover:bg-opacity-80`}
      >
        Go to Home
      </button>
    </div>
  );
};

export default PageNotFound;
