import React, { useContext, useState, useReducer, useEffect } from 'react';
import { useTheme } from '../utils/Provider/ThemeContext';
import { HOST_URL, previewpath } from '../utils/config';
import axios from 'axios';
import { validateUser, validatePassword, showToast } from '../utils/validators';
import { Link, useNavigate } from 'react-router-dom';
import { Cart } from '../utils/Provider/CartContext'; 
import { fetchAddress, fetchAddresswithunid, getAddtoCart, GetSettingMaster } from '../utils/APIURL';
import { useAuth } from '../utils/Provider/AuthContext';
import logo from '../Asset/Login/images/logo.png';
import starImage from '../Asset/Login/images/star.png';
import library from '../Asset/Login/images/library.jpg';
import { useProfileTheme } from '../utils/Provider/ProfileProvider';

const initialState = {
  isActiveSlider: false,
  isActiveCategory: false,
  noOfCard: 4,
  noOfRow: 0,
  websettingLogo: '',
  names: '',
  webSetting: '',
};

function webSettingReducer(state, action) {
  switch (action.type) {
    case 'SET_WEB_SETTING':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const LoginScreen = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {setProfile} = useProfileTheme();
  const { setCart } = useContext(Cart);
  const [formData, setFormData] = useState({
    user: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    user: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user, login } = useAuth();
  const [state, dispatch] = useReducer(webSettingReducer, initialState);

  useEffect(() => {
    fetchWebSettingData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrors(prevState => ({
      ...prevState,
      [name]: ''
    }));
  };

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (!validateUser(formData.user)) {
      errors.user = '* User name is required';
      valid = false;
    }

    if (!validatePassword(formData.password)) {
      errors.password = '* Password is required';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const fetchGetAddToCartData = async (userid) => {
    try {
      const response = await getAddtoCart(userid); 
      if (Array.isArray(response.data) && response.data.length > 0) {
        const filteredData = response.data.filter(item => {
          const thumbnail = item.thumbnail || '';
          return thumbnail && !thumbnail.toLowerCase().endsWith('.pdf');
        });

        const updatedBooks = filteredData.map((book) => ({
          ...book,
          thumbnail: book.thumbnail ? `${previewpath}${book.thumbnail}` : ''
        }));
        setCart(updatedBooks);
      } else {
        setCart([]); 
      }
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      const loginData = {
        login: formData.user,
        password: formData.password
      };

      const response = await axios.post(`${HOST_URL}Login/Login`, loginData);
      const { data } = response;

      if (data.isSuccess) {
        const output = data.data;
        const uniqueID = output.uniqueId;
        const unme = output.userid;
        const ipAddress = output.ipAddress;
        const imageURL = output.memberPic;
        const res = fetchAddresswithunid(output?.userid, output?.uniqueId);
        console.log(res?.data);
        setProfile(res?.data);

        document.cookie = `uID=${uniqueID}; path=/; secure; samesite=strict`;
        document.cookie = `unme=${unme}; path=/; secure; samesite=strict`;
        document.cookie = `ipa=${ipAddress}; path=/; secure; samesite=strict`;
        document.cookie = `img=${encodeURIComponent(imageURL)}; path=/; secure; samesite=strict`;
        localStorage.setItem('unqiueId', uniqueID);
        localStorage.setItem('userid', unme);
        localStorage.setItem('memPic', imageURL);
        sessionStorage.setItem('memPic', imageURL);
        await fetchGetAddToCartData(unme);
        setMessage('Login successful!');
        login(unme); 
        navigate("/");
      } else {
        setMessage('Invalid username or password.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWebSettingData = async () => {
    try {
      const result = await GetSettingMaster();
      if (result?.data?.length > 0) {
        dispatch({
          type: 'SET_WEB_SETTING',
          payload: {
            webSetting: result.data,
            isActiveSlider: result.data[0].slider,
            isActiveCategory: result.data[0].headerCategoryActive,
            noOfCard: result.data[0].noOfCard,
            noOfRow: result.data[0].noOfRow,
            websettingLogo: logo,
            names: result.data[0].name,
          },
        });
      }
    } catch (error) {
      console.error('Failed to fetch web settings', error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center z-10 bg-transparent">
      
      {/* Form Section */}
      <div className="w-full lg:w-[50%] px-3 py-4 flex justify-center h-screen lg:h-auto">
        <div className="w-full lg:w-[60%] h-full px-3 py-4 rounded-3xl shadow-2xl border-2 border-orange-600">
          <div className="flex justify-center mb-2">
            <img
              src={state.websettingLogo}
              alt="Brand Logo"
              className="w-60 h-48 object-contain cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                id="user"
                name="user"
                type="text"
                value={formData.user}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-3xl focus:ring-2 focus:ring-blue-300 ${theme.textColor} ${theme.fontSize}`}
                placeholder="User Name"
                style={{
                  backgroundImage: `url(${starImage})`,
                  backgroundSize: '20px',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left 10px center',  
                  paddingLeft: '30px'
                }}
              />
              {errors.user && <p className="text-red-500 text-sm">{errors.user}</p>}
            </div>
            <div className="mb-1">
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-3xl focus:ring-2 focus:ring-blue-300 ${theme.textColor} ${theme.fontSize}`}
                placeholder="Password"
                style={{
                  backgroundImage: `url(${starImage})`,
                  backgroundSize: '20px',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left 10px center',  
                  paddingLeft: '30px'
                }}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div className="text-end mb-5">
              <Link to="/change-password" className="text-black hover:underline">Forgot your password?</Link>
            </div>
            <div className='flex items-center justify-between'>
              <button
                type="submit"
                className={`w-[40%] p-2 border-2 border-orange-700 text-black rounded-full shadow-lg transition-all duration-300 ${theme.fontSize}`}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'LogIn'}
              </button>
              {/* <button
                type="submit"
                className={`w-[40%] p-2 border-2 border-orange-700 text-black rounded-full shadow-lg transition-all duration-300 ${theme.fontSize}`}
                disabled={loading}
              >
                Sign Up
              </button> */}
              <button  className={`w-[40%] p-2 border-2 border-orange-700 text-black rounded-full shadow-lg transition-all duration-300 ${theme.fontSize}`}  onClick={() => navigate("/user/signup")}>Sign Up
           </button>
            </div>
          </form>
          {message && <p className={`mt-4 text-center text-red-600`}>{message}</p>}
        </div>
      </div>

      {/* Image Section - Hidden on Mobile */}
      <div className="hidden lg:block w-full lg:w-[50%]">
        <img
          src={library}
          alt="login"
          className="max-h-screen w-full object-cover rounded-tl-3xl rounded-bl-3xl"
        />
      </div>
    </div>
  );
};

export default LoginScreen;



// import React, { useContext, useState, useReducer, useEffect } from 'react';
// import { useTheme } from '../utils/ThemeContext';
// import { HOST_URL, previewpath } from '../utils/config';
// import axios from 'axios';
// import { validateUser, validatePassword, showToast } from '../utils/validators';
// import { Link, useNavigate } from 'react-router-dom';
// import { Cart } from '../utils/CartContext';
// import { getAddtoCart, GetSettingMaster } from '../utils/APIURL';
// import { useAuth } from '../utils/AuthContext';
// import logo from '../Asset/Login/images/logo.png';
// import starImage from '../Asset/Login/images/star.png';
// import library from '../Asset/Login/images/library.jpg';


// const initialState = {
//   isActiveSlider: false,
//   isActiveCategory: false,
//   noOfCard: 4,
//   noOfRow: 0,
//   websettingLogo: '',
//   names: '',
//   webSetting: '',
// };

// function webSettingReducer(state, action) {
//   switch (action.type) {
//     case 'SET_WEB_SETTING':
//       return { ...state, ...action.payload };
//     default:
//       return state;
//   }
// }


// const LoginScreen = () => {
//   const navigate = useNavigate();
//   const { theme } = useTheme();
//   const { setCart } = useContext(Cart);
//   const [formData, setFormData] = useState({
//     user: '',
//     password: ''
//   });
//   const [errors, setErrors] = useState({
//     user: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const {user, login } = useAuth();
//   const [state, dispatch] = useReducer(webSettingReducer, initialState);
//   console.log("🚀 ~ LoginScreen ~ state:", state);


//   useEffect(() => {
//     fetchWebSettingData();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));

//     // Clear errors when user types
//     setErrors(prevState => ({
//       ...prevState,
//       [name]: ''
//     }));
//   };

//   const validateForm = () => {
//     let valid = true;
//     let errors = {};

//     if (!validateUser(formData.user)) {
//       errors.user = '* User name is required';
//       valid = false;
//     }

//     if (!validatePassword(formData.password)) {
//       errors.password = '* Password is required';
//       valid = false;
//     }

//     setErrors(errors);
//     return valid;
//   };

//   const fetchGetAddToCartData = async (userid) => {
//     try {
//       const response = await getAddtoCart(userid); 
//       if (Array.isArray(response.data) && response.data.length > 0) {
//         const filteredData = response.data.filter(item => {
//           const thumbnail = item.thumbnail || '';
//           return thumbnail && !thumbnail.toLowerCase().endsWith('.pdf');
//         });

//         const updatedBooks = filteredData.map((book) => ({
//           ...book,
//           thumbnail: book.thumbnail ? `${previewpath}${book.thumbnail}` : ''
//         }));
//         setCart(updatedBooks);
//       } else {
//         setCart([]); 
//       }
//     } catch (error) {
//       console.error("Failed to fetch cart data:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setLoading(true);
//     setMessage('');

//     try {
//       const loginData = {
//         login: formData.user,
//         password: formData.password
//       };

//       const response = await axios.post(`${HOST_URL}Login/Login`, loginData);
//       const { data } = response;

//       if (data.isSuccess) {
//         const output = data.data;
//         const uniqueID = output.uniqueId;
//         const unme = output.userid;
//         const ipAddress = output.ipAddress;
//         const imageURL = output.memberPic;

//         document.cookie = `uID=${uniqueID}; path=/; secure; samesite=strict`;
//         document.cookie = `unme=${unme}; path=/; secure; samesite=strict`;
//         document.cookie = `ipa=${ipAddress}; path=/; secure; samesite=strict`;
//         document.cookie = `img=${encodeURIComponent(imageURL)}; path=/; secure; samesite=strict`;
//         localStorage.setItem('unqiueId', uniqueID);
//         localStorage.setItem('userid', unme);
//         localStorage.setItem('memPic', imageURL);
//         sessionStorage.setItem('memPic', imageURL);
//         await fetchGetAddToCartData(unme);
//         setMessage('Login successful!');
//         login(unme); 
//         navigate("/");
//       } else {
//         setMessage('Invalid username or password.');
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       setMessage('An error occurred during login. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchWebSettingData = async () => {
//     try {
//       const result = await GetSettingMaster();
//       if (result?.data?.length > 0) {
//         dispatch({
//           type: 'SET_WEB_SETTING',
//           payload: {
//             webSetting: result.data,
//             isActiveSlider: result.data[0].slider,
//             isActiveCategory: result.data[0].headerCategoryActive,
//             noOfCard: result.data[0].noOfCard,
//             noOfRow: result.data[0].noOfRow,
//             // websettingLogo: result.data[0].websideLogo,
//             websettingLogo: logo,
//             names: result.data[0].name,
//           },
//         });
//       }
//     } catch (error) {
//     }
//   };


//   return (
//     <div className={` flex items-center justify-between  z-10 bg-transparent`}>
//       <div className={`w-[50%]  `}>
//       <div className="flex items-center  justify-around  ">
//       <div></div>
//       <div className='w-[60%] h-[65%] px-3 rounded-3xl py-4 shadow-2xl   border-transparent border-2 border-orange-600'>
//         <div className="flex justify-center mb-2">
//           <img
//             src={state.websettingLogo}
//             alt="Brand Logo"
//             className="w-60 h-48 object-contain  cursor-pointer"
//             onClick={() => navigate('/')}
//           />
//         </div>
//         {/* <h2 className={`text-xl font-bold mb-3 text-center ${theme.textColor}`}>Sign-In</h2> */}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             {/* <label className={`block mb-2 ${theme.textColor}`} htmlFor="user">Username</label> */}
//             <input
//               id="user"
//               name="user"
//               type="text"
//               value={formData.user}
//               onChange={handleInputChange}
//               className={`w-full p-2 border rounded-3xl focus:ring-2 focus:ring-blue-300 ${theme.textColor} ${theme.fontSize}`}
//               placeholder="User Name"
//               style={{
//                backgroundImage: `url(${starImage})`,
//                 backgroundSize: '20px',
//                 backgroundRepeat: 'no-repeat',
//                 backgroundPosition: 'left 10px center',  
//                 paddingLeft: '30px'
//               }}
//             />
//             {errors.user && <p className="text-red-500 text-sm">{errors.user}</p>}
//           </div>
//           <div className="mb-1">
//             {/* <label className={`block mb-2 ${theme.textColor}`} htmlFor="password">Password</label> */}
//             <input
//               id="password"
//               name="password"
//               type="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               className={`w-full p-2 border rounded-3xl focus:ring-2 focus:ring-blue-300 ${theme.textColor} ${theme.fontSize}`}
//               placeholder="Password"
//               style={{
//                backgroundImage: `url(${starImage})`,
//                 backgroundSize: '20px',
//                 backgroundRepeat: 'no-repeat',
//                 backgroundPosition: 'left 10px center',  
//                 paddingLeft: '30px'
//               }}
//             />
//             {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
//           </div>
//         <div className="text-end mb-5">
//           <Link to="/forgot-password" className="text-black hover:underline">Forgot your password?</Link>
//         </div>
//         <div className='flex items-center justify-around'>
//           <button
//             type="submit"
//             className={`w-[40%] p-2 border-2 border-orange-700 text-black rounded-full shadow-lg  transition-all duration-300 ${theme.fontSize}`}
//             disabled={loading}
//           >
//             {loading ? 'Signing In...' : 'LogIn'}
//           </button>
//           <button
//             type="submit"
//             className={`w-[40%] p-2  border-2 border-orange-700 text-black rounded-full shadow-lg  transition-all duration-300 ${theme.fontSize}`}
//             disabled={loading}
//           >
//             Sign Up
//           </button>
//           </div>
//         </form>
//         {message && <p className={`mt-4 text-center text-red-600`}>{message}</p>}
//         <div class="max-w-2xl mx-auto mt-2 text-center bg-[#fcfcfa] text-[#818078] font-sans">
//         </div>
//         {/* <div className="mt-4 text-center">
//           <p className="text-gray-600">New to us? {" "}
//             <Link to="/user/signup" className="text-blue-600 hover:underline">Create an account</Link>
//           </p>
//         </div> */}
//         </div>
//         </div>
//       </div>        

//       <div className='w-[50%]'>
//         <img src={library} alt='login' className=' max-h-screen rounded-tl-3xl rounded-bl-3xl object-fit w-full'/>
//       </div>


//     </div>
//   );
// };

// export default LoginScreen;