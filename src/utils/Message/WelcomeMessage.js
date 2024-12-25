import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import { useAuth } from '../Provider/AuthContext';
import { useTheme } from '../Provider/ThemeContext';

const Transition = (props) => {
  return <Slide {...props} direction="down" />;
};

const WelcomeMessage = () => {
  const { theme } = useTheme(); 
  const { user } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setMessage(`Welcome back, ${user}!`);
    } else {
      setMessage('Welcome, Guest! Explore our library and find your next great read.');
    }
    setSnackbarOpen(true);
  }, [user]);

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        message={message}
        autoHideDuration={2000}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: `${theme.primaryColor}`,
            color: 'white', 
          },
        }}
      />
    </Box>
  );
};

export default WelcomeMessage;


// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { useAuth } from './AuthContext';
// import Snackbar from '@mui/material/Snackbar';
// import Box from '@mui/material/Box';

// const WelcomeMessage = () => {
//   const { user } = useAuth();
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     if (user) {
//       setMessage(`Welcome back, ${user}! Explore our library and find your next great read.`);
//     } else {
//       setMessage('Welcome, Guest! Explore our library and find your next great read.');
//     }
//     setSnackbarOpen(true);
//   }, [user]);

//   const handleClose = () => {
//     setSnackbarOpen(false);
//   };

//   return (
//     <Box sx={{ width: 500 }}>
//       <Snackbar
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//         open={snackbarOpen}
//         onClose={handleClose}
//         message={message}
//         autoHideDuration={3000}
//       />
//     </Box>
//   );
// };

// export default WelcomeMessage;


// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { useAuth } from './AuthContext';
// import ReToastContainer from './ToastContainer/CustomToast';

// const WelcomeMessage = () => {
//   const { user } = useAuth();
//   const [toaster, setToaster] = useState(false);

//   useEffect(() => {
//     setToaster(false);

//     if (user) {
//       toast.success(`Welcome back, ${user}! Explore our library and find your next great read.`, {
//         position: 'top-right',
//         autoClose: 5000,
//         theme: "colored"
//       });
//       setToaster(true);
//     } else {
//       toast.info('Welcome, Guest! Explore our library and find your next great read.', {
//         position: 'top-right',
//         theme: "colored",
//         autoClose: 5000
//       });
//       setToaster(true);
//     }

//     const timer = setTimeout(() => setToaster(false), 1000);
//     return () => clearTimeout(timer);
//   }, [user]); 

//   return (
//     <><ReToastContainer/></>
//   ); 
// };

// export default WelcomeMessage;