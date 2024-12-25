
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTextColor,
  setBackgroundColor,
  setFontSize,
  setFontFamily,
  setBackgroundImage,
} from '../features/themeSlice';
import { AddUpdateThemeMaster } from './APIURL';
import NotificationSnackbar from './NotificationSnackbar';

const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const [uploadedImages, setUploadedImages] = useState('');
  const [colorPalette] = useState([
    '#FFFFFF', '#F8F9FA', '#343A40', '#FFC107', '#28A745', '#007BFF', '#DC3545', '#6F42C1', '#FBB917', '#ff9800',
  ]);
  const [fontSizePx, setFontSizePx] = useState(16); 
  const [userId, setUserId] = useState('');
  const [themeName, setThemeName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [navbarColor, setNavbarColor] = useState('#343A40'); // Default navbar color
  const [navbarTextColor, setNavbarTextColor] = useState('#FFFFFF');  // Default navbar text color
  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48];

  useEffect(()=>{
    setUserId(localStorage.getItem('unqiueId'))
  },[])

  const handleTextColorChange = (e) => {
    dispatch(setTextColor(e.target.value));
  };

  const handleFontSizeChange = (e) => {
    const newSize = e.target.value;
    setFontSizePx(newSize);
    dispatch(setFontSize(`text-[${newSize}px]`)); 
  };

  const handleFontFamilyChange = (e) => {
    dispatch(setFontFamily(e.target.value));
  };

  // const handleBackgroundImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   const images = files.map((file) => URL.createObjectURL(file));
  //   setUploadedImages([...uploadedImages, ...images]);
  // };

  const setBackgroundImageForTheme = (image) => {
    dispatch(setBackgroundImage(image));
    dispatch(setBackgroundColor('transparent')); 
  };


  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(reader.result); 
        dispatch(setBackgroundImage(reader.result));
        dispatch(setBackgroundColor('transparent')); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundColorChange = (color) => {
    dispatch(setBackgroundColor(color));
    dispatch(setBackgroundImage('')); 
  };

  const handleSubmit =async(e)=>{
    e.preventDefault();
    const collectData = {
      themeId: -1, 
      themeName: themeName,
      fontFamily: theme.fontFamily,
      textColor: theme.textColor,
      fontSize: fontSizePx.toString(),
      navbarColor: navbarColor,
      navbarTextColor: navbarTextColor, 
      isActive: true,
      backgroundImage: theme.backgroundImage || "",
      backgroundColor: theme.backgroundColor || ""
    };
    const result = await AddUpdateThemeMaster(collectData, userId)
    console.log("🚀 ~ handleSubmit ~ result:", result)
    if(result.isSuccess){
      setSnackbarMessage(result.mesg);
      setSnackbarSeverity('success');
    }else{
      setSnackbarMessage(result.mesg);
      setSnackbarSeverity('error');
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div
      className={`min-h-screen p-6 flex flex-col items-center justify-center bg-gray-900 text-white`}
      // style={{
      //   backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none',
      //   backgroundColor: theme.backgroundColor,
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      // }}
    >
      {/* Title */}
      <h3 className="text-xl font-semibold mb-6">Theme Control</h3>

      <form onSubmit={handleSubmit}>

      <div className="bg-gray-800 w-full max-w-4xl p-6 rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Theme Name"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            className="border p-2 rounded w-full mb-4 text-black"
          />

           {/* Navbar Color */}
           <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Navbar Color</h4>
            <input
              type="color"
              value={navbarColor}
              onChange={(e) => setNavbarColor(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded"
            />
          </div>

          {/* Navbar Text Color */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Navbar Text Color</h4>
            <input
              type="color"
              value={navbarTextColor}
              onChange={(e) => setNavbarTextColor(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded"
            />
          </div>

                 {/* Color Palette */}
                 <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Choose a Background Color</h4>

            <input
                type="color"
                value={theme.backgroundColor}
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded"
              />
        </div>


        <div className="flex justify-between mb-6">
          <div className="w-3/4 h-48 bg-black rounded-lg flex items-center justify-center">
            {theme.backgroundImage ? (
              <img
                src={theme.backgroundImage}
                alt="Background Preview"
                className="object-cover w-full h-full rounded-lg"
              />
            ) : (
              <p className="text-lg">Background Preview</p>
            )}
          </div>
        </div>

        {/* Recent Images */}
        {/* <div className="mb-6">
         <h4 className="text-lg font-semibold mb-2">Recent Images</h4> 
          <div className="flex space-x-4">
            {uploadedImages.map((image, idx) => (
              <div
                key={idx}
                className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => setBackgroundImageForTheme(image)}
              >
                <img src={image} alt={`Recent ${idx}`} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </div> */}

      

        {/* Upload Background Image */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Upload Background Image</h4>
          <input
            type="file"
            accept="image/*"
            // multiple
            className="border p-2 rounded w-full"
            onChange={handleBackgroundImageChange}
          />
        </div>

        {/* Text Settings */}
        <div className="flex space-x-4 mb-6">
          <div className="w-1/3">
            <h4 className="text-lg font-semibold mb-2">Text Color</h4>
            <select
              onChange={handleTextColorChange}
              className="border p-2 rounded w-full text-black bg-white"
              value={theme.textColor}
            >
              <option value="text-black">Black</option>
              <option value="text-white">White</option>
              <option value="text-red-500">Red</option>
              <option value="text-green-500">Green</option>
              <option value="text-blue-500">Blue</option>
              <option value="text-gray-800">Dark Gray</option>
              <option value="text-gray-200">Light Gray</option>
            </select>
          </div>

          {/* Font Size Progress Bar */}
          <div className="w-full md:w-1/3 mb-4">
  <h4 className="text-lg font-semibold mb-2">Font Size</h4>
  <select
    value={fontSizePx}
    onChange={(e) => {
      const newSize = Number(e.target.value);
      setFontSizePx(newSize);
      dispatch(setFontSize(`text-[${newSize}px]`)); 
    }}
    className="border border-gray-300 p-2 rounded w-full text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {fontSizes.map((size) => (
      <option key={size} value={size}>
        {size}px
      </option>
    ))}
  </select>
  {/* <div className="mt-2 text-gray-300">Current Size: {fontSizePx}px</div> */}
</div>

          {/* Font Family */}
          <div className="w-1/3">
            <h4 className="text-lg font-semibold mb-2">Font Family</h4>
            <select
              onChange={handleFontFamilyChange}
              className="border p-2 rounded w-full text-black bg-white"
              value={theme.fontFamily}
            >
              <option value="font-sans">Sans</option>
              <option value="font-serif">Serif</option>
              <option value="font-sans-serif">sans-serif</option>
              <option value="font-courier">courier</option>
              <option value="font-times">times</option>
              <option value="font-cursive">cursive</option>
              <option value="font-fantasy">fantasy</option>
              <option value="font-monospace">monospace</option>
            </select>
          </div>
        </div>

            <button type='submit' className="bg-blue-600 text-white py-2 px-4 rounded" >Save</button>

      </div>
      </form>
      <NotificationSnackbar
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default ThemeSwitcher;



// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   setTextColor,
//   setBackgroundColor,
//   setFontSize,
//   setFontFamily,
//   setBackgroundImage,
// } from '../features/themeSlice';

// const ThemeSwitcher = () => {
//   const dispatch = useDispatch();
//   const theme = useSelector((state) => state.theme);
//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [colorPalette] = useState([
//     '#FFFFFF', '#F8F9FA', '#343A40', '#FFC107', '#28A745', '#007BFF', '#DC3545', '#6F42C1',
//   ]);

//   const handleTextColorChange = (e) => {
//     dispatch(setTextColor(e.target.value));
//   };

//   const handleFontSizeChange = (e) => {
//     dispatch(setFontSize(e.target.value));
//   };

//   const handleFontFamilyChange = (e) => {
//     dispatch(setFontFamily(e.target.value));
//   };

//   const handleBackgroundImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const images = files.map((file) => URL.createObjectURL(file));
//     setUploadedImages([...uploadedImages, ...images]);
//   };

//   const setBackgroundImageForTheme = (image) => {
//     dispatch(setBackgroundImage(image));
//     dispatch(setBackgroundColor('')); // Reset background color when setting image
//   };

//   const handleBackgroundColorChange = (color) => {
//     dispatch(setBackgroundColor(color));
//     dispatch(setBackgroundImage('')); // Reset background image when setting color
//   };

//   return (
//     <div
//       className={`min-h-screen p-6 flex flex-col items-center justify-center bg-gray-900 text-white`}
//       style={{
//         backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none',
//         backgroundColor: theme.backgroundColor,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//       }}
//     >
//       {/* Title */}
//       <h3 className="text-3xl font-semibold mb-6">Personalization &gt; Background</h3>

//       <div className="bg-gray-800 w-full max-w-4xl p-6 rounded-lg shadow-lg">
//         {/* Preview Section */}
//         <div className="flex justify-between mb-6">
//           <div className="w-3/4 h-48 bg-black rounded-lg flex items-center justify-center">
//             {/* Mock background preview */}
//             {theme.backgroundImage ? (
//               <img
//                 src={theme.backgroundImage}
//                 alt="Background Preview"
//                 className="object-cover w-full h-full rounded-lg"
//               />
//             ) : (
//               <p className="text-lg">Background Preview</p>
//             )}
//           </div>
//         </div>

//         {/* Recent Images */}
//         <div className="mb-6">
//           <h4 className="text-lg font-semibold mb-2">Recent Images</h4>
//           <div className="flex space-x-4">
//             {uploadedImages.map((image, idx) => (
//               <div
//                 key={idx}
//                 className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center overflow-hidden cursor-pointer"
//                 onClick={() => setBackgroundImageForTheme(image)}
//               >
//                 <img src={image} alt={`Recent ${idx}`} className="object-cover w-full h-full" />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Color Palette */}
//         <div className="mb-6">
//           <h4 className="text-lg font-semibold mb-2">Choose a Background Color</h4>
//           <div className="flex space-x-2">
//             {colorPalette.map((color, idx) => (
//               <div
//                 key={idx}
//                 className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
//                 style={{ backgroundColor: color }}
//                 onClick={() => handleBackgroundColorChange(color)}
//               ></div>
//             ))}
//           </div>
//         </div>

//         {/* Upload Background Image */}
//         <div className="mb-4">
//           <h4 className="text-lg font-semibold mb-2">Upload Background Image</h4>
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             className="border p-2 rounded w-full"
//             onChange={handleBackgroundImageChange}
//           />
//         </div>

//         {/* Text Settings */}
//         <div className="flex space-x-4 mb-6">
//           {/* Text Color */}
//           <div className="w-1/3">
//             <h4 className="text-lg font-semibold mb-2">Text Color</h4>
//             <select
//               onChange={handleTextColorChange}
//               className="border p-2 rounded w-full"
//               value={theme.textColor}
//             >
//               <option value="text-black">Black</option>
//               <option value="text-white">White</option>
//               <option value="text-red-500">Red</option>
//               <option value="text-green-500">Green</option>
//               <option value="text-blue-500">Blue</option>
//               <option value="text-gray-800">Dark Gray</option>
//               <option value="text-gray-200">Light Gray</option>
//             </select>
//           </div>

//           {/* Font Size */}
//           <div className="w-1/3">
//             <h4 className="text-lg font-semibold mb-2">Text Size</h4>
//             <select
//               onChange={handleFontSizeChange}
//               className="border p-2 rounded w-full"
//               value={theme.fontSize}
//             >
//               <option value="text-xs">Small</option>
//               <option value="text-base">Medium</option>
//               <option value="text-lg">Large</option>
//               <option value="text-xl">Extra Large</option>
//             </select>
//           </div>

//           {/* Font Family */}
//           <div className="w-1/3">
//             <h4 className="text-lg font-semibold mb-2">Font Family</h4>
//             <select
//               onChange={handleFontFamilyChange}
//               className="border p-2 rounded w-full"
//               value={theme.fontFamily}
//             >
//               <option value="font-sans">Sans</option>
//               <option value="font-serif">Serif</option>
//               <option value="font-mono">Monospace</option>
//             </select>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ThemeSwitcher;