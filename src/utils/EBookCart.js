import React, { useContext, useEffect, useState } from "react";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { Cart } from "./Provider/CartContext"; 
import { CiSquarePlus } from "react-icons/ci";
import { CiSquareMinus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { DecreaseAddToCart, DeleteAddToCart, getAddtoCart, getAddUpdateAddToCart } from "./APIURL";
import NotificationSnackbar from "./NotificationSnackbar";

const EBookCart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log("🚀 ~ EBookCart ~ location:", location);
  const { cart, setCart } = useContext(Cart);
  // console.log("🚀 ~ cart ~ location:", cart);
  const [checkedItems, setCheckedItems] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const unmeValue = localStorage.getItem('userid');
  useEffect(() => {
    const initialCheckedItems = {};
    // console.log("InitialCheckedItem", initialCheckedItems);
    
    // Get the latest cart data from context
    const currentCart = cart; // This is already from context
    // console.log("cart", cart);
  
    const fetchCartData = async () => {
      const data = await getAddtoCart(unmeValue); // Call the API to get new cart data
      if (data) {
        // Compare response data with contentId
        data.data.forEach(cartItem => {
          initialCheckedItems[cartItem.cartId] = true; // Set cartId to true
        });
      }
      // Set checked items after fetching data
      setCheckedItems(initialCheckedItems);
    };
  
    const processCartItems = async () => {
      for (const item of currentCart) {
        if (item.cartId !== undefined) { // Check if cartId is defined
          initialCheckedItems[item.cartId] = true;
        } else {
          // console.warn("Item without cartId:", item); // Log a warning for items without cartId
          await fetchCartData(); // Wait for fetchCartData to complete
        }
      }
      // Set checked items for items with cartId
      setCheckedItems(initialCheckedItems);
    };
  
    processCartItems();
  }, [cart]);

  useEffect(() => {
    calculateTotal();
  }, [checkedItems]);

  console.log("🚀 ~ EBookCart ~ checkedItems:", checkedItems);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCheckboxChange = (cartId) => {
    console.log("🚀 ~ handleCheckboxChange ~ cartId:", cartId);
    setCheckedItems((prev) => {
      const updatedCheckedItems = {
        ...prev,
        [cartId]: !prev[cartId],
      };
      calculateTotal();
      return updatedCheckedItems;
    });
  };

  const calculateTotal = () => {
    const total = Object.keys(checkedItems).reduce((acc, cartId) => {
      if (checkedItems[cartId]) {
        const item = cart.find(
          (i) => i.cartId === parseInt(cartId) || i.id === parseInt(cartId)
        );
        // console.log("🚀 ~ total ~ item:", item);
        if (item) {
          acc += item.exRate * item.quantity;
        }
      }
      return acc;
    }, 0);
    // console.log("🚀 ~ total ~ total:", total);
    setTotalAmount(total);
  };

  const handlenavigate = (e) => {
    e.preventDefault();
    // if (totalAmount === 0) {
    //   // alert("Please select at least one item to proceed.");
    //   setSnackbarMessage(`Please select at least one item to proceed.`);
    //   setSnackbarSeverity('warning');
    //   setSnackbarOpen(true);
    //   return;
    // }
    const selectedBooks = cart.filter((item) => checkedItems[item.cartId]);

    navigate(`/payment`, {
      state: { amount: totalAmount, book: selectedBooks },
    });
  };

  const handleAddToCart = async (selectedItem) => {

    if (selectedItem) {
        // console.log("🚀 ~ handleAddToCart ~ selectedItem:", selectedItem)
        
        let cartItem = {
            cartId:selectedItem.cartId,
            contentId: selectedItem.id || selectedItem.contentId,
            quantity: 1, 
            userId: localStorage.getItem('userid'),
            title: selectedItem.title,
            thumbnail: selectedItem.thumbnail,
            exRate: selectedItem.exRate
        };
        // console.log("🚀 ~ handleAddToCart ~ cartItem:", cartItem)
  
        const data = await DecreaseAddToCart(cartItem);
        
        if (data?.isSuccess) {
            const existingItemIndex = cart.findIndex(item => item.contentId === cartItem.contentId);
            
            if (existingItemIndex !== -1) {
                const updatedCart = [...cart];
                updatedCart[existingItemIndex].quantity -= cartItem.quantity; 
                setCart(updatedCart);
                // showToast('success', `${cartItem.title} quantity updated in cart`);
                setSnackbarMessage(`${cartItem.title} quantity updated in cart`);
                setSnackbarSeverity('success');
            } else {
                setCart(prevCart => [...prevCart, cartItem]);
                // showToast('success', `${cartItem.title} added to cart`);
                setSnackbarMessage(`${cartItem.title} added to cart`);
                setSnackbarSeverity('success');
            }
        } else {
            // showToast('error', `Failed to add ${cartItem.title} to cart`);
            setSnackbarMessage(`Failed to add ${cartItem.title} to cart`);
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
    }
  };

  const handleIncrease = async (selectedItem) => {
    if (selectedItem) {
      let cartItem = {
        contentId: selectedItem.id || selectedItem.contentId,
        quantity: 1,
        userId: localStorage.getItem('userid'),
        title: selectedItem.title,
        thumbnail: selectedItem.thumbnail,
        exRate: selectedItem.exRate
      };
  
      const data = await getAddUpdateAddToCart(cartItem);
      if (data?.isSuccess) {
        const existingItemIndex = cart.findIndex(item => item.contentId === cartItem.contentId);
        if (existingItemIndex !== -1) {
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].quantity += cartItem.quantity;
  
          // Preserve the checked state for this item
          const currentCheckedState = checkedItems[selectedItem.cartId];
          setCart(updatedCart);
          
          // Restore the checked state
          setCheckedItems(prev => ({
            ...prev,
            [selectedItem.cartId]: currentCheckedState,
          }));
  
          setSnackbarMessage(`${cartItem.title} quantity updated in cart`);
          setSnackbarSeverity('success');
        } else {
          setCart(prevCart => [...prevCart, cartItem]);
          setSnackbarMessage(`${cartItem.title} added to cart`);
          setSnackbarSeverity('success');
        }
      } else {
        setSnackbarMessage(`Failed to add ${cartItem.title} to cart`);
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
    }
  };
  
  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      handleAddToCart(item);
    } else {
      handleDelete(item);
    }
  };

  
  const handleDelete = async(id) => {
    // console.log("🚀 ~ handleDelete ~ id:", id);
      const response = await DeleteAddToCart(id.cartId);
      if (response && response.isSuccess) {
        // showToast('success', response.mesg);
        setSnackbarMessage(response.mesg);
        setSnackbarSeverity('success');
        const updatedCart = cart.filter(cartItem => cartItem.cartId !== id.cartId);
        setCart(updatedCart);
      } else {
        let mesg = response.mesg || "Error removing item.";
        //showToast('error', mesg);
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
    <div className="container mx-auto p-4">
    {/* <ReToastContainer/> */}
      <div
        className={`bg-white rounded-lg shadow-lg p-6 ${
          isSticky
            ? "sticky top-16 z-10 transition-transform transform scale-90"
            : ""
        }`}
      >
        <div className="flex justify-between mb-4">
          <span className="text-lg font-semibold">Cart Subtotal</span>
          <span className="text-lg font-bold">
            <CurrencyRupeeOutlinedIcon fontSize="small" />
            {totalAmount}
          </span>
        </div>
        <button
          className="w-full bg-yellow-500 text-white py-2 rounded-lg transition-transform transform hover:scale-105"
          onClick={handlenavigate}
        >
          Proceed to Buy
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Your Products</h2>
        <Divider />
        {cart.map((item) => (
          <div
            className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm mb-2"
            key={item.cartId}
          >
            <div className="flex items-center">
            <input
        type="checkbox"
        checked={!!checkedItems[item.cartId]}
        onChange={() => handleCheckboxChange(item.cartId)} 
        className="mr-3"
      />
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="ml-4">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-5">
                  Qty:
                  <div className="flex items-center justify-between">
                    <span>
                      {item.quantity <= 1 ? (
                        <MdDelete
                          size={20}
                          onClick={() => handleDelete(item || item)}
                        />
                      ) : (
                        <CiSquareMinus
                          size={20}
                          onClick={() => handleDecrease(item || item)}
                        />
                      )}
                    </span>
                    <span>
                      <input
                        type="text"
                        value={item.quantity}
                        className="w-10 text-center border-0 "
                        readOnly
                      />
                    </span>
                    <span>
                      <CiSquarePlus
                        size={20}
                        onClick={() => handleIncrease(item || item)}
                      />
                    </span>
                  </div>
                </p>
              </div>
            </div>
            <div className="text-right mt-2 md:mt-0">
              <span className="text-lg font-bold">
                <CurrencyRupeeOutlinedIcon />
                {item.exRate * item.quantity}
              </span>
            </div>
          </div>
        ))}
        <Divider className="my-4" />
      </div>
    </div>
    <NotificationSnackbar
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </>
  );
};

