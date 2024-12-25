import React, { createContext, useEffect, useState } from 'react';
import { getCommDigitalContent, getWishlistData } from './APIURL';


export const WishList = createContext();

const WishListProvider = ({ children }) => {
    const unmeValue = localStorage.getItem('userid');
    const unqiueId = localStorage.getItem('unqiueId');
    const [wishlistItems, setWishlistItems] = useState([]);
    const [error, setError] = useState(null);
    const [processedIds, setProcessedIds] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            if (unqiueId != '') {
                fetchWishlistData();
            }
        }, 1000);
    }, [unqiueId]);


    const fetchWishlistData = async () => {
        try {
            const data = await getWishlistData(unqiueId);
            console.log("🚀 ~ fetchWishlistData ~ data:", data);

            if (data?.data?.length > 0) {
                const digitalContentIds = [...new Set(data.data.map(item => item.digitalContentId))];

                for (const id of digitalContentIds) {
                    if (!processedIds.has(id)) {
                        await fetchAndStoreDataById(id);
                        setProcessedIds(prevIds => new Set(prevIds).add(id));
                    }
                }
            } else {
                setError("For Check wishlist items, you need to do login.");
            }
        } catch (error) {
            setError("For Check wishlist items, you need to do login.");
        }
    };

    const fetchAndStoreDataById = async (id) => {
        try {
          const response = await getCommDigitalContent(id, -1, 0);
          const result = response;
    
          if (result?.data) {
            setWishlistItems(prevItems => [...prevItems, ...result.data]);
          }
        } catch (error) {
        }
      };

    return (
        <WishList.Provider value={{ wishlistItems, setWishlistItems }}>
            {children}
        </WishList.Provider>
    );
};

export default WishListProvider; 