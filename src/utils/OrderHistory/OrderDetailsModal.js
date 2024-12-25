import React, { useEffect, useState } from 'react';
import { getCommDigitalContent } from '../APIURL';
import ReToastContainer from '../ToastContainer/CustomToast';
import { toast } from 'react-toastify';
import { previewpath } from '../config';
import { RiCloseCircleLine } from "react-icons/ri";

const ItemDetailsModal = ({ item, onClose }) => {
  const [productDetail, setProductDetail] = useState(null);

  useEffect(() => {
    if (item) {
      fetchDataById(item?.itemId);
    } else {
      setProductDetail(null); 
    }
  }, [item]);

  const showToast = (type, message) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3500,
      pauseOnHover: true,
      draggable: true,
      newestOnTop: false,
      theme: "light",
    });
  };

  const fetchDataById = async (id) => {
    const result = await getCommDigitalContent(id, -1,0);
    if (result.isSuccess) {
      setProductDetail(result.data);
    } else {
      showToast('error', result.mesg);
    }
  };

  if (!item) return null; 

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto z-10 p-2">
        <button 
          className="py-2 px-4 text-blue-500 rounded" 
          onClick={onClose} >
          <RiCloseCircleLine size={25}/>
        </button>

        <div className="mt-2 p-2">
          <p className="text-xl text-purple-600 font-semibold">Receipt</p>
          {productDetail && productDetail.length > 0 && (
  <OrderItem 
    imageUrl={productDetail[0]['thumbnail'] ? `${previewpath}${productDetail[0]['thumbnail']}` : ''}
    title={productDetail[0]['title']}
    quantity={item.quantity}
    price={item.rate}
  />
)}
          {/* {productDetail && (
            <OrderItem 
              imageUrl={productDetail[0]['thumbnail']?`${previewpath}${productDetail[0]['thumbnail']}`:''}
              title={productDetail[0]['title']}
              quantity={item.quantity}
              price={item.rate}
            />
          )} */}

          {/* Progress Line */}
          {/* <div className="mt-8">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order Placed</span>
              <span className="text-gray-600">Out for Delivery</span>
              <span className="text-gray-600">Delivered</span>
            </div>
            <div className="relative h-1 bg-gray-300 rounded">
              <div
                className="absolute left-0 top-0 h-full bg-purple-600 rounded"
                style={{ width: "65%" }}
              ></div>
            </div>
          </div> */}

          {/* Order Details */}
          <OrderDetails item={item} />

          <div className="bg-purple-600 border-0 px-6 py-5 rounded-lg">
            <h5 className="flex items-center justify-between text-white text-lg font-semibold">
              Total paid: <span className="text-2xl ml-2">₹{' '}{item.amount}</span>
            </h5>
          </div>
        </div>
      </div>
      <ReToastContainer />
    </div>
  );
};

const OrderDetails = ({item}) => (
  <>
    <div className="flex justify-between pt-4">
      <p className="font-bold mb-0">Order Details</p>
      <p className="text-gray-700 mb-0">
        <span className="font-bold mr-4">Total</span> ₹ {item.amount}
      </p>
    </div>
    {/* <div className="flex justify-between pt-2">
      <p className="text-gray-500 mb-0"></p>
      <p className="text-gray-500 mb-0">
        <span className="font-bold mr-4">Discount</span> ₹{' '}{item.discountAmount}
      </p>
    </div> */}
    {/* <div className="flex justify-between">
      <p className="text-gray-500 mb-0"></p>
      <p className="text-gray-500 mb-0">
        <span className="font-bold mr-4">GST </span> --
      </p>
    </div> */}
    <div className="flex justify-between mb-5">
      <p className="text-gray-500 mb-0"></p>
      {/* <p className="text-gray-500 mb-0">Receipts Voucher: 18KU-62IIK</p> */}
      <p className="text-gray-500 mb-0">
        <span className="font-bold mr-4">Delivery Charges</span> Free
      </p>
    </div>
  </>
);

const OrderItem = ({ imageUrl, title, quantity, price }) => (
  <div className="bg-gray-100 rounded-lg p-4 mb-4 shadow-xl">
    <div className="flex">
      <img src={imageUrl} className="w-1/6 rounded-lg" alt={title} />
      <div className="flex-1 p-4">
        <h6 className="text-gray-800 font-semibold">{title}</h6>
        <p className="text-gray-500">Qty: {quantity}</p>
        <p className="text-gray-800 font-bold">₹{' '}{price}</p>
      </div>
    </div>
  </div>
);

export default ItemDetailsModal;