export default EBookCart;

// import React, { useContext, useEffect, useState } from 'react';
// import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
// import { useNavigate, useLocation } from 'react-router-dom';
// import Divider from '@mui/material/Divider';
// import Chip from '@mui/material/Chip';
// import { useSelector } from 'react-redux';
// import { Cart } from './CartContext';

// const EBookCart = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { cart, setCart } = useContext(Cart);
//   const [checkedItems, setCheckedItems] = useState({});
//   const [totalAmount, setTotalAmount] = useState(0);
//   console.log("🚀 ~ EBookCart ~ cart:", cart)

//   console.log("🚀 ~ EBookCart ~ location:", location.state)
//   // const selectedItem = useSelector((state) => state.allCart.cart);
//   // console.log("🚀 ~ EBookCart ~ selectedItem:", selectedItem)

//   const { amount, book, price, qty } = location.state || {};

//   const [data, setData] = useState({});
//   const [qtys, setQtys] = useState(0);
//   const [amt, setAmt] = useState(0);

//   useEffect(() => {
//     calculateTotal();
//   }, [checkedItems]);

//   useEffect(() => {
//     if (book) {
//       setData(book);
//       setQtys(qty);
//       setAmt(amount);
//     }
//   }, [book, qty, amount]);

//   const handleCheckboxChange = (cartId, exRate, quantity) => {
//     setCheckedItems(prev => {
//       const updated = { ...prev, [cartId]: !prev[cartId] };
//       return updated;
//     });
//   };

