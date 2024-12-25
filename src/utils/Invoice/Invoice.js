import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TableFooter } from '@mui/material';
import { GetOrderItem } from '../APIURL';
import dayjs from 'dayjs';
import html2canvas from "html2canvas";
import { FaFileDownload } from "react-icons/fa";
import * as ReactDOM from 'react-dom/client';   

const Invoice = ({ invoiceData }) => {
  const [order, setOrder] = useState(null);
  const invoiceRef = useRef();
  const downloadButtonRef = useRef();
  const [loading, setLoading] = useState(false);
  console.log(invoiceData)
  console.log(order)

  useEffect(() => {
    let userId = localStorage.getItem('userid');
    if (invoiceData) {
      GetOrderById(invoiceData?.orderId, userId);
    }
  }, []);

  const GetOrderById = async (id1, id2) => {
    const response = await GetOrderItem(id1, id2);
    if (response.isSuccess && response.data.length > 0) {
      setOrder(response.data[0]); 
      // handleInvoiceDownload();
    } else {
      setOrder(null);
    }
  };

  const calculateTotals = () => {
    let totalTax = 0;
    let totalNetAmount = 0;
    let totalDiscount = 0;

    if (order && order.ordeItemDetails) {
      order.ordeItemDetails.forEach(item => {
        totalTax += item.taxRate || 0;  
        totalNetAmount += item.netAmount || 0;
        totalDiscount += item.discount || 0;
      });
    }

    return { totalTax, totalNetAmount, totalDiscount };
  };

  const { totalTax, totalNetAmount, totalDiscount } = calculateTotals();
  
  const getUniqueIdentifier = () => {
  const createdOn = dayjs(order?.createdOn || new Date()).format('YYYYMMDD');
  return `ORNO-${order?.orderId || 'N/A'}-${createdOn}`;
};

const handleInvoiceDownload = async () => {
  if (!invoiceRef.current) return;

  if (downloadButtonRef.current) {
    downloadButtonRef.current.style.display = 'none';
  } 
  setLoading(true); // Set loading state to true
  try {
    const canvas = await html2canvas(invoiceRef.current);
    const imgData = canvas.toDataURL("image/png");
    const fileName = `${order?.updatedBy}_${order?.pincode}_${order?.orderId}.pdf`;

    const pdf = new jsPDF();
    const imgWidth = 190;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      position = heightLeft - imgHeight;
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } finally {
    if (downloadButtonRef.current) {
      downloadButtonRef.current.style.display = 'block';
    }
    setLoading(false); 
  }
};
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md my-5">
     <div>
          {loading ? (
            <p className="text-center text-blue-700">Generating PDF...</p>
          ) : (
            <div className='flex items-center justify-end gap-2'>
            <h1>Download Invoice :</h1>
            <Button
              variant="contained"
              onClick={handleInvoiceDownload}
              ref={downloadButtonRef}
            >
              <FaFileDownload /> {" "} Report
            </Button>
            </div>
          )}
        </div>

      <div ref={invoiceRef} className="p-8 bg-white text-black">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">Bill of Supply</h1>
        <p className="text-center text-gray-500">(Original for Recipient)</p>

        <div className="border-t border-gray-200 my-4"></div>
        <h2 className="text-lg font-bold mb-4">Order Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <p><strong>Order Number:</strong> {order ?  getUniqueIdentifier() : '--'}</p>
          <p><strong>Order Date:</strong> {order ? dayjs(order?.transactionDate).format('DD-MMM-YYYY') : 'N/A'}</p>
          <p><strong>Invoice Details:</strong> {order ? order.transactionId : 'Offline'}</p>
          <p><strong>Payment Mode:</strong> {order ? (order.paymentModeName === 'COD' ? "Cash on Delivery" : "Online") : '--'}</p>
          <p><strong>Invoice Date:</strong> {order ? dayjs(order.paymentDate).format("DD-MMM-YYYY") : '--'}</p>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <h2 className="text-lg font-bold mb-4">Product Details</h2>
        <TableContainer component={Paper} >
          <Table>
            <TableHead>
              <TableRow >
                <TableCell className='bg-blue-500 text-white font-semibold'>Sr. No</TableCell>
                <TableCell className='bg-blue-500 text-white font-semibold'>Item Name</TableCell>
                <TableCell className='bg-blue-500 text-white font-semibold'>Unit Price</TableCell>
                <TableCell className='bg-blue-500 text-white font-semibold'>Qty</TableCell>
                <TableCell className='bg-blue-500 text-white font-semibold'>Amount</TableCell>
                <TableCell className='bg-blue-500 text-white font-semibold'>Tax Amt.</TableCell>
                <TableCell className='bg-blue-500 text-white font-semibold'>Dis Amt.</TableCell>
                <TableCell className='bg-blue-500 text-white font-semibold'>Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order && order.ordeItemDetails ? (
                order.ordeItemDetails.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className='bg-white' align='right'>{index + 1}</TableCell>
                    <TableCell className='bg-white'>{item.itemNames || '--'}</TableCell>
                    <TableCell className='bg-white ' align='right'>₹ {' '} {item.rate || 0.00}</TableCell> 
                    <TableCell className='bg-white ' align='right'>{item.quantity ?? 0.00}</TableCell>
                    <TableCell className='bg-white ' align='right'>₹ {' '}{item.amount ?? 0.00}</TableCell>
                    <TableCell className='bg-white ' align='right'>₹ {' '}{item.taxRate ?? 0.00}</TableCell>
                    <TableCell className='bg-white ' align='right'>₹ {' '}{item.discount ?? 0.00}</TableCell> 
                    <TableCell className='bg-white ' align='right'>₹ {' '}{item.netAmount ?? 0.00}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="8" className="text-center bg-white">No product details available</TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow className=''>
                <TableCell colSpan="7" align="right" className='text-black text-semibold bg-white !p-2'>Total Tax Amount</TableCell>
                <TableCell align="right" className='text-black text-semibold bg-white !p-2 '>₹{totalTax.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan="7" align="right" className='text-black text-semibold bg-white  !p-2'><strong>Total Discount Amount</strong></TableCell>
                <TableCell align="right" className='text-black text-semibold bg-white  !p-2'>₹{totalDiscount.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan="7" align="right" className='text-black text-semibold bg-white  !p-2'><strong>Total Net Amount</strong></TableCell>
                <TableCell align="right" className='text-black text-semibold bg-white  !p-2'>₹{totalNetAmount.toFixed(2)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        <div className="border-t border-gray-200 my-4"></div>

        {/* Billing and Shipping Addresses */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div> 
            <h3 className="font-bold">Billing Address:</h3>
            <p>{order ? order.address : '--'}</p>
            <p>{order ? order.pincode : '--'}</p>
          </div>
          <div>
            <h3 className="font-bold">Shipping Address:</h3>
            <p>{order ? order.address : '--'}</p>
            <p>{order ? order.pincode : '--'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
        <div className="border-t border-gray-200 my-4"></div>

        <p className="text-sm">Place of Supply: UTTAR PRADESH</p>
        <p className="text-sm">Place of Delivery: UTTAR PRADESH</p>
        </div>
        <div>
        <div className="border-t border-gray-200 my-4"></div>

        <p className="text-sm">Mode of Payment: {order ? order.paymentModeName : 'N/A'}</p>
        <p className="text-sm">Invoice Value: ₹{totalNetAmount ? totalNetAmount.toFixed(2) : '0.00'}</p>
        </div>
        </div>
        <p className="text-center text-gray-500 text-xs mt-4">This invoice is not a demand for payment.</p>

       
      </div>
    </div>
  );
};

export default Invoice;