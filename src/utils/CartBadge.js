import React, { useContext, useEffect, useState } from 'react';
import { Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Cart } from './Provider/CartContext'; 

const CartBadge = () => {
  const { cart } = useContext(Cart) || { cart: [] };
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(Array.isArray(cart) ? cart.length : 0); 
  }, [cart]);

  return (
    <Badge 
      badgeContent={count > 0 ? (count)  : null} 
      color="primary"
      invisible={count === 0} 
      sx={{
        '.MuiBadge-dot': {
          backgroundColor: '#433487', 
        },
      }}
    >
      <ShoppingCartIcon />
    </Badge>
  );
};
export default CartBadge;