//   const calculateTotal = () => {
//     const total = Object.keys(checkedItems).reduce((acc, cartId) => {
//       if (checkedItems[cartId]) {
//         const item = cart.find(i => i.cartId === parseInt(cartId));
//         if (item) {
//           acc += item.exRate * item.quantity;
//         }
//       }
//       return acc;
//     }, 0);
//     setTotalAmount(total);
//   };

//   const handlenavigate = (e) => {
//     e.preventDefault();
//     navigate(`/payment`, { state: { amount, book, qty }});
//   };

//   const handleback = (e) => {
//     e.preventDefault();
//     navigate('/featured-categories');
//   };

//   return (
//     <div className='items-center border-[#d5d9d9] border-l-[2px] border-r-[2px] border-0 bg-[#f0f2f2] m-4 p-4'>
//       <div className='flex'>
//         <span className='text-base font-medium'>
//           Carts Subtotal (1 item): <CurrencyRupeeOutlinedIcon fontSize='small' /><b>{amt}</b>
//         </span>
//       </div>
//       <div className='my-4'>
//         <button
//           type='submit'
//           className='cursor-pointer w-full border-[2px] p-1 rounded-lg bg-[#ffd814] border-[#ffd814] text-base'
//           onClick={handlenavigate}
//         >
//           Proceed to Buy
//         </button>
//       </div>
//       <div className='my-4'>
//         <Divider>
//           <Chip label="or" size="small" />
//         </Divider>
//       </div>
//       <div className='text-center text-[#007185] hover:underline hover:text-[#c7511f] cursor-pointer'>
//         <a onClick={handleback}>Continue shopping on MSSPL</a>
//       </div>
//       <div className='flex items-end justify-between px-4 pt-4 gap-2'>
//         <label className='text-base'>Action</label>
//         <div className='grid gap-2'>
//           <label className='text-xl font-semibold'>Product</label>
//           <label>(1 item)</label>
//         </div>
//         <label className='text-base'>Product name</label>
//         <label className='text-base'>Price</label>
//       </div>
//       <Divider />
//       {cart.map((item)=>(
//       <div className='grid grid-cols-4 p-4' key={item.cartId}>
//       <div>
//         <input type='checkbox'/>
//         <label></label>
//       </div>
//         <div className='h-[100%]'>
//           <img src={item.thumbnail} alt={item.title} className='w-[20%]' />
//         </div>
//         <div className='w-[70%] text-left'>
//           <label className='text-base font-medium'>{item.title}</label><br/>
//           {/* <label className='text-xs'>by {data.author}</label><br/> */}
//           {/* <label className='text-sm font-bold'>{data.format}</label><br/> */}
//           <label>
//             <span className='text-sm'>Qty: {item.quantity}</span> | <a href="#">Delete</a>
//           </label>
//         </div>
//         <div className='text-end'>
//           <label><CurrencyRupeeOutlinedIcon />{item.exRate?item.exRate * item.quantity : 0}</label>
//         </div>
//       </div>))}
//       <Divider />
//       <div className='text-end p-3'>
//         <label><CurrencyRupeeOutlinedIcon />{amt}</label>
//       </div>
//     </div>
//   );
// };

