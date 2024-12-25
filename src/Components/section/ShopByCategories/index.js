import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../../../utils/Provider/ThemeContext";
import RightSideDrawer from "../../../utils/RightSideDrawer";
import { fetchposterData, getItemContentType } from "../../../utils/APIURL";
import { useNavigate } from "react-router-dom";
import { AdsSection } from "../../AdsSection";
import "./index.css";
import { previewpath, previewpaththeme } from "../../../utils/config";
import banner from '../../../Asset/ImageSlider/images/newBanner.png'
import Loading from "../../../utils/Loader/Loading";

const CustomArrow = ({ className, style, onClick, direction }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        backgroundColor: direction === 'prev' ? 'orange' : 'orange',
        borderRadius: '50%',
        zIndex: 10,
        // padding: '10px',
      }}
      onClick={onClick}
    >
      {direction === 'prev' ? '<' : '>'}
    </div>
  );
};

const ShopByCategories = ({ noOfCard, noOfRow, isBanner }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [itemContentTypeData, setItemContentTypeData] = useState([ ]);
  const [postData, setPostData] = useState({ });
  const [thoughtData, setThoughtData] = useState({ });
  const [loading, setLoading] = useState(true);

  const adsAfterIndex = noOfCard * (noOfRow || 1);
  const gridColsClass = `grid-cols-${noOfCard}`;

  const settings = {
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    infinite: true,
    speed: 2000,
    arrows: true,
    dots: false,
    pauseOnHover: true,
    centerMode: false,
    centerPadding: '20px',
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 5,
          centerPadding: '20px',
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          centerPadding: '15px',
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          centerPadding: '10px',
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          centerPadding: '10px',
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          centerPadding: '5px',
        },
      },
    ],
  };

  const newSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7500,
    infinite: true,
    speed: 4500,
    arrows: true,
    dots: false,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: '0px',
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 1,
          centerPadding: '0px',
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 1,
          centerPadding: '0px',
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerPadding: '0px',
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: '0px',
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerPadding: '0px',
        },
      },
    ],
  };

  useEffect(() => {
    fetchItemContentTypeData();
    getPosterData();
  }, []);

  const fetchItemContentTypeData = async () => {
    try {
      const data = await getItemContentType();
      setItemContentTypeData(data.data);
    } catch (error) { }
  };

  const getPosterData = async() =>{
    setLoading(true); 
    try {
      let res = await fetchposterData(-1);
      // console.log("API Response:", res);

      if (res?.isSuccess && res?.data?.length > 0) {
        setPostData(res?.data[0]);

        if (res?.data.length > 1) {
          setThoughtData(res?.data.slice(1)); 
          console.log(res?.data.slice(1)) 
        }
      } else {
        setPostData({});
      }
    } catch (error) {
      // console.error("Error fetching poster data:", error);
      setPostData({});
    } finally {
      setLoading(false); 
    }
  };

  console.log(thoughtData)

  const handleDrawerOpen = (title) => {
    navigate(`/${title.id}`, { state: title });
  };

  const backgroundColorStyle = theme.backgroundImage ? "transparent" : theme.backgroundColor === "bg-white" ? "white" : "transparent";

  const sortedData = itemContentTypeData?.sort((a, b) => {
    const displayNoA = a.displayNo ?? Number.MAX_SAFE_INTEGER;
    const displayNoB = b.displayNo ?? Number.MAX_SAFE_INTEGER;
    return displayNoA - displayNoB;
  });

  // console.log(postData?.posterImage)

  return (
    <>
      <div className="w-full my-2">
      {loading ? (
        <div className="flex justify-center items-center">
        <Loading/>
        </div>
      ) : (
        <>
        {postData?.posterImage ? (
    <img 
      src={`${previewpaththeme}${postData?.posterImage}`} 
      alt="adssec" 
      className="w-full h-[12rem]" 
    />
          ) : (
            <div>No poster available</div> 
          )}
        </>
      )}
      </div>
      <div
        className={`mx-4 md:mx-8 lg:mx-14 `}
        style={{
          backgroundColor: backgroundColorStyle,
          color: theme.textColor,
        }}
      >

        {/* <div className={`grid ${gridColsClass} sm:${gridColsClass} md:${gridColsClass} lg:${gridColsClass}  gap-4 my-5 `}> */}
        {/*
          {itemContentTypeData?.map((item, index) => (
            <React.Fragment key={item.id}>
            <div className="text-center  shadow-lg rounded-lg" onClick={() => handleDrawerOpen(item)}>
              <div className="flex justify-center">
                  <img
                    src={`${previewpath}${item.contentImg}`}
                    alt={item.contentType}
                    className={`w-full h-32 md:w-40 md:h-40 rounded-md cursor-pointer hover:drop-shadow-xl hover:font-semibold  ${theme.borderColor}`}
                  />
                </div>
                <h2
                  className={`my-3 text-center cursor-pointer truncate font-semibold hover:text-blue-600 hover:underline`}
                  title={item.contentType} 
                >
                  {item.contentType}
                </h2>
              </div>

              {(index + 1) % adsAfterIndex === 0 && (
                <div key={`ad-${index}`} className="col-span-full">
                  <AdsSection isBanner={isBanner}/>
                </div>
              )}
            </React.Fragment>
          ))}  */}

        <Slider {...settings} className="autoplay mt-5">
      {sortedData?.map((item, index) => (
        <div
          key={index}
          className="h-[15rem] flex flex-col items-center justify-center border-2 rounded-xl border-[#610000] gap-5 pt-5 pb-10 mx-2"
          onClick={() => handleDrawerOpen(item)}
        >
          <div className=" group relative overflow-hidden flex justify-center">
            <img
              src={`${previewpath}${item.contentImg}`}
              alt={item.contentType}
              className={`h-32 md:w-40 md:h-40 rounded-md cursor-pointer hover:drop-shadow-xl hover:font-semibold ${theme.borderColor} transition-transform duration-1000 ease-in-out p-1 group-hover:scale-110`}
            />
          </div>
          <h2
            className={`my-3 text-center cursor-pointer truncate font-semibold hover:text-blue-600 hover:underline`}
            title={item.contentType}
          >
            {item.contentType}
          </h2>
        </div>
      ))}
    </Slider>


      </div>
      {/* </div> */}
      <div className={`h-3 ${theme.backgroundColor}`}></div>
      {/* thoughtData */}

      <div
    className={`md:mx-8 lg:mx-14 `}
    style={{
      backgroundColor: backgroundColorStyle,
      color: theme.textColor,
    }}
  >
        <Slider {...newSettings} className="autoplay">
        {Array.isArray(thoughtData) && thoughtData.map((imgSrc, index) => (
            <div key={index}  className="h-[20rem] ">
                <img  src={`${previewpaththeme}${imgSrc?.posterImage}`}  className="h-full w-full object-fit m-2" alt={`Slide ${index + 1}`} />
            </div>
        ))}
    </Slider>
</div>
      <div className={`h-3 `}></div>

    </>
  );
};

export default ShopByCategories;
