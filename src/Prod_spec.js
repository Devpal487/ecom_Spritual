import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import AddedCart from "./utils/AddedCart";
import { getAddtoCart, getAddUpdateAddToCart, getCommDigitalContent, GetDigitalFiles } from "./utils/APIURL";
import { Cart } from "./utils/Provider/CartContext";
import NotificationSnackbar from "./utils/NotificationSnackbar";
import { previewpath } from "./utils/config";
import { useTheme } from "./utils/Provider/ThemeContext";
import Loading from "./utils/Loader/Loading";
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import './index.css';
import { SecurePdfViewer } from "./utils/SecurePdfViewer";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProdSpec = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location)
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState([])
  const [selectedFormat, setSelectedFormat] = useState("eBook");
  const [bookPrice, setBookPrice] = useState(selectedItem ? selectedItem.exRate : 0.0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { cart, setCart } = useContext(Cart);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [filePreviews, setFilePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const unmeValue = localStorage.getItem('userid');
  const getUserId = () => localStorage.getItem('unqiueId');
  const [userId, setUserId] = useState(getUserId());
  const [openModal, setOpenModal] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileTypeFromExtension, setFileTypeFromExtension] = useState("");
  const [loadingFile, setLoadingFile] = useState(true);
  const [modalTitle, setModalTitle] = useState(""); 
  const [pdfData, setPdfData] = useState(null);
  const [error, setError] = useState(null);

  const getDigitalFiles = async (fileId, id) => {
    setIsLoading(true);
    try {
      if (fileId && id) {
        const result = await GetDigitalFiles(fileId, id);
        const sortedData = result.data.sort((a, b) => {
          const fileTypeOrder = { pdf: 1, img: 2, other: 3 };
          const getFileCategory = (fileName) => {
            if (fileName.endsWith('.pdf')) return 'pdf';
            if (fileName.match(/\.(jpeg|jpg|png|gif)$/i)) return 'img';
            return 'other';
          };
          const typeA = getFileCategory(a.savedFile);
          const typeB = getFileCategory(b.savedFile);
          return fileTypeOrder[typeA] - fileTypeOrder[typeB];
        });

        const previews = sortedData.map(file => ({
          type: getFileType(file.savedFile),
          previewUrl: file.givenFileName,
          fileData: file
        }));
        setFilePreviews(previews);
      }
    } catch (error) {
      if (!id) {
        setSnackbarMessage('Please login to view file previews');
        setSnackbarSeverity('warning');
      } else {
        setSnackbarMessage('Failed to load file previews');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedItem && userId) {
      getDigitalFiles(selectedItem.id, userId); 
    }
  }, [selectedItem, userId]);

  useEffect(() => {
    const checkUserId = () => {
      const currentUserId = getUserId();
      if (currentUserId !== userId) {
        setUserId(currentUserId);
      }
    };
    checkUserId();
    const intervalId = setInterval(checkUserId, 1000);
    return () => clearInterval(intervalId);
  }, [userId]);

  useEffect(() => {
    console.log(location.state.id)
    if (location.state.digitalIT && location.state.id) {
      getCommDigitalContentwithLocationId(location.state.digitalIT, location.state.id, 0);
    }
    if (location.state && location.state.book) {
      if (Array.isArray(location.state.book) && location.state.book.length > 0) {
        setSelectedItem(location.state.book[0]);
        setBookPrice(location.state.book[0].exRate);
      } else if (typeof location.state.book === 'object') {
        setSelectedItem(location.state.book);
        setBookPrice(location.state.book.exRate);
      }
    }
  }, [location]);

  useEffect(() => {
    const rate = selectedItem?.exRate || 0.00;
    setBookPrice(selectedFormat === "eBook" ? rate : rate);
  }, [selectedItem, selectedFormat]);




  useEffect(() => {
    if (openModal && fileUrl) {
      fetchPdf();
    }
  }, [openModal, fileUrl]);

   const fetchPdf = async () => {
        setLoadingFile(true);
        try {
          const response = await fetch(fileUrl, {
            headers: {
              'Content-Type': 'application/pdf',
            },
          });

          if (!response.ok) throw new Error('Failed to fetch PDF');

          const buffer = await response.arrayBuffer();
          const uint8Array = new Uint8Array(buffer);
          setPdfData(uint8Array);
        } catch (err) {
          setError('Failed to load PDF document');
          console.error(err);
        } finally {
          setLoadingFile(false);
        }
      };

  const getCommDigitalContentwithLocationId = async (a, b) => {
    const result = await getCommDigitalContent(a, b, 0);
    if (result.isSuccess) {
      const updatedBooks = result?.data?.map((item) => ({
        ...item,
        thumbnail: item.thumbnail ? `${previewpath}${item.thumbnail}` : ''
      }));
      setSelectedItem(updatedBooks[0])
    } else {
      alert('Network Issue')
    }
  }
  const totalPrice = (bookPrice * quantity).toFixed(2);
  const handleAddToCart = async () => {
    if (!userId) {
      setSnackbarMessage('Please login for further process');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return navigate('/userlogin');
    }
    if (selectedItem) {
      setAddedToCart(true);
      let cartItem = {
        contentId: selectedItem.id || selectedItem.contentId,
        quantity: quantity,
        userId: localStorage.getItem('userid'),
        title: selectedItem.title,
        thumbnail: selectedItem.thumbnail,
        exRate: selectedItem.exRate
      };
      const data = await getAddUpdateAddToCart(cartItem);
      if (data?.isSuccess) {
        const existingItemIndex = cart.findIndex(item => item.contentId === cartItem.contentId);
        if (existingItemIndex !== -1) {
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].quantity += quantity;
          setCart(updatedCart);
          setSnackbarMessage(`${cartItem.title} quantity updated in cart`);
          setSnackbarSeverity('success');
        } else {
          setCart(prevCart => [...prevCart, cartItem]);
          setSnackbarMessage(`${cartItem.title} added to cart`);
          setSnackbarSeverity('success');
        }
        let result = await getAddtoCart(unmeValue);
        if (result?.data) {
          if (Array.isArray(result.data) && result.data.length > 0) {
            const filteredData = result.data.filter(item => {
              const thumbnail = item.thumbnail || '';
              return thumbnail && !thumbnail.toLowerCase().endsWith('.pdf');
            });
            const updatedBooks = filteredData.map((book) => ({
              ...book,
              thumbnail: book.thumbnail ? `${previewpath}${book.thumbnail}` : ''
            }));
            setCart(updatedBooks);
          }
        } else {
          setSnackbarMessage(`Failed to add ${cartItem.title} to cart`);
          setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
      }
    };
  }
  const handleCartNavigate = () => {
    navigate('/carts');
  };

  const handleBuyPayment = (e) => {
    e.preventDefault();
    if (!userId) {
      setSnackbarMessage('Please login for further process');
      setSnackbarSeverity('warning');
      return navigate('/userlogin');
    }
    if (selectedFormat) {navigate(`/payment`, { state: { amount: totalPrice, book: selectedItem, qty: quantity, price: totalPrice } });}
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!selectedItem) {
    return (
      <div className="text-center py-20">
        <h2>Book data is not available.</h2>
        <p>Please try again later or go back to the previous page.</p>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'].includes(extension)) return 'image';
    if (extension === 'pdf') return 'pdf';
    if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video';
    if (extension === 'mp3') return 'audio';
    if (extension === 'epub') return 'epub';
    return 'other';
  };
  const renderFilePreview = (preview, index) => {
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };
  
    switch (preview.type) {
      case 'image':
        return (
          <img onContextMenu={preventContextMenu}
            src={`${previewpath}${preview?.fileData?.savedFile}`}
            alt={preview?.fileData?.givenFileName}
            className="max-w-full h-auto rounded"
          />
        );
      case 'pdf':
        return (
          <iframe
            onContextMenu={preventContextMenu}  
            src={`${previewpath}${preview?.fileData?.savedFile}#toolbar=0&navpanes=0&scrollbar=0&embedded=true`}
            type="application/pdf"
            width="100%"
            height="600px"
            title={preview?.fileData?.givenFileName}
            
          />
        );
      case 'video':
        return (
          <video onContextMenu={preventContextMenu} controls disablePictureInPicture controlsList="nodownload noremoteplayback" className="w-full">
            <source src={`${previewpath}${preview?.fileData?.savedFile}`} type={preview?.fileData?.mimeType} />
          </video>
        );
      case 'audio':
        return (
          <audio controls onContextMenu={preventContextMenu} controlsList="nodownload noremoteplayback" className="w-full">
            <source src={`${previewpath}${preview?.fileData?.savedFile}`} type={preview?.fileData?.mimeType} />
            Your browser does not support the audio element.
          </audio>
        );
      case 'epub':
        return (
          <div className="flex flex-col items-center justify-center p-4 rounded">
            <p className="mb-2">EPUB file: {preview?.fileData?.givenFileName}</p>
            <a
              href={`${previewpath}${preview?.fileData?.savedFile}`}
              download={preview?.fileData?.givenFileName}
              className="px-4 py-2 roundedtransition"
            >
            </a>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-3 h-36 bg-gray-200 rounded">
            <p className="text-gray-500">{preview?.fileData?.givenFileName || `No preview available for file ${index + 1}`}</p>
          </div>
        );
    }
  };
  

  const renderFilePreviewInModal = (fileUrl, fileType) => {
    if (loadingFile) {
      return (
          <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              {/* <p className="mt-4 text-gray-700">Loading...</p> */}
          </div>
      );
  }

  if (!pdfData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

    switch (fileType) {
      case 'image':
        return <img src={fileUrl} alt="Preview" className="max-w-full h-auto rounded" />;
        case 'pdf':
          const blob = new Blob([pdfData], { type: 'application/pdf' });
          const pdfUrl = URL.createObjectURL(blob);
            return (
                <div className="w-full h-96">
                    <SecurePdfViewer pdfData={pdfUrl} />
                </div>
            );
      case 'video':
        return <video controls className="max-w-full h-full"><source src={fileUrl} /></video>;
      case 'audio':
        return <audio controls className="w-full"><source src={fileUrl} /></audio>;
      default:
        return <p>No preview available for this file type.</p>;
    }
  };

  const FilePreviewModal = ({ openModal, setOpenModal, fileUrl, fileType, modalTitle  }) => (
    <Dialog
    open={openModal}
    onClose={() => setOpenModal(false)}
    fullScreen
    TransitionComponent={Transition}
  >
      <DialogTitle>
        <div className="flex justify-between items-center " >
          {/* Title on the left */}
          <span>{modalTitle || "File Preview"}</span>

          {/* Close Icon on the right */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setOpenModal(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent  className="h-auto">
        {/* <div className="h-auto overflow-y-auto"> */}
          {renderFilePreviewInModal(fileUrl, fileType)}
        {/* //</div> */}
      </DialogContent>
      
    </Dialog>
  );


  const handlePreviewAndReadAloud = (fileData) => {
    const fileUrl = `${previewpath}${fileData.savedFile}`;
    setFileUrl(fileUrl);
    setFileTypeFromExtension(getFileType(fileData.savedFile)); 
    setLoadingFile(true);
    setModalTitle(fileData.givenFileName);
    setOpenModal(true);
  };

 
  return (
    <>
      {addedToCart && (
        <AddedCart price={totalPrice} qty={quantity} bookRecord={selectedItem} />
      )}

      <div className="flex flex-col md:flex-row items-start justify-evenly gap-5 p-4" style={{ color: `${theme.theme.textColor}` }}>
        <div className="md:w-[25%] w-full flex justify-center mb-4 md:mb-0">
          <img src={selectedItem.thumbnail} className="h-auto w-full max-w-[300px]" alt={selectedItem.title} />
        </div>
        <div className="md:w-[55%] w-full">
          {selectedItem.title && <h1 className="text-2xl md:text-3xl font-semibold mb-2">{selectedItem.title}</h1>}
          <div className="flex gap-2 items-center my-2">
            {selectedItem.rating && <h5>{selectedItem.rating}</h5>}
            {selectedItem.numberOfRatings && <h5>{selectedItem.numberOfRatings} ratings</h5>}
          </div>
          <div className="flex gap-2 items-center my-2">
            <h5 className="hover:text-[#c7511f] text-sm hover:underline hover:cursor-pointer">
              {selectedItem.partOf ? `Part of: ${selectedItem.partOf}` : ""}
            </h5>
            <h5 className="hover:text-[#c7511f] text-sm hover:underline hover:cursor-pointer">
              See all formats and editions
            </h5>
          </div>
          <hr className="my-4" />
          {selectedItem.descr && <i className="list-disc mb-4 block">{selectedItem.descr}</i>}
          <br />
          <i className="text-xs mb-4 block">Solutions manual available upon qualifying course adoption.</i>
          <hr />
        </div>
        <div className="md:w-[20%] w-full border-4 border-gray-200 p-4 rounded-md">
          <div className="mb-4 ">
            <div className=" gap-2 ">
              <div
                className={`border-[2px] rounded-md text-xs p-2 cursor-pointer ${selectedFormat === "eBook" ? "bg-gray-200" : ""}`}
                onClick={() => handleFormatChange("eBook")}
              >
                <h2><CurrencyRupeeOutlinedIcon fontSize="small" />{bookPrice}</h2>
                <h2 className="text-[10px]">Available instantly</h2>
              </div>

            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs">Quantity:</label>
            <select
              name="quantity"
              className="text-xs w-full border rounded-md"
              value={quantity}
              onChange={handleQuantityChange}
            >
              {location.state ? (
                Array.isArray(location.state.book) && location.state.book.length > 0 ? (
                  [...Array(Math.min(Math.max(Number(location.state.book[0]['outofstockBalQty']), 0), 10)).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))
                ) : (
                  [...Array(Math.min(Math.max(Number(location.state.outofstockBalQty), 0), 10)).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))
                )
              ) : (
                <option value={0}>0</option>
              )}
            </select>
          </div>

          {addedToCart === false ? (
            (location.state && Array.isArray(location.state.book) && location.state.book.length > 0 && location.state.book[0]['outofstockBalQty'] > 0) ||
              (location.state && location.state['outofstockBalQty'] > 0) ? (
              <Button
                type="button"
                style={{
                  border: "1px solid #ffd814",
                  backgroundColor: "#ffd814",
                  color: "#fff",
                  borderRadius: "12px",
                  width: "100%",
                  marginTop: "5px",
                }}
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>
            ) : (
              <Button
                type="button"
                style={{
                  border: "1px solid #ffd814",
                  backgroundColor: "#ffd814",
                  color: "#fff",
                  borderRadius: "12px",
                  width: "100%",
                  marginTop: "5px",
                }}
                disabled
              >
                Out of Stock
              </Button>
            )
          ) : (
            <Button
              type="button"
              style={{
                border: "1px solid #ffd814",
                backgroundColor: "#ffd814",
                color: "#fff",
                borderRadius: "12px",
                width: "100%",
                marginTop: "5px",
              }}
              onClick={handleCartNavigate}
            >
              Go to cart
            </Button>
          )}

          {(location.state && Array.isArray(location.state.book) && location.state.book.length > 0 && location.state.book[0]['outofstockBalQty'] > 0) ||
            (location.state && location.state['outofstockBalQty'] > 0) ? (
            <Button
              variant="contained"
              color="primary"
              style={{
                backgroundColor: "#c7511f",
                color: "#fff",
                borderRadius: "12px",
                width: "100%",
                marginTop: "5px",
              }}
              onClick={handleBuyPayment}
            >
              Buy now
            </Button>
          ) : ''}

          <div className="text-xs text-left mt-2">
          Inclusive of all taxes
          </div>

          <div className="text-xs text-left py-2 mt-4">
            By clicking the above button, you agree to the{" "}
            <span className="text-[#007185] hover:text-[#c7511f] hover:underline">Terms & Conditions</span>{" "}
            and{" "}
            <span className="text-[#007185] hover:text-[#c7511f] hover:underline">Privacy Policy</span>.
          </div>
        </div>
      </div>

      {getUserId() && <> <h2 className="text-xl font-bold mb-4 px-4">File Previews</h2>
        <div className="h-96 overflow-auto border rounded-lg gap-4 p-4 m-3" style={{ borderColor: '#000', color: `${theme.theme.textColor}` }}>
          {isLoading ? (
            <Loading />
          ) : filePreviews.length > 0 ? (
            filePreviews.map((preview, index) => (
              <div key={index} className="border rounded-lg p-4 m-2">
                {preview.fileData && (
                  <div className="text-xs sm:text-sm flex flex-wrap justify-between items-center mb-2 ">
                    <p className="truncate flex-grow"><strong>File:</strong> {preview.fileData.givenFileName}</p>
                    <p className="mr-2"><strong>Saved:</strong> {new Date(preview.fileData.dateSaved).toLocaleDateString()}</p>
                    <div className="h-28 overflow-hidden w-48 mx-2"
                      onContextMenu={(e) => e.preventDefault()}>
                      {renderFilePreview(preview, index)}
                    </div>
                    <button
                        onClick={() => handlePreviewAndReadAloud(preview?.fileData, setOpenModal, setFileUrl)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
                      >
                        Preview
                      </button>

      <FilePreviewModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        fileUrl={fileUrl}
        fileType={fileTypeFromExtension}
        loadingFile={loadingFile}
        modalTitle={modalTitle}
      />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="col-span-full text-center">No file previews available.</p>
          )}
        </div></>}

      <NotificationSnackbar
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />

    </>
  );
};




export default ProdSpec;