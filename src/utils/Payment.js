import React, { useContext, useEffect, useState } from "react";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../Asset/Navbar/images/newLogo.png";
import Divider from "@mui/material/Divider";
import { FcInfo } from "react-icons/fc";
import paymentLogo from '../Asset/Navbar/images/logo.png';
import { getISTDate } from "./validators";
import { DeleteAddToCart, fetchAddress, getAddtoCart, getAddUpdateOrderItem } from "./APIURL";
import useUnmeCookie from "./useUnmeCookie";
import { Cart } from "./Provider/CartContext"; 
import { useTheme } from "./Provider/ThemeContext";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const themeMaster = useTheme();
  const userId = localStorage.getItem("userid");
  const { defaultValuestime } = getISTDate();
  const { cart, setCart } = useContext(Cart);
  const [isChecked, setIsChecked] = useState(false);
  const[total, setTotal]=useState(0);
  const { book = [], amount = "0.00", qty = 0, orderItems = [], totalAmounts = 0 } = location.state || {};
  
  console.log(themeMaster)
  const books = Array.isArray(book) ? book : [book];
  // const totalAmount = books.reduce((total, b) => total + (b.exRate * (b.quantity || location.state.qty)), 0);
  // console.log(Array.isArray(books) && books.length > 0 )
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [errors, setErrors] = useState({});
  const [addressData, setAddressData] = useState([]);
  console.log("🚀 ---------------------------------------🚀")
  console.log("🚀 ~ Payment ~ addressData:", addressData)
  console.log("🚀 ---------------------------------------🚀")
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (location.state === null) {
    navigate('/');
  }

  useEffect(()=>{
    if(userId != '' || userId != null){
      getAddressData(userId)
    }
  },[userId])

  const getAddressData =async (id)=>{
    const response = await fetchAddress(id);
    if (response.data ) {
      console.log(response.data[0])
      let res = response.data[0]
      let fullName = res.membName;
      setAddressData(res); 
      setName(fullName);
      setMobileNumber(res.phone2);
      setEmail(res.email2);
    } else {
      console.error("No address data found.");
      setAddressData([]); 
    }
  };
  console.log("response", addressData)
  console.log("name", name)
  console.log("mobileNumber", mobileNumber)
  console.log("email", email)

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked); 
    if (e.target.checked) {
      setDeliveryAddress(`${addressData.localAddress}`);
      setPincode(addressData.localPincode.trim());
    } else {
      setDeliveryAddress('');
      setPincode('');
    }
  };
  

  const handleAddressChange = (e) => {
    setDeliveryAddress(e.target.value);
  }; 
  
  const handlePincodeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPincode(value);
      setErrors((prevErrors) => ({ ...prevErrors, pincode: '' })); 
    }
  };

  const validateAddress = (address) => {
    const trimmedAddress = address.trim();
    if (!trimmedAddress) {
      return 'Delivery address is required.';
    }
    return '';
  };
  
  const validatePincode = (pincode) => {
    const trimmedPincode = pincode;
    if (!trimmedPincode) {
      return 'Pincode is required.';
    }
    if (trimmedPincode.length !== 6) {
      return 'Pincode must be exactly 6 digits.';
    }
    return '';
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const addressError = validateAddress(deliveryAddress);
    const pincodeError = validatePincode(pincode); 
    setErrors({
        deliveryAddress: addressError,
        pincode: pincodeError,
    });

    if (addressError || pincodeError) {
        return; 
    }

    setShowModal(false); 
    setErrors({}); 
  };


  const formDataArray = (Array.isArray(books) && books.length > 0 ? books : orderItems).map(b => ({
    orderItemId: -1,
    orderId: -1,
    itemId: b.contentId || b.id,
    rate: b.exRate ,
    quantity: b.quantity || location.state.qty,
    amount: b.exRate * (b.quantity || location.state.qty),
    sgst: 0,
    cgst: 0,
    igst: 0,
    discount: 0,
    discountType: "",
    discountAmount: 0,
    netAmount: b.exRate * (b.quantity  || location.state.qty),
  }));
  // console.log("🚀 ~ formDataArray ~ formDataArray:", formDataArray)

  const totalAmount = books.length > 0 
  ? books.reduce((total, b) => {
      const quantity = b.quantity || location.state.qty || 0;
      const exRate = b.exRate || 0; 
      return total + (exRate * quantity);
    }, 0) 
  : (formDataArray || []).reduce((total, item) => {
    // console.log("Current Item:", item);
    const netAmount = item?.netAmount !== undefined ? item.netAmount : 0; 
    return total + netAmount;
  }, 0);

    // console.log(totalAmount)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  
  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleCODProceed = () => {
    if (selectedPaymentMethod === "cod") {
      navigate(`/${encodeURIComponent(selectedPaymentMethod)}/captcha-verification`, { state: { qty, book, amount, formDataArray, totalAmount, pincode, deliveryAddress, email, mobileNumber, name } });
    } else {
      alert("Please select a valid payment method.");
    }
  };

  const handleProceed = async () => {
    if (selectedPaymentMethod) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.addEventListener("load", () => {
        const options = {
          key: 'rzp_test_UmUIzzSAIdrrTV',
          amount: totalAmount * 100,
          currency: 'INR',
          name: 'MSSPL',
          description: `${selectedPaymentMethod} Transaction`,
          image: paymentLogo,
          handler: function (response) {
            saveOrderItem(response.razorpay_payment_id);
          },
          prefill: {
            name: name,
            email: email,
            contact: mobileNumber,
          },
          notes: {
            address: 'MSSPL, Kanpur',
          },
          theme: {
            color: '#F37254',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      });
      document.body.appendChild(script);
    } else {
      alert("Please select a valid payment method.");
    }
  };

  const saveOrderItem = async (paymentID) => {
    const collectData = {
      orderId: -1,
      serviceId: 0,
      orderNo: "",
      rate: totalAmount,
      dispatchFees: 0,
      paymentModeId: 0,
      paymentModeName: selectedPaymentMethod,
      paymentDate: defaultValuestime,
      transactionId: paymentID,
      transactionDate: defaultValuestime,
      createdBy: userId,
      updatedBy: userId,
      createdOn: defaultValuestime,
      updatedOn: defaultValuestime,
      "address": deliveryAddress,
      "pincode": pincode,
      emailId: email,
      contact: mobileNumber,
      ordeItemDetails: formDataArray
    };

    console.log("🚀 ~ saveOrderItem ~ collectData:", collectData)
    const response = await getAddUpdateOrderItem(collectData);
    if (response.isSuccess) {
      const cartIdsToRemove = [];
      console.log("🚀 ~ saveOrderItem ~ cartIdsToRemove:", cartIdsToRemove)

      collectData.ordeItemDetails.forEach(orderItem => {
        const matchingCartItem = cart.find(cartItem => cartItem.contentId === orderItem.itemId);
        console.log("🚀 ~ saveOrderItem ~ matchingCartItem:", matchingCartItem)
        if (matchingCartItem) {
          cartIdsToRemove.push(matchingCartItem.cartId);
        }
      });
  
      // await DeleteAddToCart(cartIdsToRemove);
      for (const cartId of cartIdsToRemove) {
        const deleteResponse = await DeleteAddToCart(cartId);
        if (deleteResponse.isSuccess) {
          console.log(`Successfully deleted cartId: ${cartId}`);
          const emptyCart = await getAddtoCart(userId);
          if(emptyCart.isSuccess){
            setCart([]);
          }

        } else {
          console.error(`Failed to delete cartId: ${cartId}`);
          alert('Failed to delete cart items. Please try again.');
          return; // Exit the function if any deletion fails
        }
      }
      navigate('/order-confirmation');
    } else {
      alert('Network Issues');
    }
  };

  return (
    <>
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 w-1/3 z-60">
      <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>

      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 w-1/3 z-60">
      <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>

     
      {/* Display Address Selection */}
      <div className="mb-4">
        {/* <h3 className="text-md font-semibold mb-2">D Address</h3> */}
        {addressData? (
          <div className="p-3 mb-2 border rounded-md flex items-center hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              id={`address-${addressData.addid}`}
              name="address" 
              value={addressData.addid}
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="mr-3"
            />
            <label htmlFor={`address-${addressData.addid}`} className="text-sm">
              <span className="font-medium">{addressData.localAddress}</span>
              <br />
              {addressData.localPincode}
            </label>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No addresses found. Please enter a new one below.</p>
        )}
      </div>

      {/* Form for Manual Entry */}
        <h3 className="text-md font-semibold mb-2">Add New Address</h3>
      <form onSubmit={handleAddressSubmit}>
        <input
          type="text"
          value={deliveryAddress}
          onChange={handleAddressChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="Enter Delivery Address"
        />
        {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>}

        <input
          type="text"
          value={pincode}
          onChange={handlePincodeChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${errors.pincode ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="Enter pincode"
        />
        {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}

        <div className="flex justify-between items-center">
          <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Submit</button>
          <button type="button" className="mt-4 bg-red-500 text-white py-2 px-4 rounded" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}





      {/* Form for Manual Entry */}
      <form onSubmit={handleAddressSubmit}>
        <input
          type="text"
          value={deliveryAddress}
          onChange={handleAddressChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="Enter Delivery Address"
        />
        {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>}

        <input
          type="text"
          value={pincode}
          onChange={handlePincodeChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${errors.pincode ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="Enter pincode"
        />
        {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}

        <div className="flex justify-between items-center">
          <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Submit</button>
          <button type="button" className="mt-4 bg-red-500 text-white py-2 px-4 rounded" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Payment UI */}
      {!showModal && 
    (<div className="p-4">
      <div className="flex items-center justify-center m-2">
        {/* <img src={logo} className="w-36 h-28" alt="Logo" /> */}
      </div>
      <h1 className="text-lg font-semibold">How would you like to pay?</h1>
      <div className="flex items-start justify-between gap-4">
        <div className="w-[70%] border-[#d5d9d9] border-[1.5px] rounded-xl p-4">
          <div className=" border-[#1196ab] border-[2px] border-l-8 my-4 py-4 rounded-xl">
            <div className="flex items-center gap-2">
              <FcInfo size={20} />
              Pay Balance can no longer be used to pay for eBooks or Subscriptions.
            </div>
          </div>

          <div className="w-full my-3">
            <p className="text-sm font-bold">Payment Methods</p>
            <div className="grid grid-cols-2 items-center py-1 px-4">
              <div>
                <input
                  type="radio"
                  id="onlineBanking"
                  name="paymentMethod"
                  value="onlineBanking"
                  onChange={handlePaymentMethodChange}
                />{" "}
                <label htmlFor="onlineBanking">Online Banking</label>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center py-1 px-4">
              <div>
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  onChange={handlePaymentMethodChange}
                />{" "}
                <label htmlFor="cod">Cash on Delivery</label>
              </div>
            </div>
          </div>
        </div>

        <div className=" w-[27%] border-[#d5d9d9] border-[1.5px] rounded-xl p-4">
          <button
            type="button"
            disabled={!selectedPaymentMethod}
            id="razorpay-button-container"
            className={`text-xs w-full p-2 rounded-full ${selectedPaymentMethod ? 'bg-[#ffd814] text-[#000]' : 'bg-[#fffae0] text-[#6f7373] border-[#ffed94]'}`}
            onClick={selectedPaymentMethod === "cod" ? handleCODProceed : handleProceed}
          >
            {selectedPaymentMethod === "cod" ? "Proceed to order" : "Pay now"}
          </button>
          <label className="text-lg font-semibold py-4">Order Summary</label>
          {books.map((b, index) => (
            <div key={index} className="flex items-start justify-between pb-4">
              <div className="grid grid-cols-1 my-2">
                <label className="text-xs text-wrap">{b.title}</label>
                <label className="text-xs">E-Books Edition</label>
              </div>
              <div className="flex items-start">
                <label>
                  <CurrencyRupeeOutlinedIcon fontSize="small" />
                </label>
                <label className="text-xs">{b.exRate * (b.quantity|| location.state.qty)}</label>
              </div>
            </div>
          ))}
          <Divider />
          <div className="flex items-start justify-between">
            <label className="font-semibold ">Order Total:</label>
            <div className="text-[#c7511f]">
              <CurrencyRupeeOutlinedIcon fontSize="small" />
              <label className="font-semibold">{totalAmount}</label>
            </div>
          </div>
        </div>
      </div>
    </div>)}
    </>
  );
};

export default Payment;