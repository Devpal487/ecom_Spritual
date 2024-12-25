// src/components/ReToastContainer.js
import React, { useEffect } from 'react';
import { ToastContainer, toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const transitionComponents = {
    slide: Slide,
    zoom: Zoom,
    flip: Flip,
    bounce: Bounce,
};

const ReToastContainer = ({
    position = "top-right",
    theme = "light",
    autoClose = 5000,
    pauseOnHover = true,
    draggable = true,
    newestOnTop = false,
    transition = "flip",
    toasts = [], // Array of toast messages to display
}) => {
    useEffect(() => {
        toasts.forEach(({ type, message }) => {
            const TransitionComponent = transitionComponents[transition] || Flip;
            toast[type](message || "", {
                position,
                autoClose,
                pauseOnHover,
                draggable,
                newestOnTop,
                transition: TransitionComponent,
            });
        });
    }, [toasts, position, autoClose, pauseOnHover, draggable, newestOnTop, transition]);

    return (
        <ToastContainer
            position={position}
            autoClose={autoClose}
            hideProgressBar={false}
            newestOnTop={newestOnTop}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={draggable}
            pauseOnHover={pauseOnHover}
            theme={theme}
            transition={transitionComponents[transition] || Flip}
        />
    );
};

export default ReToastContainer;


// // src/components/ReToastContainer.js
// import React from 'react';
// import { ToastContainer, toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const transitionComponents = {
//     slide: Slide,
//     zoom: Zoom,
//     flip: Flip,
//     bounce: Bounce
// };

// const ReToastContainer = ({
//     position,
//     type,
//     theme,
//     autoClose,
//     pauseOnHover,
//     draggable,
//     newestOnTop,
//     message,
//     timer,
//     transition = "flip", 
// }) => {
//     const showToast = () => {
//         const TransitionComponent = transitionComponents[transition] || Flip;

//         toast[type](message || "", {
//             position: position,
//             autoClose: timer || autoClose,
//             pauseOnHover: pauseOnHover,
//             draggable: draggable,
//             newestOnTop: newestOnTop,
//         });
//     };

//     return (
//         <div>
//             <ToastContainer
//                 position={position}
//                 autoClose={timer || autoClose}
//                 hideProgressBar={false}
//                 newestOnTop={newestOnTop}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable={draggable}
//                 pauseOnHover={pauseOnHover}
//                 theme={theme}
//                 transition={transitionComponents[transition] || Flip} 
//             />
//             {/* <button onClick={showToast}>Show Toast</button> */}
//         </div>
//     );
// };

// ReToastContainer.defaultProps = {
//     position: "top-right",
//     type: "info",
//     theme: "light",
//     autoClose: 5000,
//     pauseOnHover: true,
//     draggable: true,
//     newestOnTop: false,
//     message: "Default toast message",
//     timer: 5000,
//     transition: "flip",
// };

// export default ReToastContainer;