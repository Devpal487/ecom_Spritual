import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
 
import { ContentData, NextArrow, PrevArrow } from "../../Data/Discount"; 


const DiscountPartner = () => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    // slidesToScroll: 1,
    NextArrow: <NextArrow/>,
    PrevArrow : <PrevArrow/>,
    // initialSlide: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <>
        <Slider {...settings} className="bg-[#4f4174]">
    {ContentData.map((lst)=>(
          <div key={lst.id}>
            <div className="bg-white flex items-center justify-center my-5 h-16 rounded gap-5 mx-5">
              <div >
                <img src={lst.src} className="w-20 h-8 mx-2 border-none"/>
              </div>
              <div className='list-none'> 
                <li className="font-semibold text-sm">{lst.dis}</li>
                <h1  className="font-normal text-xs">{lst.tag}</h1>
              </div>
            </div>    
          </div>
     ))}
        </Slider>
        <div className="h-3 bg-gray-300"></div>   
    </>
  );
}

export default DiscountPartner




//     return (
//       <div>
//       </div>
//     );
//   }
// }

{/* <div>
<Carousel  slideToShow={3} showArrows={true} showStatus={true} showIndicators={true}>
   <div className=' flex bg-white rounded items-center h-20 w-80'>
       <div><img src={UPI}/></div>
       <div> 
           <li>Upto 78% OFF on MRP</li>
           <li>UPI</li>
       </div>
   </div>   
   
</Carousel> 
</div> */}

{/* <Carousel responsive={responsive} className='py-5 px-10 bg-[#4f4174]'>
   <div className=' flex bg-white rounded items-center  h-20 p-5 max-w-fit'>
        
        </div>
    </div> 
    <div className=' flex bg-white rounded items-center h-20 w-80'>
        
    </div> 
    <div className=' flex bg-white rounded items-center h-20 w-80'>
        
    </div> 
    <div className=' flex bg-white rounded items-center h-20 w-80'>
        <div><img src={UPI}/></div>
        <div> 
            <li>Upto 78% OFF on MRP</li>
            <li>UPI</li>
        </div>
    </div>  
 </Carousel> */}