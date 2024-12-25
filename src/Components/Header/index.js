import React from "react";
import { Carousel } from "react-responsive-carousel";

const Header = () => {
  return (
    
    <Carousel axis="vertical" className="flex-row stopOnHover={true} bg-indigo-950 pt-2 !h-10" infiniteLoop showStatus={false} showIndicators={false} autoPlay={true} time={3000} showArrows={false}>
      <div className="text-base font-medium text-white text-center bg-indigo-950">
        30+ Wakefit Furniture Stores across India.
        <span className="text-[#D24B39]"> Come, Visit Us!</span>
      </div>
      <div className="bg-indigo-950">
        <p className="text-base font-medium text-white text-center">Use code <span className="text-[#D24B39]" >  HAPPYHOME (till 7<sup>th</sup> Sep)</span> to Get upto 75% off + Additional 10% discount with bank offers.</p>
      </div>
    </Carousel>
   
  );
};

export default Header;
