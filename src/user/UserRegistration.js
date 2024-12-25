import React, { useContext, useState, useReducer, useEffect  } from 'react';
import logo from '../Asset/Navbar/images/newLogo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AnimationWave from '../utils/WaveAnimation/AnimationWave';
import { getAddUpdateUserRegistration, GetMemberCode, GetSettingMaster } from '../utils/APIURL';
import ReToastContainer from '../utils/ToastContainer/CustomToast';
import { showToast } from '../utils/validators';
import { useNavigate } from 'react-router-dom';
import { previewpath } from '../utils/config';
import userImg from '../Asset/Login/images/userreg.jpg';



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

const UserRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userId: '-1',
        userName: '',
        mobileNo: '',
        email: '',
        password: '',
        permanentAddress: '',
        alternetAddress: '',

    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const [state, dispatch] = useReducer(webSettingReducer, initialState);
    // console.log("🚀 ~ LoginScreen ~ state:", state);


  useEffect(() => {
    fetchWebSettingData();
  }, []);

   

    const validateField = (name, value) => {
        let error = '';

        const isRequired = (field) => !field && 'This field is required';
        const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
        const isPasswordStrong = (password) => {
            const checks = [
                /[A-Z]/.test(password),
                /[a-z]/.test(password),
                /\d/.test(password),
                /[!@#$%^&*]/.test(password),
                password.length >= 8
            ];
            return checks.every(Boolean);
        };

        switch (name) {
            case 'userName':
                error = isRequired(value) || '';
                break;
            // case 'permanentAddress':
            //     error = isRequired(value) || '';
            //     break;
            case 'mobileNo':
                if (isRequired(value)) {
                    error = isRequired(value);
                } else if (value.length !== 10) {
                    error = '* Mobile Number should be exactly 10 digits.';
                } else if (!/^\d+$/.test(value)) {
                    error = '* Mobile Number should contain only digits.';
                }
                break;
            case 'email':
                error = isRequired(value) || (!isEmailValid(value) && '* Email address is invalid');
                break;
            case 'password':
                if (isRequired(value)) {
                    error = isRequired(value);
                    setPasswordStrength(0);
                } else {
                    const strength = calculatePasswordStrength(value);
                    setPasswordStrength(strength);
                    if (!isPasswordStrong(value)) {
                        error = '* Password must include at least: ';
                        if (!/[A-Z]/.test(value)) error += 'an uppercase letter, ';
                        if (!/[a-z]/.test(value)) error += 'a lowercase letter, ';
                        if (!/\d/.test(value)) error += 'a number, ';
                        if (!/[!@#$%^&*]/.test(value)) error += 'a special character, ';
                        if (value.length < 8) error += 'and must be at least 8 characters long.';
                        error = error.replace(/,\s*$/, '') + '.';
                    }
                }
                break;
            default:
                break;
        }

        return error;
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[a-z]/.test(password)) strength += 20;
        if (/\d/.test(password)) strength += 20;
        if (/[!@#$%^&*]/.test(password)) strength += 20; 
        return Math.min(strength, 100);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        const error = validateField(name, value);
        setErrors({
            ...errors,
            [name]: error,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const validationErrors = {};

        Object.keys(formData).forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) {
                validationErrors[field] = error;
            }
        });

        const strength = calculatePasswordStrength(formData.password);
        setPasswordStrength(strength);
        if (strength < 100) {
            validationErrors.password = 'Password must include uppercase letters, lowercase letters, numbers, and special characters';
        }

        if (Object.keys(validationErrors).length === 0) {

            const collectData = {
                usercode: formData.userName,
                userid: formData.userName,
                firstname: formData.userName,
                email2: formData.email,
                phone2: formData.mobileNo,
                passwd: formData.password,
                memberPic: "",
                image_status: "",
                instId: 10
            };
            

            const response = await getAddUpdateUserRegistration(collectData)
            if (response.isSuccess) {
                showToast('success', `${response.mesg}`);
                setTimeout(() => {
                    let path = '/userlogin';
                    navigate(path)
                }, 1500);
            } else {
                showToast('error', `${response.mesg}`)
            }
            // alert('Form data submitted: ' + JSON.stringify(formData, null, 2));
        } else {
            setErrors(validationErrors);
        }

        setLoading(false);
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
            websettingLogo: result.data[0].websideLogo,
            names: result.data[0].name,
          },
        });
      }
    } catch (error) {
      // console.error('Error fetching web settings:', error);
    }
  };


    return (
        <div className="relative  overflow-hidden" style={{ backgroundImage: `url(${userImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'  }}>
            {/* <AnimationWave /> */}
            <div className="min-h-screen flex items-center justify-center relative p-4 z-10 ">
                <div className="w-full max-w-md shadow-md border-2 border-white rounded-xl px-7 backdrop-blur-sm py-1">
                    <img src={`${previewpath}${state.websettingLogo}`} alt='Library Ed-Commerce' className='w-44 h-24 mx-auto cursor-pointer'  onClick={() => navigate('/')} />
                    <h2 className="text-2xl font-bold mb-1 text-white text-center">Create an Account</h2>
                    <h2 className='mb-2 text-center italic text-white'>Aadyathmik Library</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 ">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-white">User Name :</label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${errors.userName ? 'border-red-700' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="Enter username"
                            />
                            {errors.userName && <p className="text-red-700 text-sm mt-1">{errors.userName}</p>}
                        </div>
                        <div>
                            <label htmlFor="mobileNo" className="block text-sm font-medium text-white">Contact Number :</label>
                            <input
                                type="text"
                                id="mobileNo"
                                name="mobileNo"
                                value={formData.mobileNo}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${errors.mobileNo ? 'border-red-700' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="Enter Mobile No"
                            />
                            {errors.mobileNo && <p className="text-red-700 text-sm mt-1">{errors.mobileNo}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white">Email Address :</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${errors.email ? 'border-red-700' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="Enter email"
                            />
                            {errors.email && <p className="text-red-700 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white">Password :</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-2xl shadow-sm sm:text-sm ${errors.password ? 'border-red-700' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                    placeholder="Enter Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-700 text-sm mt-1">{errors.password}</p>}
                            <div className="mt-2 h-2 bg-gray-300 rounded">
                                <div
                                    style={{ width: `${passwordStrength}%` }}
                                    className={`h-full ${passwordStrength < 100 ? 'bg-red-700' : 'bg-green-700'} rounded`}
                                ></div>
                            </div>
                            <p className="text-white text-sm mt-1">Password strength: {passwordStrength}%</p>
                        </div>
                        {/* <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">Confirm Password :</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="Enter Confirm Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                {showConfirmPassword ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div> */}
                        {/* <div>
                        <label htmlFor="permanentAddress" className="block text-sm font-medium text-white">Permanent Address :</label>
                        <input
                            type="text"
                            id="permanentAddress"
                            name="permanentAddress"
                            value={formData.permanentAddress}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${errors.permanentAddress ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="Enter Permanent Address"
                        />
                        {errors.permanentAddress && <p className="text-red-500 text-sm mt-1">{errors.permanentAddress}</p>}
                    </div>
                    <div>
                        <label htmlFor="alternetAddress" className="block text-sm font-medium text-white">Communication Address :</label>
                        <input
                            type="text"
                            id="alternetAddress"
                            name="alternetAddress"
                            value={formData.alternetAddress}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${errors.alternetAddress ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="Enter Communication Address"
                        />
                        {errors.alternetAddress && <p className="text-red-500 text-sm mt-1">{errors.alternetAddress}</p>}
                    </div> */}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Sign-up'}
                        </button>
                    </form>
                </div>
            </div>
            <ReToastContainer />
        </div>
    );
};

export default UserRegistration;