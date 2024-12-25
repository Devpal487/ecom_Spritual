import React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { IoCloseCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'; 
import { useTheme } from './Provider/ThemeContext'; // Import the useTheme hook

export default function RightSideDrawer({ open, onClose, direction = 'right', title, content }) {
  const navigate = useNavigate(); 
  const { theme } = useTheme(); // Get the theme

  const handleFeatureCategories = (e, itemTitle) => {
    e.preventDefault(); 
    if (itemTitle) {
      navigate(`/${title}/${encodeURIComponent(itemTitle)}`);
    }
    onClose();
  };

  const list = (anchor) => (
    <Box
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : { xs: '100%', sm: 350 } }} // Responsive width
    >
      <div className={`${theme.drawerHeaderBackground} ${theme.drawerHeaderText} p-3 text-lg font-semibold flex items-center justify-between`}>
        <h1>{title}</h1>
        <div onClick={onClose}><IoCloseCircleOutline color={theme.drawerHeaderText} size="20px"/></div>
      </div>
      <div className={`grid grid-cols-2 gap-4 p-4 ${theme.drawerContentBackground} ${theme.drawerContentText}`}>
        {Array.isArray(content) ? (
          content.length === 0 ? (
            <div className="text-center py-4 text-lg font-semibold">
              No data available
            </div>
          ) : (
            content.map((item) => (
              <div 
                key={item.id} 
                className='flex flex-col items-center h-28 max-w-xs'
                onClick={(e) => handleFeatureCategories(e, item.title)}
              >
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="h-20 mb-1 hover:h-[5.5rem] cursor-pointer"
                />
               <a 
                  href="#" 
                  className='text-[13px] hover:underline hover:font-bold overflow-hidden text-ellipsis whitespace-nowrap'
                  style={{ maxWidth: '100%' }} // Ensure the link doesn't exceed its container
                >
                  {item.title}
                </a>
              </div>
            ))
          )
        ) : (
          <div className="text-center py-4 text-lg font-semibold">
            {content}
          </div>
        )}
      </div>
    </Box>
  );

  return (
    <SwipeableDrawer
      anchor={direction}
      open={open}
      onClose={onClose}
    >
      {list(direction)}
    </SwipeableDrawer>
  );
}

// import * as React from 'react';
// import Box from '@mui/material/Box';
// import SwipeableDrawer from '@mui/material/SwipeableDrawer';
// // import drawerData from '../Data/RightSideDrawerData';
// import { IoCloseCircleOutline } from "react-icons/io5";
// import { useNavigate } from 'react-router-dom'; 


// export default function RightSideDrawer({ open, onClose, onOpen, direction = 'right', title, content }) {
//   console.log("🚀 ~ RightSideDrawer ~ title:", title)
//   const navigate = useNavigate(); 

//   const handleFeatureCategories = (e, itemTitle) => {
//     console.log("🚀 ~ handleFeatureCategories ~ itemTitle:", itemTitle)
//     e.preventDefault(); 
//     if (itemTitle) {
//       navigate(`/${title}/${encodeURIComponent(itemTitle)}`);
//     }
//     onClose();
//   };
  
//   const list = (anchor) => (
//     <Box
//       role="presentation"
//       onClick={onClose}
//       onKeyDown={onClose}
//       sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 350 }}
//     >
//       <div className='bg-[#D1D5DB] text-black p-3 text-lg font-semibold flex items-center justify-between'>
//         <h1>{title}</h1>
//         <React.Fragment onClick={onClose}><IoCloseCircleOutline color='black' size="20px"/></React.Fragment>
//       </div>
//       <div
//         className= 'grid grid-cols-2 gap-4 p-4'
//       >
//         {content?.map((item) => (
//           <div key={item.id} className='flex flex-col items-center h-28' onClick={(e)=>handleFeatureCategories(e, item.title)}>
//             <img src={item.src} alt={item.title} className="h-20 mb-1 hover:h-[5.5rem] cursor-pointer" />
//             <a href="#" className='text-[13px] hover:underline hover:font-bold overflow-hidden text-ellipsis cursor-pointer' >
//               {item.title}
//             </a>
//           </div>
//         ))}
//       </div>
//     </Box>
//   );

//   return (
//     <SwipeableDrawer
//       anchor={direction}
//       open={open}
//       onClose={onClose}
//       onOpen={onOpen}
//     >
//       {list(direction)}
//     </SwipeableDrawer>
//   );
// }
