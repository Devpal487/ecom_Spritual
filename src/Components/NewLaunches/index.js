import React from "react";
import { NewLaunchesData } from "../../Data/NewLaunches";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NewLaunche = () => {
  var settings = {
    dots: false,
    infinite: false,
    speed: 700,
    slidesToShow: 5,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 3,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div>
      <div className=" bg-[#F6D2C8]">
        <div className="flex items-center justify-between py-2 mx-3">
        <h1 className="text-2xl font-mono font-semibold  text-[#333333]">
          New Launches
        </h1>
        <button className="text-blue-800/90 font-bold">VIEW ALL</button>
        </div>
        <Slider {...settings} className="mx-10 py-5">
          {NewLaunchesData.map((lst) => (
            <div key={lst.id} className="!w-[245px] h-[340px]  bg-white border rounded-xl">
              <div className="relative w-fit h-fit">
                <img src={lst.src} className=" rounded-tl-xl rounded-tr-xl"/>
                <div className="absolute bottom-1 right-1 bg-[#f5f5f5] w-8 h-8 p-1 rounded-full">
                  <FavoriteBorderIcon className="text-[#f39293]"/>
                </div>
              </div>
              <div className="px-2 py-3">
                <p className="text-[13px] font-medium">{lst.desc}</p>
              </div>
              <div className="flex items-center px-2">
                <span className="font-semibold text-[20px] ">₹{lst.disprice}</span>
                <span><del className="text-[#c6c4c4] text-[17px] mx-2">₹{lst.orgprice}</del></span>
                <span  className=" text-[#d24b39] text-sm font-semibold">{lst.offer}</span>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className="h-3 bg-[#f5f5f5]"></div>
    </div>
  );
};
export default NewLaunche;
