import React, { useEffect, useMemo } from 'react';
import { Document } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { PdfPages } from './PdfPages';
import { PdfToolbar } from './PdfToolbar';
import { usePdfState } from './usePdfState';
import { PDF_OPTIONS } from './PDF_OPTIONS';

export const SecurePdfViewer = ({ pdfData }) => {
  const { numPages, scale, setNumPages, setScale } = usePdfState();
  
  // Memoize the file object to prevent unnecessary reloads
  const file = useMemo(() => pdfData, [pdfData]);

  // Check if the file is a valid blob URL
  useEffect(() => {
    if (!file.startsWith('blob:')) {
      console.error('Invalid PDF blob URL:', file);
    }
  }, [file]);

  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl">
        <PdfToolbar scale={scale} setScale={setScale} />
        
        <div 
          className="overflow-auto mt-4 max-h-[calc(100vh-8rem)]"
          style={{ 
            userSelect: 'none',
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            options={PDF_OPTIONS}
            loading={
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            }
            error={
              <div className="text-red-500 text-center p-4">
                Failed to load PDF document
              </div>
            }
          >
            <PdfPages numPages={numPages} scale={scale} />
          </Document>
        </div>
      </div>
    </div>
  );
}