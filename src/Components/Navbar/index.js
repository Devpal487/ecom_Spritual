import React, { useEffect, useState, useContext } from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonIcon from '@mui/icons-material/Person';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/Provider/ThemeContext";
import api, { HOST_URL } from "../../utils/config";
import { getCommDigitalContent } from "../../utils/APIURL";
import CartBadge from '../../utils/CartBadge';
import { Cart } from "../../utils/Provider/CartContext";
import { RiShoppingBag3Fill } from "react-icons/ri";
import axios from "axios";
import ReToastContainer from "../../utils/ToastContainer/CustomToast";
import { toast } from "react-toastify";
import {previewpaththeme} from "../../utils/config";
import logout from '../../Asset/Navbar/images/logout.png';
import login from '../../Asset/Navbar/images/enter.png';
import regis from '../../Asset/Navbar/images/add-user.png';
import donate from '../../Asset/Navbar/images/donation.png';
import blog from '../../Asset/Navbar/images/blog.png';
import userImg from '../../Asset/ImageSlider/images/logo.8e56307691595ef5fc05.png'
import { useProfileTheme } from "../../utils/Provider/ProfileProvider";

const NavBar = ({websettingLogo}) => {
    const navigate = useNavigate();
    const themeMaster = useTheme();
    const {profile} = useProfileTheme();
    const { cart, setCart } = useContext(Cart);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdown1, setShowDropdown1] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const memImg = profile?.memberPic ? `data:image/jpg;base64,${profile.memberPic}` : userImg;

    let unmeValue = localStorage.getItem('unqiueId');

    useEffect(() => {
        getDataforFilter();
    }, []);


    const handleout = () => {
        const userid = localStorage.getItem('userid');
        const uniqueID = localStorage.getItem('unqiueId');
        getUserLogOut(userid, uniqueID);
    };

    const clearSpecificCookies = (cookieNames) => {
        cookieNames.forEach(cookieName => {
            document.cookie = `${cookieName}=; expires=session; path=/`;
        });
    };

    const getUserLogOut = async (userId, uniqueId) => {
        let initialValues = {
            "userId": userId,
            "ipAddress": "",
            "uniqueId": uniqueId,
            "logInOut": true
        };

        const res = await axios.post(`${HOST_URL}Login/UsrLogOut`, initialValues, {
            headers: {
                UniqueId: uniqueId
            }
        });

        if (res.data.isSuccess) {
            toast.success(res.data.mesg, {
                position: 'top-right',
                autoClose: 5000,
                theme: "colored"
            });
            setCart([]);
            clearSpecificCookies(['unme', 'uID']);
            localStorage.clear();
            navigate('/');
        } else {
            alert(res.data.mesg);
        }
    };

    const getDataforFilter = async () => {
        const res = await getCommDigitalContent(-1, -1, 0);
        if (res?.data?.length > 0) {
            const queryBasedData = res.data.filter(item => item.title && item.contentTypeName);
            setFilterData(queryBasedData);
        } else {
            setFilterData([]);
        }
    };

    const filteredData = filterData.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contentTypeName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSelect = (item) => {
        console.log("🚀 ~ handleSearchSelect ~ item:", item)
        setSearchQuery('');
        setIsFocused(false);
        let path = `/${item.contentTypeName}/${item.contentTypeId}`;
        navigate(path, { state: {...item, id: item.contentTypeId, digitalIT:item?.id, contentType: item.contentTypeName} });
    };

    const handleHome = (e) => {
        e.preventDefault();
        navigate('/');
    };

    const toggleDropdown = (dropdownNumber) => {
        if (dropdownNumber === 1) {
            setShowDropdown1((prev) => !prev);
            setShowDropdown(false); 
        } else {
            setShowDropdown((prev) => !prev);
            setShowDropdown1(false); 
        }

        setTimeout(() => {
            if (dropdownNumber === 1) setShowDropdown1(false);
            if (dropdownNumber === 2) setShowDropdown(false);
        }, 2500); 
    };

    return (
        <div style={{ backgroundColor: themeMaster.theme.navbarBackgroundColor, color:themeMaster?.theme?.navbarTextColor }}  className={`sticky top-0 z-50`}>
            <div id="headerno-1" style={{ backgroundColor: themeMaster?.theme?.navbarBackgroundColor, color: themeMaster?.theme?.navbarTextColor }}>
                {/* <div id="headerno-1" className="bg-[#433487] text-[#F6D2C8]"> */}
                <div className='flex items-center justify-between'>
                    <div className='flex justify-evenly items-center p-2'>
                        <div className='logo px-3 hover:cursor-pointer'>
                            <img className='h-14 w-32 rounded-lg ' alt='logo' src={`${previewpaththeme}${websettingLogo}`} onClick={handleHome} />
                        </div>
                        <div className='relative hidden md:flex items-center justify-between border-b-2 w-full'>
                            <SearchOutlinedIcon />
                            <input
                               className={`px-3 py-2 bg-transparent border rounded-md outline-none transition-colors duration-300 
                                    ${isFocused ? 'border-transparent' : 'border-transparent'} 
                                    [${themeMaster?.theme?.navbarTextColor}] 
                                    focus:[#433487] focus:ring-0 
                                    placeholder-white w-[calc(100%+15rem)]`}  
                                type="text"
                                placeholder="Search products"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            />
                            {isFocused && searchQuery && (
                                <div className="absolute top-full left-0 bg-white text-black w-full z-50 shadow-md max-h-60 overflow-y-auto">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item) => (
                                            <div
                                                key={item.id}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleSearchSelect(item)}
                                            >
                                                <i>{item.title}</i><br />
                                                <i>{item.contentTypeName}</i>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='flex items-center justify-between list-none px-4 md:px-9'>
                        <div className='flex items-center px-2'>
                            {unmeValue && <Link to='/order_history' className='px-3 cursor-pointer'><RiShoppingBag3Fill size={20} /></Link>}
                            <Link to='/wishlist' className='px-3'><FavoriteBorderIcon /></Link>
                            <Link to='/carts' className='relative px-3'><CartBadge /></Link>
                            <Link to='/sahayograshi' className='relative px-3'>
                            <img src={donate} className="h-7 w-7 rounded-lg"/>
                            </Link>
                            <Link to='/blog' className='relative px-3'>
                            <img src={blog} className="rounded-lg h-7 w-7"/>
                            </Link>

                            {!unmeValue && <li className='px-3 cursor-pointer' onClick={() => toggleDropdown(2)}>
                                <PersonIcon />
                                {showDropdown && (
                                    <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50'>
                                        <Link to='/userlogin' className='flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100'><img src={login} className="w-10 h-10 mr-2" alt="Login"/>{" "}Login</Link>
                                        <Link to='/user/signup' className='flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100'><img src={regis} className="w-10 h-10 mr-2" alt="Register"/>{" "}Register</Link>
                                    </div>
                                )}
                            </li>}
                            {unmeValue &&
                                <li className='px-3 cursor-pointer' onClick={() => toggleDropdown(1)}>
                                <img
                                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                                    src={memImg}
                                />
                                    {showDropdown1 && (
                                        <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50'>
                                        <Link to='/profile' className='px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center'>
                                            <img src={memImg} className="w-10 h-10 rounded-full border-2 border-gray-300" alt="Profile" />
                                            {" "} {profile?.membName ? `Welcome ${profile.membName}` : 'Welcome Guest'}</Link>
                                            <h5 className='px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center' onClick={handleout}><img src={logout} className="w-8 h-8 mr-2" alt="Logout"/>{" "}Logout</h5>
                                        </div>
                                    )}
                                </li>}
                        </div>
                    </div>
                </div>
            </div>
            <ReToastContainer />
        </div>
    );
}

export default NavBar;