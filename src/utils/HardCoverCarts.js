import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cart } from "./Provider/CartContext"; 
import notfound from '../Asset/WishList/no-data-found.png';
import { DeleteAddToCart } from "./APIURL";
import Loading from "./Loader/Loading";
import { useAuth } from "./Provider/AuthContext";
import NotificationSnackbar from "./NotificationSnackbar";

const HardCoverCarts = () => {
  const navigate = useNavigate();
  const { cart = [], setCart } = useContext(Cart) || { cart: [], setCart: () => {} };
  //console.log("🚀 ~ HardCoverCarts ~ cart:", cart)
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [selectedItems, setSelectedItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);

  // Function to handle checkbox change
  const handleCheckboxChange = (itemId) => {
    // console.log("checked", itemId);

    setSelectedItems(prevSelected => {
      const updatedSelected = prevSelected.includes(itemId) 
        ? prevSelected.filter(id => id !== itemId) 
        : [...prevSelected, itemId];

      // console.log("console.selected", updatedSelected);
      // console.log("console.selected cart", cart);

      const newOrderItems = updatedSelected.map(cartId => {
        const item = cart.find(cartItem => cartItem.cartId === cartId?.cartId);
        console.log(item)
        if (!item) {
          console.warn(`Item with cartId ${cartId} not found in cart.`);
          return null;
        }
        return {
          orderItemId: -1,
          orderId: -1,
          itemId: item.contentId,
          rate: item.exRate || 0,
          quantity: item.quantity || 1,
          amount: (item.exRate || 0) * (item.quantity || 1),
          sgst: 0,
          cgst: 0,
          igst: 0,
          discount: 0,
          discountType: "",
          discountAmount: 0,
          netAmount: (item.exRate || 0) * (item.quantity || 1), 
        };
      }).filter(item => item !== null); 
  
      setOrderItems(newOrderItems);
      return updatedSelected;
    });
  };
  // console.log(selectedItems)
  // console.log(orderItems)

  const handleNavigatetopayment=()=>{
    navigate('/payment', {state:{orderItems:selectedItems, totalAmount:total}})
  }

  useEffect(() => {
    const calculateTotal = () => {
      const totalPrice = cart.reduce((acc, curr) => acc + (curr.exRate || 0) * (curr.quantity || 1), 0);
      setTotal(totalPrice);
      setLoading(false);
    };

    const timeoutId = setTimeout(calculateTotal, 3000);

    return () => clearTimeout(timeoutId); 
  }, [cart]);


  const handleNavigateToEBook = () => {
    if (cart.length > 0) {
      navigate("/");
    } else {
      alert("No eBook details available.");
    }
  };
  
  const handleNavigationDetails = (book) => {
    // console.log("🚀 ~ handleNavigationDetails ~ book:", book);
    let path = `/${encodeURIComponent(book.title)}/${String(book.contentId)}`;
    navigate(path, { state: { book } });
    // if (cart.length > 0) {
    //   navigate("/");
    // } else {
    //   alert("No eBook details available.");
    // }
  };

  const handleDeleteCartData = async (item) => {
    //console.log("🚀 ~ handleDeleteCartData ~ item:", item)
    const response = await DeleteAddToCart(item.cartId);
    if (response && response.isSuccess) {
      // showToast('success', response.mesg);
      setSnackbarMessage(response.mesg);
      setSnackbarSeverity('success');
      const updatedCart = cart.filter(cartItem => cartItem.cartId !== item.cartId);
      // console.log("🚀 ~ handleDeleteCartData ~ updatedCart:", updatedCart)
      setCart(updatedCart);
    } else {
      let mesg = response.mesg || "Error removing item.";
      // showToast('error', mesg);
      setSnackbarMessage(mesg);
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <>
      {loading ? (
        <div className="mx-14">
          <Loading />
        </div>
      ) : (
        <div className="text-gray-800 relative">
            {cart.length > 0 && (
          <div className="flex items-center justify-between fixed w-5/6 top-20 left-28 px-5 bg-white border rounded-xl shadow-lg z-10">
              <>
                <h1
                  onClick={handleNavigateToEBook}
                  className="font-semibold rounded-lg transition-colors underline underline-blue-500 text-blue-600 hover:cursor-pointer"
                >
                  Continue Shopping
                </h1>
                <h1 className="text-2xl font-bold mb-2">Your Cart</h1>
                <h2 className="text-xl font-semibold mb-1">Price: <i>₹ {total}</i></h2>
                <h1 className="text-lg  mb-1 transition-colors underline underline-blue-500 text-blue-600 hover:cursor-pointer" onClick={handleNavigatetopayment} >Place your order</h1>

              </>
          </div>
            )}

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-5 mt-20 mb-20">
              {cart.map(item => (
                <div key={item.id} className="p-4 shadow  border-2 rounded-lg flex flex-col items-center w-full">
                <div>
                  <input 
                    type='checkbox' 
                    onChange={() => handleCheckboxChange(item)} 
                  />
                  </div>
                  <img 
                    src={item.thumbnail} 
                    alt={item.title} 
                    className="w-24 h-24 object-cover rounded-md mb-4"
                  />
                  <div className="text-center">
                    <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                    <div className="flex justify-between mb-2 w-full">
                      <span>Qty: {item.quantity || 1}</span>
                      <span>Price: ₹{item.exRate || 0.0}</span>
                    </div>
                    <div className="">
                    {/* <div className="flex gap-2"> */}
                      <button
                        onClick={() => handleDeleteCartData(item)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center flex flex-col items-center justify-between">
              <img src={notfound} alt='Not Found' className=''/>
              {/* <h1 className="text-xl font-semibold mb-4">Cart is empty.</h1> */}
              <p className="text-lg mb-6">
                Your shopping cart is waiting. Give it purpose – fill it with many book genres.
              </p>
              <div className="flex flex-col items-center gap-4">
                <Link to="/" className="text-blue-500 hover:underline">Continue shopping on the homepage</Link>
                <Link to="/wishlist" className="text-blue-500 hover:underline">Visit your Wish List</Link>
                {!user && <Link to="/userlogin" className="text-green-500 hover:underline">Login</Link>}
              </div>
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
    </>
  );
};

export default HardCoverCarts;