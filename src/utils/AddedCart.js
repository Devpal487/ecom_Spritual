import React from 'react';
import { IoIosCheckmarkCircle } from "react-icons/io";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import { useNavigate } from 'react-router-dom';
import { useTheme } from './Provider/ThemeContext'; // Import theme context

const AddedCart = ({ qty, price, bookRecord }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [amount, setAmount] = React.useState(price);

  //console.log("addedcart ", qty, price, bookRecord);

  const handleNavigate = (e) => {
    e.preventDefault();
    // console.log("handleNavigate called");
    if (bookRecord) {
      // console.log("🚀 ~ handleNavigate ~ bookRecord:", bookRecord)
      // console.log("Navigating to:", `/${encodeURIComponent(bookRecord.title)}/${encodeURIComponent(qty)}`);
      navigate(`/cartDetails`, {state: { id:bookRecord?.id ,amount: price, book: bookRecord, qty: qty, price: price }});
    } else {
      alert("bookRecord is not found");
    }
  };
  

  const handlePayment = (e) => {
    e.preventDefault();
    if (bookRecord) {
      navigate(`/payment`, {
        state: { amount: price, book: bookRecord, qty: qty, price: price }
      });
    } else {
      alert("bookRecord is not found");
    }
  };

  return (
    <div className={`border-2 border-l-8 m-4 p-4 rounded-xl ${theme.backgroundColor} ${theme.textColor} ${theme.fontFamily} ${theme.fontSize}`}>
      <div className='flex flex-col md:flex-row items-center md:items-start gap-4'>
        <div className='flex items-center'>
          <IoIosCheckmarkCircle color={theme.primaryColor} size='20px' />
          <span className={`text-${theme.primaryColor} font-semibold ml-2`}>Added to Cart</span>
        </div>
        <div className='flex flex-col md:flex-row gap-4 items-center'>
          <div className='flex flex-col md:flex-row gap-2'>
            <span className='font-semibold'>Subtotal</span> ({qty} Book):
            <h5 className={`text-[#b12704] font-semibold`}>
              INR <CurrencyRupeeOutlinedIcon fontSize='small' /> {amount === 0 ? "Your Cart is empty!!" : price}
            </h5>
          </div>
          <div className='flex flex-col md:flex-row gap-2'>
            <button 
              className={`bg-blue-500 text-white rounded-lg px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300`}
              onClick={handleNavigate}
            >
              Cart
            </button>
            <button 
              className={`bg-red-500 via-${theme.primaryColor}-400 to-${theme.primaryColor}-600 text-white rounded-lg px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300`}
              onClick={handlePayment}
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddedCart;