// export default EBookCart;

// import React, { useEffect, useState } from 'react';
// import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
// import { useNavigate, useLocation } from 'react-router-dom';
// import Divider from '@mui/material/Divider';
// import Chip from '@mui/material/Chip';

// const EBookCart = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { amount, book, price, qty } = location.state || {};
//   const [data, setData] = useState([]);
//   const [qtys, setQtys] = useState(0);
//   const [amt, setAmt] = useState(0);

//   console.log("🚀 ~ Cart ~ data:", data)

//   useEffect(()=>{
//     setData(book);
//     setQtys(qty);
//     setAmt(amount);
//   },[])

//   const handlenavigate = (e) => {
//     e.preventDefault();
//     navigate('/dppui/pay-select', {state:{amount}});
//   };

//   const handleback = (e) => {
//     e.preventDefault();
//     navigate('/featured-categories');
//   };

//   return (
//     <div>

//     <div className=' items-center border-[#d5d9d9] border-l-[2px] border-r-[2px] border-0 bg-[#f0f2f2] m-4 p-4 '>
//     <div className='flex'><span className='text-base font-medium'>eBooks Subtotal (1 item):<CurrencyRupeeOutlinedIcon fontSize='small'/><b>{amount}</b></span>
//     </div>
//     <div className=''>
//     <button type='submit' className='cursor-pointer w-full border-[2px] p-1 rounded-lg bg-[#ffd814] border-[#ffd814] text-base' onClick={handlenavigate}>Proceed to Buy</button>
//     </div>
//     <div className='my-4'>

//     <Divider>
//     <Chip label="or" size="small"  />
//   </Divider>
//     </div>
//     <div className='text-center text-[#007185] hover:underline hover:text-[#c7511f] cursor-pointer'><a onClick={handleback}>Continue shopping on KindleStore</a></div>
//     {/* <div className='flex gap-4 items-center'>
//     <div className='flex gap-2'><span className='font-semibold'>Subtotal</span> (1 eBook):<h5 className=' text-[#b12704] font-semibold'>INR <CurrencyRupeeOutlinedIcon fontSize='small'/> 228.00</h5></div>
//     <div className='mx-2'><button type='submit' className='cursor-pointer w-full border-[2px] p-1 rounded-lg bg-[#ffd814] border-[#ffd814] text-xs'>Proceed to checkout</button></div>
//     </div> */}
//     </div>
//     <div className='flex items-end justify-between px-4 pt-4 gap-2'>
//       <div className='grid gap-2'>
//       <label className='text-xl font-semibold'>eBooks</label>
//       <label className=''>(1 item)</label>
//       </div>
//       <label className='text-base'>Price</label>
//     </div>
//     <Divider/>
// <div className='grid grid-cols-3 p-4'>
//     <div className='h-[100%]'>
//       <img src={data.imageLink} className='w-[20%]'/>
//     </div>
//     <div className='w-[70%] text-left'>
//       <label className='text-base font-medium'>{data.title}</label><br/>
//       <label className='text-xs '>by {data.author}</label><br/>
//       <label className='text-sm font-bold'>{data.format}</label><br/>
//       <label><span className='text-sm'>Qty: {qtys}</span> {" "}| {" "} <a href="#">Delete</a></label>
//     </div>
//     <div className='text-end'>
//       <label> <CurrencyRupeeOutlinedIcon/>{amt}</label>
//     </div>
// </div>
// <Divider/>
// <div>
//   <label>500</label>
// </div>
//     </div>
//   )
// }

// export default EBookCart;
