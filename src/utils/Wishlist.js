import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveWishListData } from './APIURL';
import { useTheme } from './Provider/ThemeContext';
import { MdDelete } from "react-icons/md";
import notfound from '../Asset/WishList/no-data-found.png'
import Loading from './Loader/Loading';
import { previewpath } from './config';
import { Cart } from './Provider/CartContext'; 
import { useAuth } from './Provider/AuthContext'; 
import NotificationSnackbar from './NotificationSnackbar';

const Wishlist = () => {
  let navigate = useNavigate();
  const {wishlistItems, setWishlistItems} =useContext(Cart);
  // console.log("🚀 ~ Wishlist ~ wishlistItems:", wishlistItems)
  const { theme } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const unmeValue =  localStorage.getItem('unqiueId');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');


  useEffect(() => {

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleRemove = async (book) => {
    const existingItemIndex = wishlistItems.findIndex(item => item.id === book.id);
    // console.log("🚀 ~ handleRemove ~ existingItemIndex:", existingItemIndex)
    
    // Prepare the data to be sent to the API
    const collectData = {
      "digitalFileId": book.id,
    };
    
    // Call the API to remove the item from the wishlist
    const res = await saveWishListData(unmeValue, collectData);
    console.log("🚀 ~ handleRemove ~ res:", res);
    
    if (res.isSuccess) {
      // If successful, filter out the removed item from wishlistItems
      const updatedWishlist = wishlistItems.filter(item => item.id !== book.id);
      console.log('updatedWishlist',updatedWishlist)
      setWishlistItems(updatedWishlist); // Update the wishlist state
      
      setSnackbarMessage(`${book.title} removed from wishlist`);
      setSnackbarSeverity('success');
    } else {
      setSnackbarMessage(res.mesg);
      setSnackbarSeverity('error');
    }
    
    setSnackbarOpen(true);
  };
  
  const getMovementProductDisplay = (item) => {
    console.log("🚀 ~ getMovementProductDisplay ~ item:", item);
    
    if (!item || !item.title || !item.id) {
      return; 
    }

    let path = `/${item.title}/${item.id}`;
    console.log("🚀 ~ getMovementProductDisplay ~ path :", path);
    navigate(path, { state: { item } });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  return (
    <div className="mx-14">
    {loading ? (
      <Loading />
    ) : (
    <div className={`${theme.backgroundColor} ${theme.textColor} min-h-screen p-6`}>

      {wishlistItems.length > 0 ? (
        <>
      <h1 className={`${theme.fontSize} ${theme.fontFamily} font-bold mb-6 text-center`}>Your Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item, index) => (
            <div key={item.id} style={{ boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}
              className={`bg-white shadow-xl rounded-lg overflow-hidden relative ${theme.primaryColor}`}>
              <img
                src={(`${previewpath}${item.thumbnail}`) || ''}
                alt={item.title}
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <h2 className={`text-lg font-semibold mb-2 ${theme.fontFamily}`}>{item.title}</h2>
                <p className={`text-base font-bold mb-4 ${theme.fontFamily}`}>{item.exRate ? item.exRate : <>0.00</>}</p>
                <span
                  onClick={() => handleRemove(item)}
                  className="absolute top-2 right-2 bg-green-400 text-white p-2 w-8 h-8 rounded-full hover:bg-red-500 focus:outline-none cursor-pointer"
                  aria-label={`Remove ${item.title} from wishlist`}
                >
                  <MdDelete  className='w-4 h-4' />
                </span>
                <div className='flex items-center gap-2'>
                  {/* <Link
                  state={item}
                    to={{ pathname: `/${item.title}/${item.id}`, state: { item } }}
                    className="block mt-4 bg-blue-500 text-white text-center w-[50%] py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
                  >
                    View Details
                  </Link> */}
                  {/*<Link
                    to={`/dppui/ebooks`}
                    className="block mt-4 bg-green-500 text-white text-center py-2 w-[50%] rounded-lg hover:bg-green-600 cursor-pointer"
                  >
                    Add to cart
                  </Link>*/}
                </div>
              </div>
            </div>
          ))}

        </div>
        </>
      ) : (
        <div className="text-center py-10 flex items-center justify-center flex-col text-lg font-semibold">
          <img src={notfound} alt='Not Found' className=''/>
        {!user && <Link to="/userlogin" className="text-green-500 hover:underline">Login</Link>
        }  
          {/* <h3>Your Wishlist is empty.</h3><br/> */}
          <h3>Your wishlist is waiting. </h3>
          {/* <br/> */}
        <br/>
          <Link to="/" className="text-blue-500 hover:underline">Continue shopping</Link><br/>
        </div>
      )}
    </div>
    

    )}
    <NotificationSnackbar
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default Wishlist;
