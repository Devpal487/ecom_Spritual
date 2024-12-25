import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { getAddUpdateAddToCart, getCommDigitalContent, GetContentDescription, saveWishListData } from "../../utils/APIURL";
import { previewpath, previewpaththeme } from "../../utils/config";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { Cart } from "../../utils/Provider/CartContext";
import Loading from "../../utils/Loader/Loading";
import { MdShoppingCart } from "react-icons/md";
import NotificationSnackbar from "../../utils/NotificationSnackbar";
import { FaFilter } from "react-icons/fa";
import { MdFilterAltOff } from "react-icons/md";
import { useTheme } from "../../utils/Provider/ThemeContext";
import PageNotFound from "../../utils/PageNotFound";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";

const WishlistIcon = ({ book, handleAddToWishlist, isInWishlist }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleAddToWishlist(book);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-red-500
        ${isInWishlist || isHovered ? 'bg-green-100 text-green-600' : 'bg-opacity-20 bg-white '}
        focus:outline-none transition-colors`}
      aria-label={`Add ${book.title} to wishlist`}
    >
      {isHovered || isInWishlist ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
    </button>
  );
};

const FeaturedCategories = () => {
  const navigate = useNavigate();
  const theme = useTheme()
  const { cart, setCart, wishlistItems, setWishlistItems } = useContext(Cart);
  const location = useLocation();
  const [booksToShow, setBooksToShow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uniqueId, setUniqueId] = useState('');
  const [unid, setUnid] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [cardSize, setCardSize] = useState(4);
  const [newArrivals, setNewArrivals] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [discount, setDiscount] = useState('');
  const [originalBooks, setOriginalBooks] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [outofstockBalQtys, setOutofstockBalQtys] = useState(0);
  const [isPageNotFound, setIsPageNotFound] = useState(false);
  const [contentData, setContentData] = useState('');
  const [fileCount, setFileCount] = useState(0);
  const [fileName, setFileName] = useState('');
  const [fileOptions, setFileOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showHide, setShowHide] = useState(false);
  const [text, setText] = useState("");

  const handleNewArrivalsChange = (value) => {
    setNewArrivals(value);
    setFiltersApplied(true);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setFiltersApplied(true);
    setFiltersApplied(true);
  };

  const resetFilters = () => {
    setNewArrivals('');
    setPriceRange('');
    setDiscount('');
    setFiltersApplied(false);
    setBooksToShow(originalBooks);
  };

  const gridClasses = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5" };

  const [snackbarTimeout, setSnackbarTimeout] = useState(null);

  useEffect(() => {
    setUniqueId(localStorage.getItem('userid'));
    setUnid(localStorage.getItem('unqiueId'));
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // console.log('updatedBooks', location)
    if (location?.state == null || (Array.isArray(location?.state?.title) && location.state.title.length === 0)) {
      setIsPageNotFound(true);
      return;
    }

    if (location.state) {
      GetContDescr(-1, location?.state?.id);
      if (Array.isArray(location?.state?.title)) {
        // Directly show the data if location.state is an array
        const updatedBooks = location?.state?.title?.map((book) => ({
          ...book,
          thumbnail: book.thumbnail ? `${previewpath}${book.thumbnail}` : ''
        }));
        console.log('updatedBooks', updatedBooks)
        const isValidBooks = updatedBooks.every(book => book.title && book.id);
        if (!isValidBooks) {
          navigate('/PageNotFound');
          return;
        }

        setOriginalBooks(updatedBooks);
        setBooksToShow(updatedBooks);
      } else {
        fetchCommDigitalContentData(location.state.id);
      }
    }
  }, [location.state, navigate]);

  const handleAddToWishlist = async (book) => {
    if (uniqueId === null) {
      return navigate('/userlogin');
    }
    const collectData = { "digitalFileId": book.id };
    const res = await saveWishListData(unid, collectData);
    if (res.isSuccess) {
      const existingItemIndex = wishlistItems.findIndex(item => item.id === book.id);
      if (existingItemIndex !== -1) {
        const updatedWishlist = wishlistItems.filter(item => item.id !== book.id);
        setWishlistItems(updatedWishlist);
        setSnackbarMessage(`${book.title} removed from wishlist`);
      } else {
        setWishlistItems(prevWishlist => [...prevWishlist, book]);
        setSnackbarMessage(`${book.title} added to wishlist`);
      }
      setSnackbarSeverity('success');
    } else {
      setSnackbarMessage(res.mesg);
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const fetchCommDigitalContentData = async (contentTypeId) => {
    try {
      const data = await getCommDigitalContent(-1, contentTypeId, 0);
      // console.log('response', data.data);
      if (data?.data?.length > 0) {
        //taxName
        const filteredData = data.data
        const updatedBooks = filteredData.map((book) => ({
          ...book,
          thumbnail: book.thumbnail ? `${previewpath}${book.thumbnail}` : '',
          exRate: book.exRate + ((book.exRate * parseInt(book.taxName)) / 100)
        }));
        const options = data?.data?.map(item => item.givenFileName);
        setFileOptions(options);
        setFilteredOptions(options);
        // setFileOptions(filteredData);

        setOriginalBooks(updatedBooks);
        setBooksToShow(updatedBooks);
        setFileCount(updatedBooks?.length)
      } else {
      }
    } catch (error) {
    }
  };

  const handleFeatureCategories = (book) => {
    const bookArray = Array.isArray(book) ? book : [book];
    const path = `/${encodeURIComponent(bookArray[0].title)}/${String(bookArray[0].id)}`;
    navigate(path, { state: { book: bookArray, outofstockBalQty: outofstockBalQtys } });
  };
  const handleCart = async (book) => {
    if (uniqueId === null) {
      setSnackbarMessage("Please do login for proceed further");
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return navigate('/userlogin');
    }
    const existingItemIndex = cart.findIndex(item => item.contentId === book.id);

    let cartItem = {
      cartId: existingItemIndex !== -1 ? cart[existingItemIndex].cartId : -1,
      contentId: book.id,
      quantity: book.qty || 1,
      userId: uniqueId,
      title: book.title,
      thumbnail: book.thumbnail,
      exRate: book.exRate
    };

    const data = await getAddUpdateAddToCart(cartItem);
    if (data?.isSuccess) {
      if (existingItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += cartItem.quantity;

        let currentQuantity = updatedCart[existingItemIndex].quantity;
        console.log("currentQuantity value", currentQuantity);

        const newQuantity = book.outofstockBalQty - currentQuantity;
        setOutofstockBalQtys(newQuantity);

        console.log("newQuantity value", newQuantity);

        setCart(updatedCart);
        setSnackbarMessage(`${cartItem.title} quantity updated in cart`);
        setSnackbarSeverity('success');
      } else {
        setCart(prevCart => [...prevCart, { ...cartItem, cartId: data.cartId }]);
        setSnackbarMessage(`${cartItem.title} added to cart`);
        setSnackbarSeverity('success');
      }
    } else {
      setSnackbarMessage(`Failed to add ${cartItem.title} to cart`);
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    if (snackbarTimeout) {
      clearTimeout(snackbarTimeout);
    }
  };

  useEffect(() => {
    if (snackbarOpen) {
      const timeout = setTimeout(() => {
        setSnackbarOpen(false);
      }, 3000);
      setSnackbarTimeout(timeout);
    }
    return () => {
      if (snackbarTimeout) {
        clearTimeout(snackbarTimeout);
      }
    };
  }, [snackbarOpen]);

  useEffect(() => {
    applyFilters();
  }, [newArrivals, priceRange, discount, originalBooks]);

  const applyFilters = () => {
    let filteredBooks = [...originalBooks];
    if (newArrivals) {
      const daysMap = { 'Last 7 days': 7, 'Last 15 days': 15, 'Last 30 days': 30 };
      const days = daysMap[newArrivals];
      const now = new Date();
      filteredBooks = filteredBooks.filter(book => {
        const bookDate = new Date(book.dateSaved);
        return (now - bookDate) / (1000 * 60 * 60 * 24) <= days;
      });
    }

    if (priceRange) {
      const priceMap = {
        'Below ₹ 100': book => book.exRate < 100,
        '₹ 100 - ₹ 200': book => book.exRate >= 100 && book.exRate < 200,
        '₹ 200 - ₹ 500': book => book.exRate >= 200 && book.exRate < 500,
        '₹ 500 - ₹ 1000': book => book.exRate >= 500 && book.exRate < 1000,
        'Above ₹ 1000': book => book.exRate >= 1000
      };
      filteredBooks = filteredBooks.filter(priceMap[priceRange]);
    }

    if (discount) {
      const discountMap = {
        '10% off or more': book => book.discount >= 10,
        '25% off or more': book => book.discount >= 25,
        '35% off or more': book => book.discount >= 35
      };
      filteredBooks = filteredBooks.filter(discountMap[discount]);
    }

    setBooksToShow(filteredBooks);
  };

  const updateCardSize = () => {
    const width = window.innerWidth;
    if (width < 640) {
      setCardSize(2);
    } else if (width >= 640 && width < 1024) {
      setCardSize(3);
    } else if (width >= 1024 && width < 1280) {
      setCardSize(4);
    } else {
      setCardSize(5);
    }
  };

  useEffect(() => {
    updateCardSize();
    window.addEventListener('resize', updateCardSize);

    return () => {
      window.removeEventListener('resize', updateCardSize);
    };
  }, []);

  const GetContDescr = async (id1, id2) => {
    const response = await GetContentDescription(id1, id2);
    // console.log('response', response.data[0]);
    let result = response.data[0];
    if (result) {
      setContentData(result);
    } else {
      setContentData("")
    }
  }

  const formatDescription = (description) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = description;

    // Find all <li> elements
    const listItems = tempElement.querySelectorAll('li');
    if (listItems.length) {
      const orderedList = document.createElement('ol');
      listItems.forEach((item) => orderedList.appendChild(item.cloneNode(true)));

      // Replace all <li> elements with the new ordered list
      const parent = listItems[0].parentNode;
      if (parent) {
        parent.replaceWith(orderedList);
      }
    }

    return tempElement.innerHTML;
  };

  const handleFileNameChange = (value) => {
    setFileName(value);
    setShowHide(false);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    // console.log("🚀 --------------------------------------🚀")
    // console.log("🚀 ~ handleSearchChange ~ event:", searchValue)
    // console.log("🚀 --------------------------------------🚀")
    if (searchValue) {
      setFileName(searchValue);
      setShowHide(true);
    } else {
      setFileName("");
      setShowHide(false);
    }
    const filtered = fileOptions.filter(file =>
      file.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredOptions(filtered);

    // New filtering logic for booksToShow based on searchValue
    const filteredBooks = originalBooks.filter(book =>
      book.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setBooksToShow(filteredBooks);
  };

  const showDropdown = fileName.length > 0 && filteredOptions.length > 0;

  // {`${previewpaththeme}${contentData?.image}`}
  return (
    <div>
      {isPageNotFound ? (
        <PageNotFound />
      ) : (
        <>
          <div>
            {contentData ? (
              <div className="w-full p-2">
                <div
                  className=" overflow-auto"
                  style={{ maxHeight: 'auto' }}
                >
                  <div className=" ">
                    {/* Image Section */}
                    <div className="group relative overflow-hidden rounded-2xl mb-4 h-[12rem]">
                      <img
                        src={`${previewpaththeme}${contentData.image}`}
                        alt={contentData.title}
                        className="h-full w-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
                      />
                    </div>

                    {/* Title Section */}
                    {/* <h1 className="m-1 text-3xl font-bold">{contentData.title}</h1> */}

                    {/* Description Section */}
                    <div
                      className="m-2 p-2 border-t-2 border-b-2 border-gray-500 text-justify font-serif text-[15px] font text-[#262626]"
                      dangerouslySetInnerHTML={{
                        __html: formatDescription(contentData.description),
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p></p>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4 px-3 relative mt-5">
            {loading ? (
              <div className="flex justify-center items-center h-screen">
                <Loading />
              </div>
            ) : (
              <>

                <div className="my-10">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="lg:hidden my-3 px-4 py-2 cursor-pointer text-blue-500 rounded focus:outline-none w-[22%] absolute right-5 top-1 z-10 flex items-center gap-2"
                  >
                    {filterOpen ? (<><MdFilterAltOff />Close Filters</>) : (<><FaFilter size={20} />Apply Filters</>)}
                  </button>
                </div>

                <div
                  className={`lg:w-1/5 transition-all duration-300 lg:block ${filterOpen ? 'block' : 'hidden'} 
            fixed top-0 left-0 lg:relative  shadow-md z-40 lg:z-auto`}
                >

                  <div className="sticky top-16 z-10 bg-gray-100 w-full  rounded-md p-4 mb-3">
                    <h1 className="my-3 font-semibold font-serif text-sm md:text-base">
                      {/* Selected Category: {location.state.contentType} */}
                      {
                        location?.state && (
                          location.state.categoryLoadStatus
                            ? `Selected Category: ${location.state.categoryLoadStatus}`
                            : `Selected Content: ${location.state.contentType}`
                        )
                      }
                    </h1>

                    <div className="mt-4">
                      <h2 className="font-semibold text-base mb-3">Filters</h2>
                      {fileCount && <div className="flex ">
                        <h1 className="font-semibold text-base mb-1">Total File : </h1> <i>{fileCount}</i>
                      </div>}

                      <div className="my-2">
                        <label className="block font-semibold text-sm mb-2">Select File</label>
                        <ReactTransliterate
                        value={text}
                        onChangeText={(text) => {
                          setText(text);
                          handleSearchChange({ target: { value: text } }); 
                        }}
                        lang="hi"
                        placeholder="Search file"
                        size='small'
                        style={{ width: '100%', height: '38px', padding:2 }} 
                      />
                        {showHide && (
                          <ul className="border rounded mt-1 max-h-60 overflow-auto">
                            {filteredOptions.map((file, index) => (
                              <li
                                key={index}
                                onClick={() => handleFileNameChange(file)}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                              >
                                {file}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {/* </div> */}

                      <div className="my-2">
                        <label className="block font-semibold text-sm mb-2">New Arrivals</label>
                        <select
                          value={newArrivals}
                          onChange={(e) => handleNewArrivalsChange(e.target.value)}
                          className="p-2 text-sm rounded border w-full"
                        >
                          <option value="">Select</option>
                          <option value="Last 7 days">Last 7 days</option>
                          <option value="Last 15 days">Last 15 days</option>
                          <option value="Last 30 days">Last 30 days</option>
                        </select>
                      </div>

                      {/* Price Range */}
                      <div className="my-2">
                        <label className="block font-semibold text-sm mb-2">Price Range</label>
                        <select
                          value={priceRange}
                          onChange={(e) => handlePriceChange(e.target.value)}
                          className="p-2 text-sm rounded border w-full"
                        >
                          <option value="">Select</option>
                          <option value="Below ₹ 100">Below ₹ 100</option>
                          <option value="₹ 100 - ₹ 200">₹ 100 - ₹ 200</option>
                          <option value="₹ 200 - ₹ 500">₹ 200 - ₹ 500</option>
                          <option value="₹ 500 - ₹ 1000">₹ 500 - ₹ 1000</option>
                          <option value="Above ₹ 1000">Above ₹ 1000</option>
                        </select>
                      </div>

                      {/* Discount Section
                <div className="my-2">
                  <label className="block font-semibold text-sm mb-2">Discount</label>
                  <select
                    value={discount}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    className="p-2 text-sm rounded border w-full"
                  >
                    <option value="">Select</option>
                    <option value="10% off or more">10% off or more</option>
                    <option value="25% off or more">25% off or more</option>
                    <option value="35% off or more">35% off or more</option>
                  </select>
                </div>*/}

                      <div className="mt-4">
                        <button
                          onClick={resetFilters}
                          className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700 focus:outline-none w-full"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-4/5 mb-3">
                  <div className={`grid gap-3 ${gridClasses[cardSize]} mx-auto`}>
                    {booksToShow.map((book, index) => {
                      const isInWishlist = wishlistItems.some(item => item.id === book.id);

                      return (
                        <div
                          key={index}
                          className="relative bg-white border mix-blend-multiply border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow flex flex-col cursor-pointer group overflow-hidden "
                          onClick={() => handleFeatureCategories(book)}
                        >
                          <img
                            src={book.thumbnail}
                            alt={book.title}
                            className="w-full h-48 object-fit  rounded-md mb-4 transition-transform duration-1000 ease-in-out group-hover:scale-110"
                          />

                          <div className="flex-1">
                            <label className="text-sm md:text-base lg:text-lg font-semibold hover:underline cursor-pointer">
                              {book.title}
                            </label>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-700">
                              ₹ {book.exRate}
                            </span>

                            {book.outofstockBalQty === null || book.outofstockBalQty <= 0 ||
                              (cart.findIndex(item => item.contentId === book.id) !== -1 &&
                                cart[cart.findIndex(item => item.contentId === book.id)].quantity >= book.outofstockBalQty) ? (
                              <span className="text-red-600 text-[12px]">Out of Stock</span>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCart(book);
                                }}
                                className="text-green-600 text-[12px]  flex items-center"
                              >
                                <MdShoppingCart />
                                {book.outofstockBalQty > 0 && 'Add to Cart'}
                              </button>
                            )}

                          </div>

                          <WishlistIcon
                            book={book}
                            handleAddToWishlist={handleAddToWishlist}
                            isInWishlist={isInWishlist}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            <NotificationSnackbar
              open={snackbarOpen}
              message={snackbarMessage}
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
            />
          </div>
        </>
      )}
    </div>

  );
};

export default FeaturedCategories;