import React from 'react';
import { useTheme } from './ThemeContext';

const AdminThemeSettings = () => {
  const { updateTheme } = useTheme();
  const isAdmin = true; // Replace with real admin check logic

  const handleBackgroundImageChange = (e) => {
    updateTheme({ backgroundImage: `url(${e.target.value})` });
  };

  const handleBackgroundColorChange = (e) => {
    updateTheme({ backgroundColor: e.target.value });
  };

  const handleModeChange = (e) => {
    updateTheme({ mode: e.target.value });
  };

  if (!isAdmin) return null; // Non-admin users won't see this section

  return (
    <div className="p-4">
      <h3>Admin Theme Settings</h3>
      <div className="mb-4">
        <label>Background Image URL:</label>
        <input type="text" onChange={handleBackgroundImageChange} placeholder="Enter image URL" className="border p-2" />
      </div>
      <div className="mb-4">
        <label>Background Color:</label>
        <select onChange={handleBackgroundColorChange} className="border p-2">
          <option value="bg-white">White</option>
          <option value="bg-black">Black</option>
          <option value="bg-red-500">Red</option>
          <option value="bg-blue-500">Blue</option>
        </select>
      </div>
      <div className="mb-4">
        <label>Mode (Light/Dark):</label>
        <select onChange={handleModeChange} className="border p-2">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  );
};

export default AdminThemeSettings;