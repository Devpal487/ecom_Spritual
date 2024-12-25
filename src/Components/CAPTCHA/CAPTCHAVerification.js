import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DeleteAddToCart, getAddtoCart, getAddUpdateOrderItem } from '../../utils/APIURL';
import { getISTDate } from '../../utils/validators';
import { Cart } from '../../utils/Provider/CartContext';

const generateMathQuestion = () => {
    const num1 = Math.floor(Math.random() * 100);
    const num2 = Math.floor(Math.random() * 100);
    return {
        question: `What is ${num1} + ${num2}?`,
        answer: num1 + num2,
    };
};

const CaptchaVerification = () => {
    const location = useLocation();
    const userId = localStorage.getItem("userid");
    const { defaultValuestime } = getISTDate();
    // console.log("🚀 ~ CaptchaVerification ~ location:", location);
    const { cart, setCart } = useContext(Cart);

    const navigate = useNavigate();
    const [captcha, setCaptcha] = useState(generateMathQuestion());
    const [userAnswer, setUserAnswer] = useState('');
    const [message, setMessage] = useState('');
    const [totalAmounts, setTotalAmounts] = useState(0);

    const { book = [], amount = "0.00", qty = 0} = location.state || {};
  
  //const totalAmount = book.reduce((total, b) => total + (b.exRate * (b.quantity || 0)), 0);
  const books = Array.isArray(book) ? book : [book];
  // console.log("🚀 ~ CaptchaVerification ~ books:", books)
  // console.log("🚀 ~ CaptchaVerification ~ totalAmounts:", totalAmounts)
  //const totalAmount = books.reduce((total, b) => total + (b.exRate * (b.quantity || location.state.qty)), 0);
  //console.log("🚀 ~ CaptchaVerification ~ totalAmount:", totalAmount)
  useEffect(()=>{
    setTotalAmounts(location.state.totalAmount);
  },[])

  const handleSubmit = (event) => {
    event.preventDefault();
    if (parseInt(userAnswer, 10) === captcha.answer) {

        saveOrderItem()
        navigate("/order-confirmation");
    } else {
        setMessage('Incorrect answer. Please try again.');
        setCaptcha(generateMathQuestion());
    }
};

  const formDataArray = books.map(b => ({
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

  // console.log("totalAmount", totalAmount, location.state.deliveryAddress)

    const saveOrderItem = async()=>{
        const collectData={
          "orderId": -1,
          "serviceId": 0,
          "orderNo": "",
          "rate": totalAmount ? totalAmount : totalAmounts,
          "dispatchFees": 0,
          "paymentModeId": 0,
          "paymentModeName": 'COD',
          "paymentDate": defaultValuestime,
          "transactionId": '',
          "transactionIdName": "",
          "transactionDate": defaultValuestime,
          "paymentBy": "Cash on Delivery (COD)",
          "paymentStatus": 0,
          "orderStatus": 0,
          "createdBy": userId, 
          "updatedBy": userId,
          "createdOn": defaultValuestime,
          "updatedOn":defaultValuestime,
          address:location.state.deliveryAddress,
          pincode:location.state.pincode,
          contact: location.state.mobileNumber,
          "ordeItemDetails": formDataArray.length > 0 ? formDataArray : location.state.formDataArray
        }
        // console.log("🚀 ~ saveOrderItem ~ collectData:", collectData)
    const response = await getAddUpdateOrderItem(collectData);
    if (response.isSuccess) {
      const cartIdsToRemove = [];
      // console.log("🚀 ~ saveOrderItem ~ cartIdsToRemove:", cartIdsToRemove)

      collectData.ordeItemDetails.forEach(orderItem => {
        const matchingCartItem = cart.find(cartItem => cartItem.contentId === orderItem.itemId);
        // console.log("🚀 ~ saveOrderItem ~ matchingCartItem:", matchingCartItem)
        if (matchingCartItem) {
          cartIdsToRemove.push(matchingCartItem.cartId);
        }
      });
  
      for (const cartId of cartIdsToRemove) {
        const deleteResponse = await DeleteAddToCart(cartId);
        if (deleteResponse.isSuccess) {
          // console.log(`Successfully deleted cartId: ${cartId}`);
          const emptyCart = await getAddtoCart(userId);
          if(emptyCart.isSuccess){
            setCart([]);
          }

        } else {
          // console.error(`Failed to delete cartId: ${cartId}`);
          alert('Failed to delete cart items. Please try again.');
          return; 
        }
      }
      }}

    return (
        <div className="flex items-center justify-center h-[88vh] bg-gray-100">
            <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
                <h1 className="text-2xl font-semibold mb-4">CAPTCHA Verification</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <p className="text-lg mb-2">{captcha.question}</p>
                    <input
                        type="text"
                        placeholder="Enter your answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Verify
                    </button>
                </form>
                {message && <p className="text-red-500 mt-4">{message}</p>}
            </div>
        </div>
    );
};

export default CaptchaVerification;