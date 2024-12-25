import React, { useState, useEffect } from "react";
import img2 from "../../Asset/AdsSection/image2.jpg";
import img3 from "../../Asset/AdsSection/image3.webp";

export const AdsSection = ({isBanner}) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const deadline = "December, 31, 2024";




  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    if (isBanner) { 
      const interval = setInterval(() => getTime(deadline), 1000);
      return () => clearInterval(interval);
    }
  }, [isBanner]);

  if (!isBanner) {
    return null; 
  }



  return (
    <div>
      <div className="grid grid-cols-3 py-1 gap-3">
        <div className=" flex justify-center items-center px-10 gap-5 bg-[#F7F2ED]">
          <div>
            <img
              src="https://wakefitdev.gumlet.io/consumer-react/current-sales/FFSALE_desktop.webp?w=100"
              alt="Image not found"
              className="h-20"
            />
          </div>
          <div>
            <p className="text-[#000000] font-medium mx-5">Sale Ends In</p>
            <div className="flex gap-5 mx-5">
              <div>
                <div className="text-center font-semibold text-2xl  text-[#D24B39]">{days < 10 ? "0" + days : days}</div>
                <span>Days</span>
              </div>
              <div>
                <div className="text-center font-semibold text-2xl  text-[#D24B39]">{hours < 10 ? "0" + hours : hours}</div>
                <span>Hrs</span>
              </div>
              <div>
                <div className="text-center font-semibold text-2xl  text-[#D24B39]">{minutes < 10 ? "0" + minutes : minutes}</div>
                <span>Min</span>
              </div>
              <div>
                <div className="text-center font-semibold text-2xl  text-[#D24B39]">{seconds < 10 ? "0" + seconds : seconds}</div>
                <span>Sec</span>
              </div>
            </div>
          </div>
        </div>
        <div className="#">
          <img src={img2} alt="Image not found" />
        </div>
        <div>
          <img src={img3} alt="Image not found" />
        </div>
      </div>
      {/* <div className="h-1 bg-gray-300"></div> */}
    </div>
  );
};
