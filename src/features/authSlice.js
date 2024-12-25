// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Create the authentication slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false, // Initially, the user is not authenticated
    user: null, // Placeholder for user data (you can expand this as needed)
    role: null, // Role can be 'admin', 'user', etc.
  },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true; // Set authentication status to true
      state.user = action.payload.user; // Set user data from payload
      state.role = action.payload.role; // Set user role from payload
    },
    logout(state) {
      state.isAuthenticated = false; // Set authentication status to false
      state.user = null; // Clear user data
      state.role = null; // Clear user role
    },
  },
});

// Export the actions generated from the slice
export const { login, logout } = authSlice.actions;

// Export the reducer to be used in the store
export default authSlice.reducer;
