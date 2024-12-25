import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { width, height } = { width: window.innerWidth, height: window.innerHeight };
    const [bgColor, setBgColor] = useState('#f0f0f0');

    useEffect(() => {
      setBgColor('#abf7b1');

      // Handle back button navigation
      const handlePopState = (event) => {
        console.log('Popstate event triggered:', event);
        if (location.pathname === '/payment') {
          navigate('/prod-spec', { state: null }); 
        } else {
          navigate('/', { state: null }); 
        }
      };

      window.addEventListener('popstate', handlePopState);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }, [navigate, location.pathname]);
    
  return (
    <div className="relative h-[88vh] flex items-center justify-center overflow-hidden" style={{ backgroundColor: bgColor }}>
      <Confetti width={width} height={height} />
      <div className="relative z-10 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4 animate-scale-up">Congratulations!</h1>
        <p className="text-lg mb-2 animate-scale-up">Your order has been placed successfully.</p>
        <p className="text-lg mb-4 animate-scale-up">Thank you for shopping with us!</p>
        <button 
          className="mt-4 px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() =>navigate("/")}
        >
          Go to Homepage
        </button><button 
          className="ml-4 mt-4 px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() =>navigate("/order_history")}
        >
          Go to Order Details
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;