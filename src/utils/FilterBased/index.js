import React, { useState } from 'react';

const Filter = ({ onFilterChange }) => {
    const [newArrivals, setNewArrivals] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [discount, setDiscount] = useState('');

    const handleNewArrivalsChange = (value) => {
        setNewArrivals(value);
    };

    const handlePriceChange = (value) => {
        setPriceRange(value);
    };

    const handleDiscountChange = (value) => {
        setDiscount(value);
    };

    return (
        <div className="space-y-4 w-full "> {/* Responsive width */}
            {/* New Arrivals */}
            <div className='bg-transparent px-4 py-2 rounded'>
                <h2 className="font-semibold mb-2">New Arrivals</h2>
                <ul className="space-y-2">
                    {['Last 7 days', 'Last 15 days', 'Last 30 days'].map((option) => (
                        <li
                            key={option}
                            className={`cursor-pointer p-1 rounded ${newArrivals === option ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                            onClick={() => handleNewArrivalsChange(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Range */}
            <div className='bg-transparent px-4 py-2 rounded'>
                <h2 className="font-semibold mb-2">Price</h2>
                <ul className="space-y-2">
                    {['Under ₹ 100', '₹ 100 - ₹ 200', '₹ 200 - ₹ 500', '₹ 500 - ₹ 1000', 'Above ₹ 1000'].map((option) => (
                        <li
                            key={option}
                            className={`cursor-pointer p-1 rounded ${priceRange === option ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                            onClick={() => handlePriceChange(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Discount */}
            <div className='bg-transparent px-4 py-2 rounded'>
                <h2 className="font-semibold mb-2">Discount</h2>
                <ul className="space-y-2">
                    {['10% off or more', '25% off or more', '35% off or more'].map((option) => (
                        <li
                            key={option}
                            className={`cursor-pointer p-1 rounded ${discount === option ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                            onClick={() => handleDiscountChange(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Filter;


// import React, { useState } from 'react';

// const Filter = () => {
//     const [newArrivals, setNewArrivals] = useState('');
//     const [priceRange, setPriceRange] = useState('');
//     const [discount, setDiscount] = useState('');

//     const handleNewArrivalsChange = (value) => {
//         setNewArrivals(value);
//     };

//     const handlePriceChange = (value) => {
//         setPriceRange(value);
//     };

//     const handleDiscountChange = (value) => {
//         setDiscount(value);
//     };

//     return (
//         <div className="space-y-4 w-[35%]">

//             {/* New Arrivals */}
//             <div className='bg-[#f1f2f2] p-4 rounded'>
//                 <h2 className="font-semibold mb-2">New Arrivals</h2>
//                 <ul className="space-y-2">
//                     {['Last 7 days', 'Last 15 days', 'Last 30 days'].map((option) => (
//                         <li
//                             key={option}
//                             className={`cursor-pointer p-2 rounded ${newArrivals === option ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
//                             onClick={() => handleNewArrivalsChange(option)}
//                         >
//                             {option}
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             {/* Price Range */}
//             <div className='bg-[#f1f2f2] p-4 rounded'>
//                 <h2 className="font-semibold mb-2">Price</h2>
//                 <ul className="space-y-2">
//                     {['Under ₹ 100', '₹ 100 - ₹ 200', '₹ 200 - ₹ 500', '₹ 500 - ₹ 1000', 'Above ₹ 1000'].map((option) => (
//                         <li
//                             key={option}
//                             className={`cursor-pointer p-2 rounded ${priceRange === option ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
//                             onClick={() => handlePriceChange(option)}
//                         >
//                             {option}
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             {/* Discount */}
//             <div className='bg-[#f1f2f2] p-4 rounded'>
//                 <h2 className="font-semibold mb-2">Discount</h2>
//                 <ul className="space-y-2">
//                     {['10% off or more', '25% off or more', '35% off or more'].map((option) => (
//                         <li
//                             key={option}
//                             className={`cursor-pointer p-2 rounded ${discount === option ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
//                             onClick={() => handleDiscountChange(option)}
//                         >
//                             {option}
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//         </div>
//     );
// };

// export default Filter;