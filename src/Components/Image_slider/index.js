import React, { useEffect, useState } from "react"
import { Carousel } from 'react-responsive-carousel';

import image1 from "../../Asset/ImageSlider/images/ads_1.jpg"
import image2 from "../../Asset/ImageSlider/images/ads_2.jpg"
import image3 from "../../Asset/ImageSlider/images/ads_3.jpg"
import img1 from "../../Asset/ImageSlider/images/ads_4.jpg"
import img2 from "../../Asset/ImageSlider/images/ads_5.jpg"
import img3 from "../../Asset/ImageSlider/images/ads_6.jpg"
import img4 from "../../Asset/ImageSlider/images/ads_7.jpg"

import newImg1 from '../../Asset/Login/images/1.png';
import newImg2 from '../../Asset/Login/images/2.png';
import newImg3 from '../../Asset/Login/images/3.png';
import newImg4 from '../../Asset/Login/images/4.png';
import { HOST_URL, previewpaththeme } from "../../utils/config";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../../utils/Provider/ThemeContext";


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

const ImageSlider = ({ isActiveSlider }) => {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageData, setImageData]= useState([]);

    const settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4500,
        infinite: true,
        speed: 2500,
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
        if (!isActiveSlider) return;


        fetchData();
    }, [isActiveSlider]);

    if (!isActiveSlider) {
        return null;
    }
    const fetchData = async()=>{
        const res = await  axios.post(`${HOST_URL}Banner/GetBanner`, {id : -1})
        const response = res?.data?.data
        if(res?.data?.isSuccess){
            setImageData(response)
        }else{
            setImageData([])
        }
    }
    const handleChange = (index) => {
        setCurrentIndex(index);
      };
    
      const intervalTime = currentIndex === 6 ? 7000 : 4000;

      const backgroundColorStyle = theme.backgroundImage ? "transparent" : theme.backgroundColor === "bg-white" ? "white" : "transparent";

    return (
    <div
    className={` md:mx-8 lg:mx-14 `}
    style={{backgroundColor: "white"}}
  >
        <Slider {...settings} className="autoplay bg-white">
        {imageData?.map((imgSrc, index) => (
            <div key={index}  className="h-[20rem] bg-white">
                <img src={`${previewpaththeme}${imgSrc?.banner_img}`} className="h-full w-full object-fit m-2 bg-white" alt={`Slide ${index + 1}`} />
            </div>
        ))}
    </Slider>
</div>
    )
}

export default ImageSlider;