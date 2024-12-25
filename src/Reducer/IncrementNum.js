import React from 'react';

const initialState = {
  cart: [],
};

const addToCart = (state = initialState, action) => {
  switch(action.type) {
    case "INCREMENT": {
        return state + 1;
    //   const find = state.cart.findIndex(item => item.id === action.payload.id);
    //   if (find >= 0) {
    //     const updatedCart = [...state.cart];
    //     updatedCart[find].quantity += 1;
    //     return { ...state, cart: updatedCart };
    //   } else {
    //     return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
    //   }
    }
    default:
      return state; // Ensure to return the current state for any other actions
  }
};

export default addToCart;
