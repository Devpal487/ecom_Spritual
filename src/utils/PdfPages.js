import React from 'react';
import { Page } from 'react-pdf';
import { MAX_PAGES } from './PDF_OPTIONS';

export const PdfPages = ({ numPages, scale }) => {
  const pagesToShow = Math.min(numPages, MAX_PAGES);
  
  return (
    <>
      {Array.from(new Array(pagesToShow), (_, index) => (
        <div key={`page_${index + 1}`} className="mb-4">
          <Page
            pageNumber={index + 1}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="mx-auto shadow-lg"
            loading={
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            }
          />
        </div>
      ))}
      {numPages > MAX_PAGES && (
        <div className="text-center py-4 text-gray-600">
          Preview limited to first {MAX_PAGES} pages
        </div>
      )}
    </>
  );
};


// import React from 'react';
// import { Page } from 'react-pdf';
// import { MAX_PAGES } from './PDF_OPTIONS';

// interface PdfPagesProps {
//   numPages: number;
//   scale: number;
// }

// export const PdfPages: React.FC<PdfPagesProps> = ({ numPages, scale }) => {
//   const pagesToShow = Math.min(numPages, MAX_PAGES);
  
//   return (
//     <>
//       {Array.from(new Array(pagesToShow), (_, index) => (
//         <div key={`page_${index + 1}`} className="mb-4">
//           <Page
//             pageNumber={index + 1}
//             scale={scale}
//             renderTextLayer={false}
//             renderAnnotationLayer={false}
//             className="mx-auto shadow-lg"
//             loading={
//               <div className="flex items-center justify-center p-4">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
//               </div>
//             }
//           />
//         </div>
//       ))}
//       {numPages > MAX_PAGES && (
//         <div className="text-center py-4 text-gray-600">
//           Preview limited to first {MAX_PAGES} pages
//         </div>
//       )}
//     </>
//   );
// }