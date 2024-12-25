import React, { useState } from 'react';
import location from '../../Asset/Navbar/images/location.png';
import security from '../../Asset/Navbar/images/security.png';
import box from '../../Asset/Navbar/images/box.png';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

const accountOptions = [
  {
    title: 'Orders',
    description: 'Track, return, or buy things again',
    icon: box,
  },
  {
    title: 'Login & Security',
    description: 'Edit login, name, and mobile number',
    icon: security,
  },
  {
    title: 'Your Addresses',
    description: 'Edit or add delivery locations',
    icon: location,
  },
];

const AccountSection = ({ title, description, icon, onChange }) => {
  const handleClick = () => {
    onChange(title);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="w-12 h-12 mb-2">
        <img src={icon} alt={title} className="w-full h-full object-contain" />
      </div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 text-center">{description}</p>
    </div>
  );
};

const YourAccount = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const handleSectionChange = (title) => {
    if (title === 'Orders') {
      navigate('/order_history'); 
    } else if (title === 'Login & Security'){
      alert("LoginandSecurity")
    }else {
      setActiveSection(title);
      setDialogOpen(true);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setActiveSection('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
          Your Account
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountOptions.map((option, index) => (
            <AccountSection
              key={index}
              title={option.title}
              description={option.description}
              icon={option.icon}
              onChange={handleSectionChange} 
            />
          ))}
        </div>
      </div>

      {/* Dialog Section */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-2/3 lg:w-1/3 relative">
            <button
              onClick={closeDialog}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <AiOutlineCloseCircle />
            </button>
            <h2 className="text-lg font-bold mb-4">{activeSection}</h2>
            <div className="text-sm text-gray-600">
              {activeSection === 'Orders' && (
                <p>Here you can track, return, or buy things again.</p>
              )}
              {activeSection === 'Login & Security' && (
                <p>Edit your login, name, and mobile number here.</p>
              )}
              {activeSection === 'Your Addresses' && (
                <p>Manage and add delivery locations here.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourAccount;
