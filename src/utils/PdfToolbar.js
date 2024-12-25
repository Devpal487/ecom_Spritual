import React from 'react';
import { CiZoomIn, CiZoomOut } from "react-icons/ci";

export const PdfToolbar = ({ scale, setScale }) => {
  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={zoomOut}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
        title="Zoom Out"
      >
        <CiZoomOut className="w-5 h-5" />
      </button>
      <button
        onClick={zoomIn}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
        title="Zoom In"
      >
        <CiZoomIn className="w-5 h-5" />
      </button>
    </div>
  );
};


// import React from 'react';
// import { CiZoomIn, CiZoomOut } from "react-icons/ci";

// interface PdfToolbarProps {
//   scale: number;
//   setScale: (scale: number) => void;
// }

// export const PdfToolbar: React.FC<PdfToolbarProps> = ({ scale, setScale }) => {
//   const zoomIn = () => setScale((prev:any) => Math.min(prev + 0.1, 2.0));
//   const zoomOut = () => setScale((prev:any) => Math.max(prev - 0.1, 0.5));

//   return (
//     <div className="flex justify-end gap-2">
//       <button
//         onClick={zoomOut}
//         className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
//         title="Zoom Out"
//       >
//         <CiZoomOut className="w-5 h-5" />
//       </button>
//       <button
//         onClick={zoomIn}
//         className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
//         title="Zoom In"
//       >
//         <CiZoomIn className="w-5 h-5" />
//       </button>
//     </div>
//   );
// };