import React, { useEffect, useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

const PDFViewers = ({ fileUrl }) => {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const containerRef = useRef(null);

  // Maximum pages to render
  const MAX_PAGES = 10;

  // Function to load and render the PDF
  const loadPdf = async (url) => {
    try {
      const pdfDocument = await pdfjsLib.getDocument(url).promise;
      setPdf(pdfDocument);
      setNumPages(Math.min(pdfDocument.numPages, MAX_PAGES));

      renderPages(currentPage);  // Render the first two pages initially
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  // Function to render two pages at once
  const renderPages = async (startPage) => {
    if (!pdf) return;

    const pageContents = [];

    // Render the pages in pairs (two pages at a time)
    for (let i = startPage; i < Math.min(startPage + 2, numPages); i++) {
      const pageData = await renderPage(i);
      if (pageData) {
        pageContents.push(pageData);
      }
    }

    setPages((prevPages) => [...prevPages, ...pageContents]);  // Append the new pages
  };

  // Function to render a single page to canvas
  const renderPage = async (pageNum) => {
    if (!pdf) return null;

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale for quality

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');

    // Render the page onto the canvas
    await page.render({
      canvasContext: context,
      viewport: viewport,
    });

    return canvas;  // Return the rendered canvas
  };

  // Load the PDF when the component mounts
  useEffect(() => {
    if (fileUrl) {
      loadPdf(fileUrl);
    }
  }, [fileUrl]);

  // Handle scrolling to load next pages
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    // Check if we're near the bottom of the container
    const scrollPosition = container.scrollTop + container.clientHeight;
    const bottomPosition = container.scrollHeight;

    if (scrollPosition >= bottomPosition - 200) {
      // Load next pages if we're near the bottom
      if (currentPage + 2 <= numPages) {
        setCurrentPage((prevPage) => prevPage + 2);
        renderPages(currentPage + 2);
      }
    }
  };

  // Attach the scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentPage, numPages]);

  return (
    <div
      className="pdf-viewer"
      ref={containerRef}
      style={{ height: '80vh', overflowY: 'auto', padding: '10px' }}
    >
      {/* Render page pairs (two pages at once) */}
      <div className="pdf-booklet" style={{ display: 'flex', flexDirection: 'column' }}>
        {pages.map((pageCanvas, index) => (
          <div key={index} className="pdf-page" style={{ width: '100%', marginBottom: '20px' }}>
            {pageCanvas && <img src={pageCanvas.toDataURL()} alt={`page ${index + 1}`} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDFViewers;