import React, { useState } from 'react';
import { useTheme } from '../utils/Provider/ThemeContext';
import donatecenterscreen from '../Asset/Donate/Images/donatecenterscreen.png';
import donatesidescreen from '../Asset/Donate/Images/donatesidescreen.png';
import donategita from '../Asset/Donate/Images/donategita.png';
import axios from 'axios';
import { HOST_URL } from './config';
import { getISTDate } from './validators';
import NotificationSnackbar from './NotificationSnackbar';

const Donate = () => {
  const {defaultValuestime} = getISTDate();
  const [showDonateForm, setShowDonateForm] = useState(false); 
  const [amount, setAmount] = useState(""); 
  const [name, setName] = useState("");    
  const [email, setEmail] = useState("");    
  const [remark, setRemark] = useState("");   
  const [error, setError] = useState("");  
  const [donationType, setDonationType] = useState("once");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { theme } = useTheme();

  const showForm = () => {
    setShowDonateForm(true); 
  };

  const showOriginalUI = () => {
    setShowDonateForm(false); 
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      setAmount(value);
    } else if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "remark") {
      setRemark(value);
    }

    if (name === "amount") {
      if (isNaN(value) || parseInt(value) <= 0) {
        setError("Please enter a valid amount greater than 0.");
      } else {
        setError("");
      }
    }
  };
  const handleProceed = async (e) => {
    e.preventDefault(); 
    
    if (!amount || !name || !email || !remark) {
      setError("Please fill in all fields.");
      return;
    }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

    console.log(name, email, amount);

    if (donationType) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.addEventListener("load", () => {
        const options = {
          key: 'rzp_test_UmUIzzSAIdrrTV',
          amount: amount * 100, 
          currency: 'INR',
          name: 'MSSPL',
          description: `Sahayog Rashi`,
          handler: function (response) {
            console.log(response)
            handleSubmit(response.razorpay_payment_id);
          },
          prefill: {
            name: name,
            email: email,
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

  const handleSubmit = (paymentID) => {
    // Handle submission logic after Razorpay payment
    let collectData = {
      "id": -1,
      "donarName": name,
      "email": email,
      "amount": amount,
      "donationTypeId": 1,
      "donationTypeName": donationType,
      "paymentDate":defaultValuestime,
      "transactionId": paymentID,
      "transactionIdName": "",
      "transactionDate": defaultValuestime,
      "remark": remark,
      "createdBy": name,
      "updatedBy": name,
      "createdOn": defaultValuestime,
      "updatedOn": defaultValuestime
    }

    axios.post(`${HOST_URL}Donation/AddUpdateDonation`, collectData)
      .then(response => {
        console.log("Donation submitted:", response);
        if(response?.data?.isSuccess){
          setSnackbarMessage(response.data.mesg);
          setSnackbarSeverity('success');
          setAmount("");
          setName("");
          setEmail("");
          setRemark("");
        }else{
          setSnackbarMessage(`error`);
          setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);

      })
      .catch(error => {
        console.log("Error submitting donation:", error);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center z-10 bg-transparent my-2">
       {showDonateForm ? (
        // If donate form UI is shown
        <div className="w-full  py-4 flex justify-center items-center h-screen lg:h-auto">
        <form onSubmit={handleProceed} className="w-full py-4 flex justify-center h-screen lg:h-auto">
          <div className="w-full flex flex-col items-center justify-center h-full py-4">
          
          {/* <div className="flex justify-center mb-4">
            <div
              onClick={() => setDonationType("once")}
              className={`px-6 py-2 mx-2 cursor-pointer text-xl font-semibold rounded-xl ${
                donationType === "once" ? "bg-orange-500 text-white" : "bg-gray-200"
              }`}
            >
              Give Once
            </div>
            <div
              onClick={() => setDonationType("monthly")}
              className={`px-6 py-2 mx-2 cursor-pointer text-xl font-semibold rounded-xl ${
                donationType === "monthly" ? "bg-orange-500 text-white" : "bg-gray-200"
              }`}
            >
              Monthly 
            </div>
          </div> */}
              <h3 className='mb-3'>Please share some details for Sahayog Rashi</h3>

            <input 
              type="text"
              placeholder="Enter Name"
              aria-label="Enter Name"
              value={name}
              name='name'
              onChange={handleInput}
              className="border-2 border-gray-400 p-1 px-4 rounded-lg mb-2"
            />
            <input 
              type="email"
              name='email'
              placeholder="Enter Email"
              aria-label="Enter Email"
              value={email}
              onChange={handleInput}
              className="border-2 border-gray-400 p-1 px-4 rounded-lg mb-2"
            />
             <input 
              type="text"
              placeholder="Enter your Sahayog Rashi"
              aria-label="Enter your Sahayog Rashi"
              value={amount}
              name='amount'
              onChange={handleInput}
              className="border-2 border-gray-400 p-1 px-4 rounded-lg mb-2"
            />
            <input 
              type="text"
              placeholder="Enter Remark"
              aria-label="Enter Remark"
              value={remark}
              name='remark'
              onChange={handleInput}
              className="border-2 border-gray-400 p-1 px-4 rounded-lg mb-2"
            />

            {error && <div className="text-red-500 mb-2">{error}</div>} 

                <div className='flex items-center justify-between gap-5'>
            <button  type="submit" className="font-semibold text-sm border-2 border-orange-600 p-2 rounded-2xl cursor-pointer" >
              Submit 
            </button>

            <div className="font-semibold text-sm border-2 border-orange-600 p-2 rounded-2xl cursor-pointer" onClick={showOriginalUI}>
              Back to Main Page
            </div>

            </div>
          </div>
          </form>

          <div className="hidden lg:block w-full lg:w-[50%]">
            <img
              src={donategita}
              alt="donategita"
              className="max-h-screen w-full object-cover rounded-tl-3xl rounded-bl-3xl"
            />
          </div>
        </div>
      ) : (
        // Original UI (before donate form is shown)
        <>
          {/* Tabs Section */}
          

          {/* Form Section */}
          <div className="w-full lg:w-[50%] px-3 py-4 flex justify-center h-screen lg:h-auto">
            <div className="w-full flex flex-col items-center justify-center h-full px-3 py-4 rounded-3xl shadow-2xl">
              <span className="font-bold text-xl border-2 border-orange-600 p-2 rounded-xl">जय श्री राम</span>
              
              <img
                src={donatecenterscreen}
                alt="donatecenterscreen"
                className="h-[65%] object-cover rounded-tl-3xl rounded-bl-3xl"
              />
              
              <div className="text-xl m-2 text-center">
                Your generosity fuels the light of knowledge and wisdom. Together, let's inspire minds and uplift souls
              </div>
              
              <div className="font-bold text-xl border-2 border-orange-600 p-2 rounded-2xl cursor-pointer" onClick={showForm}>
              Sahayog Rashi
              </div>
            </div>
          </div>

          {/* Image Section - Hidden on Mobile */}
          <div className="hidden lg:block w-full lg:w-[50%]">
            <img
              src={donatesidescreen}
              alt="donatesidescreen"
              className="max-h-screen w-full object-cover rounded-tl-3xl rounded-bl-3xl"
            />
          </div>
        </>
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

export default Donate;