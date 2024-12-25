import React from "react";
import MoodRoundedIcon from "@mui/icons-material/MoodRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import { useTheme } from "../../utils/Provider/ThemeContext";

const AdsBanner = ({isaddSection}) => {
  const { theme } = useTheme();

  if (!isaddSection) {
    return null; 
};

  return (
    <>
      <div className={`${theme.backgroundSecondaryColor} } h-3`} ></div>
      <div style={{color:theme.textColor}} className="flex flex-wrap items-center justify-around mx-4 sm:mx-8 lg:mx-28 py-5 font-medium">
        <div className={`${theme.iconBackgroundColor} h-10 w-10 rounded-full flex items-center justify-center`}>
          <MoodRoundedIcon className={`${theme.iconColor} m-2`} />
        </div>
        <div className={`${theme.textSecondaryColor} text-center text-sm sm:text-base md:text-lg`}>
          Million+ Happy Customers
        </div>

        <div className={`${theme.iconBackgroundColor} h-10 w-10 rounded-full flex items-center justify-center`}>
          <LocalShippingRoundedIcon className={`${theme.iconColor} m-2`} />
        </div>
        <div className={`${theme.textSecondaryColor} text-center text-sm sm:text-base md:text-lg`}>
          Free Shipping
        </div>

        <div className={`${theme.iconBackgroundColor} h-10 w-10 rounded-full flex items-center justify-center`}>
          <HandymanRoundedIcon className={`${theme.iconColor} m-2`} />
        </div>
        <div className={`${theme.textSecondaryColor} text-center text-sm sm:text-base md:text-lg`}>
          Free Installation
        </div>

        <div className={`${theme.iconBackgroundColor} h-10 w-10 rounded-full flex items-center justify-center`}>
          <CreditCardRoundedIcon className={`${theme.iconColor} m-2`} />
        </div>
        <div className={`${theme.textSecondaryColor} text-center text-sm sm:text-base md:text-lg`}>
          No Cost EMIs
        </div>
      </div>
      <div className={`${theme.backgroundSecondaryColor} h-3`}></div>
    </>
  );
};

export default AdsBanner;
