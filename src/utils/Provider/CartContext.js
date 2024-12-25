import React, { createContext, useEffect, useState } from 'react';
import { getAddtoCart, getCommDigitalContent, getWishlistData } from '../APIURL';
import useUnmeCookie from '../useUnmeCookie';
import { previewpath } from '../config';

export const Cart = createContext();

const CartProvider = ({ children }) => {
  const unmeValue = localStorage.getItem('userid');
  const unqiueId = localStorage.getItem('unqiueId');

  const [cart, setCart] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState(null);
  const [processedIds, setProcessedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch wishlist data when unqiueId changes
  useEffect(() => {
    if (unqiueId) {
      fetchWishlistData();
    }
  }, [unqiueId]);

  // Fetch cart data when unmeValue changes
  useEffect(() => {
    if (unmeValue) {
      setLoading(true);
      fetchGetAddToCartData(unmeValue);
    }
  }, [unmeValue]);

  // Fetch wishlist data
  const fetchWishlistData = async () => {
    try {
      const data = await getWishlistData(unqiueId);
      if (data?.data?.length > 0) {
        const wishlistMapping = data.data.reduce((acc, item) => {
          acc[item.digitalContentId] = item.id;
          return acc;
        }, {});

        const digitalContentIds = [...new Set(data.data.map(item => item.digitalContentId))];
        const unprocessedIds = digitalContentIds.filter(id => !processedIds.has(id));

        await Promise.all(
          unprocessedIds.map(async (id) => {
            try {
              await fetchAndStoreDataById(id, wishlistMapping[id]);
              setProcessedIds(prevIds => new Set([...prevIds, id]));
            } catch (error) {
              console.error(`Error fetching data for digitalContentId ${id}:`, error);
            }
          })
        );
      } else {
        setError("To check wishlist items, you need to log in.");
      }
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      setError("Unable to fetch wishlist data. Please try again later.");
    }
  };

  // Fetch and store data for a specific digitalContentId
  const fetchAndStoreDataById = async (digitalContentId, wishlistId) => {
    try {
      const response = await getCommDigitalContent(digitalContentId, -1, 0);
      if (response?.data) {
        const enrichedData = response.data.map(item => ({
          ...item,
          wishlistId,
        }));

        setWishlistItems(prevItems => {
          const newItems = enrichedData.filter(
            newItem => !prevItems.some(item => item.id === newItem.id)
          );
          return [...prevItems, ...newItems];
        });
      }
    } catch (error) {
      console.error(`Error fetching and storing data for digitalContentId ${digitalContentId}:`, error);
    }
  };

  // Fetch cart data
  const fetchGetAddToCartData = async (unmeValue) => {
    setLoading(true);
    try {
      const response = await getAddtoCart(unmeValue);
      if (Array.isArray(response.data) && response.data.length > 0) {
        const filteredData = response.data.filter(item => {
          const thumbnail = item.thumbnail || '';
          return thumbnail && !thumbnail.toLowerCase().endsWith('.pdf');
        });

        const updatedBooks = filteredData.map(book => ({
          ...book,
          thumbnail: book.thumbnail ? `${previewpath}${book.thumbnail}` : '',
        }));
        setCart(updatedBooks);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Cart.Provider value={{ cart, setCart, wishlistItems, setWishlistItems, error, loading }}>
      {children}
    </Cart.Provider>
  );
};

export default CartProvider;