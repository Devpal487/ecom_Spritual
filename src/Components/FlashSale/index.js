import React, { useState, useEffect } from "react";
import img1 from "../../Asset/FlashSale/snowflake.webp";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FlashSaleData from "../../Data/FlashSale";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FlashSale = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const deadline = "Janurary 01, 2024";

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 1000);

    return () => clearInterval(interval);
  }, []);

  var settings = {
    dots: false,
    infinite: false,
    speed: 700,
    slidesToShow: 5,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
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
    <>
    <div className="h-3 bg-gray-300"></div>
    <div className="px-5 py-5 bg-[#eee8ff]">
      <div className="grid grid-cols-3 mx-10">
        <h1 className="text-2xl text-[#000] font-medium">Flash Sale</h1>
        <h1>USE COUPON : FLASHSALE</h1>
        <div>
          <div className="flex items-center justify-center gap-2 ">
            <div>
              <div className="text-center text-lg  text-red-600">
                {days < 10 ? "0" + days : days}
                <span className="mx-1">days</span>:
              </div>
            </div>
            <div>
              <div className="text-center text-lg  text-red-600">
                {hours < 10 ? "0" + hours : hours}
                <span className=" mx-1">hrs</span>:
              </div>
            </div>
            <div>
              <div className="text-center text-lg  text-red-600">
                {minutes < 10 ? "0" + minutes : minutes}
                <span className=" mx-1">mins</span>:
              </div>
            </div>
            <div>
              <div className="text-center text-lg  text-red-600">
                {seconds < 10 ? "0" + seconds : seconds}
                <span className="mx-1">secs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Slider {...settings} className="mx-[8%] my-3 ">
        {FlashSaleData.map((lst) => (
          <div className=" py-2 w-48 px-8 h-fit" key={lst.id}>
            <div className="relative">
              <div className="">
                <img src={lst.src} className="w-42 h-52 rounded-lg shadow-lg" />
              </div>
              <div className="absolute w-12 text-[12px] text-center top-1.5 right-1.5 rounded-md text-[#fff] h-7 py-1 bg-[#4aa808bf]">
                <h1>{lst.offer}</h1>
              </div>
              <div className="absolute bottom-1.5 right-1.5 bg-[#5430b2c9] text-[#fff] w-8 h-8 rounded-full p-1">
                <h1>
                  <AddShoppingCartIcon />
                </h1>
              </div>
            </div>
            <div className="py-1 px-2 text-[15px] ">
              <h1 className="truncate" onClick={"#"}>
                {lst.desc}
              </h1>
            </div>
            <div className="py-1 px-2">
              <span>₹{lst.discountprice}</span>
              <del className="text-[#c6c4c4] mx-5">₹{lst.orgprice}</del>
            </div>
            <button type="submit" className="px-2 text-[#e65e2e] text-sm">
              {" "}
              View All
            </button>
          </div>
        ))}
      </Slider>
    </div>
    <div className="h-3 bg-gray-300"></div>
    </>

  );
};

export default FlashSale;
