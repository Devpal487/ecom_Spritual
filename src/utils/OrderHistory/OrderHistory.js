import React, { useEffect, useState } from 'react';
import ItemDetailsModal from './OrderDetailsModal';
import { getAddUpdateOrderItem, GetOrderItem, GetOrderItemFile } from '../APIURL';
import dayjs from 'dayjs';
import NotificationSnackbar from '../NotificationSnackbar';
import { HiOutlineDocumentDownload } from "react-icons/hi";
import Invoice from '../Invoice/Invoice';
import invoice from '../../Asset/Navbar/images/invoice.png'
import {defaultValuestime} from '../../utils/validators'
import html2canvas from "html2canvas";
import * as ReactDOM from 'react-dom/client';
import jsPDF from 'jspdf';
import Loading from '../Loader/Loading';

const OrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userId, setUserId] = useState('');
  const [orderData, setOrderData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [order, setOrder] = useState(null);
  const [isReportLoading, setIsReportLoading ] = useState(false);


  useEffect(() => {
    const uid = localStorage.getItem('userid');
    setUserId(uid);
    fetchOrderHistory(uid);
  }, []);

  const fetchOrderHistory = async (uid) => {
    const response = await GetOrderItem(-1, uid);
    if (response.data.length > 0) {
      setOrderData(response.data);
    } else {
      // alert("Network issues");
    }
  };

  const handleOrderClick = async (order) => {
    if (order.orderId) {
      const response = await GetOrderItem(order.orderId, userId);
      if (response.data.length > 0) {
        setSelectedOrder(response.data);
      } else {
        // alert("Network issues");
      }
    }
  };

  const handleItemClick = (item) => {
    console.log("🚀 ~ handleItemClick ~ item:", item)
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null); 
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleStatusUpdate = async (orderId, action) => {
    console.log("Updating status for order ID:", orderId);
    const response = await GetOrderItem(orderId?.orderId, userId);
    console.log("response by orderid", response.data);

    if (response.data.length > 0) {
      const orderToUpdate = response.data[0];
      
      let updatedOrder;
      if (action === 'return') {
        updatedOrder = {
          ...orderToUpdate,
          orderStatus: 7, 
          status: "Returned" 
        };
      } else if (action === 'cancel') {
        updatedOrder = {
          ...orderToUpdate,
          orderStatus: 9,
          status: "Cancelled" 
        };
      }

      const result = await getAddUpdateOrderItem(updatedOrder);
      console.log("check prop", result);
      if (result.isSuccess){
        setSnackbarMessage(result.mesg);
        const response =   await GetOrderItem(-1, userId);
        if (response.data.length > 0) {
          setOrderData(response.data);
        } 
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      }else{
        setSnackbarMessage(result.mesg);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      }
    }
  }

  const handleInvoiceDownload = async (order) => {
    setIsReportLoading(true);
    try {
    const response =   await GetOrderItemFile(order?.orderId , userId);
    setOrder(response);
    window.open(`data:application/pdf; base64,${response}`)
    }catch (error) {
    } finally {
      setIsReportLoading(false);
      // setOrder(null);
    }
  };


  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      <div className="overflow-x-auto max-h-[470px] relative">
      <table className=" shadow-md rounded-lg border bg-white overflow-hidden w-full my-5">
        <thead className="sticky top-0 bg-white z-10">
          <tr>
            <th className="py-3 px-4 text-center" style={{ width: '5%' }}>Order ID</th>
            <th className="py-3 px-4 text-center" style={{ width: '10%' }}>Date</th>
            <th className="py-3 px-4 text-center" style={{ width: '10%' }}>Total</th>
            <th className="py-3 px-4 text-center" style={{ width: '15%' }}>Payment Mode</th>
            <th className="py-3 px-4 text-center" style={{ width: '15%' }}>Status</th>
            <th className="py-3 px-4 text-center" style={{ width: '30%' }}>Remark</th>
            <th className="py-3 px-4 text-center" style={{ width: '15%' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orderData.map((order, index) => (
            <tr 
              key={order.orderId} 
              className="hover:bg-gray-100 cursor-pointer" 
            >
              <td className="py-3 px-4 border-b border-gray-300 border-[1px] text-center" >{index + 1}</td>
              <td className="py-3 px-4 border-b border-gray-300 border-[1px] text-center  text-blue-600 underline cursor-pointer" onClick={() => handleOrderClick(order)}>{dayjs(order.paymentDate).format('DD-MMM-YYYY')}</td>
              <td className="py-3 px-4 border-b border-gray-300 border-[1px] text-right">₹ {order.rate? order.rate.toFixed(2) : 0.00}</td>
              <td className="py-3 px-4 border-b border-gray-300 border-[1px] text-right"> {order.paymentModeName === 'COD' ? "Cash on Delivery" : 'Online Banking' }</td>
              <td className="py-3 px-4 border-b border-gray-300 border-[1px] text-center">{order.status || "--"}</td>
              <td className="py-3 px-4 border-b border-gray-300 border-[1px] text-center">{order.remark || "--"}</td>
              <td className="py-3 px-4 border-b border-gray-300 border-[1px] text-center grid grid-cols-2 items-center gap-5">
              {order.orderStatus === 6 ? (
                <p className="bg-red-500 text-white rounded" onClick={(event) => {event.stopPropagation(); handleStatusUpdate(order, 'return');}}>Return</p>
              ) : order.orderStatus === 5 ? (
                <p className="bg-gray-500 text-white  rounded" onClick={(event)=> {event.stopPropagation(); handleStatusUpdate(order, 'cancel');}}>Cancel</p>
              ) : <></>}

                {<img src={invoice} className='hover:text-green-700' width={25}  onClick={(e) => { handleInvoiceDownload(order) }} />}
              </td>
            </tr> 
          ))}
        </tbody>
      </table>
    </div>

      {selectedOrder && (
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {selectedOrder[0]['ordeItemDetails']?.map((item, index) => (
            <div 
              key={index} 
              className="border rounded-xl p-4 cursor-pointer bg-gray-50 hover:bg-gray-200 transition duration-200" 
              onClick={() => handleItemClick(item)}>
              <h3 className="font-bold">#{item.itemId}</h3>
              <p>Price: {item.rate}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Net Amount: ₹{item.amount ? item.amount.toFixed(2) : 0.00}</p>
            </div>
          ))}
        </div>
      )}

     {isReportLoading ? (
                    <div>
                      <Loading />
                    </div>
                  ) : order ? (
                    <div className='my-5'>
                    <embed
                      src={`data:application/pdf; base64,${order}`}
                      type="application/pdf"
                      style={{
                        width: "100%",
                        height: "75vh",
                      }}
                    />
                    </div>
                  ) : (
                    <h3></h3>
                  )}

      <ItemDetailsModal item={selectedItem} onClose={closeModal} />

      <NotificationSnackbar
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default OrderHistory;