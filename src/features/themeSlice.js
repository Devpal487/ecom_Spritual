import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    textColor: 'text-black',
    backgroundColor: 'bg-white', // Start with a default background color
    backgroundImage: '', 
    fontSize: 'text-base',
    fontFamily: 'font-sans',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTextColor(state, action) {
            state.textColor = action.payload;
        },
        setBackgroundColor(state, action) {
            state.backgroundColor = action.payload;
            // Clear backgroundImage if a solid color is set
            if (action.payload !== 'transparent') {
                state.backgroundImage = ''; 
            }
        },
        setBackgroundImage(state, action) {
            state.backgroundImage = action.payload;
            // Set backgroundColor to transparent when an image is used
            if (action.payload) {
                state.backgroundColor = 'transparent'; 
            }
        },
        setFontSize(state, action) {
            state.fontSize = action.payload;
        },
        setFontFamily(state, action) {
            state.fontFamily = action.payload;
        },
    },
});

export const {
    setTextColor,
    setBackgroundColor,
    setBackgroundImage,
    setFontSize,
    setFontFamily,
} = themeSlice.actions;

export default themeSlice.reducer;


// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     textColor: 'text-black',
//    backgroundColor: 'bg-white',
//     backgroundImage: '', 
//     fontSize: 'text-base',
//     fontFamily: 'font-sans',
// };

// const themeSlice = createSlice({
//     name: 'theme',
//     initialState,
//     reducers: {
//         setTextColor(state, action) {
//             state.textColor = action.payload;
//         },
//         setBackgroundColor(state, action) {
//             state.backgroundColor = action.payload;
//         },
//         setBackgroundImage(state, action) {
//             state.backgroundImage = action.payload;
//         },
//         setFontSize(state, action) {
//             state.fontSize = action.payload;
//         },
//         setFontFamily(state, action) {
//             state.fontFamily = action.payload;
//         },
//     },
// });

// export const {
//     setTextColor,
//     setBackgroundColor,
//     setBackgroundImage,
//     setFontSize,
//     setFontFamily,
// } = themeSlice.actions;

// export default themeSlice.reducer;
