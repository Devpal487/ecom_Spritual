import React, { useState } from 'react';
import { FcPrevious, FcNext } from "react-icons/fc";
import { ImLast, ImFirst } from "react-icons/im";
import { useTheme } from '../ThemeContext';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPage,
}) => {
  const theme = useTheme()
  const pageNumbersToShow = 5;

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const getDisplayedPageNumbers = () => {
    const pages = [];

    if (totalPages <= pageNumbersToShow + 2) {
      // If total pages are fewer than the visible pages + first/last, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show the first page
      pages.push(1);

      // Show ellipsis if the current page is far from the beginning
      if (currentPage > pageNumbersToShow) {
        pages.push('...');
      }

      // Show pages around the current page
      const startPage = Math.max(2, currentPage - 1); // Start after the first page
      const endPage = Math.min(totalPages - 1, currentPage + 1); // End before the last page

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Show ellipsis if the current page is far from the end
      if (currentPage < totalPages - (pageNumbersToShow - 1)) {
        pages.push('...');
      }

      // Always show the last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center m-4">

      {/* First Page Button */}
      {currentPage !== 1 && (
        <button
          onClick={handleFirstPage}
          className="px-3 py-2 mr-2  text-white rounded focus:outline-none"
        >
          <ImFirst size={18} color='#7FC2F8'/>
        </button>
      )}

      {/* Previous Button */}
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`px-4 py-2 mr-2 text-black rounded focus:outline-none ${
          currentPage === 1 ? "opacity-50" : ""
        }`}
      >
        <FcPrevious />
      </button>

      {/* Page Numbers */}
      {getDisplayedPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-2">...</span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-2 m-1 ${
                page === currentPage
                  ? "bg-blue-600 text-white rounded-full"
                  : "bg-gray-200 text-gray-800"
              } rounded focus:outline-none`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Last Page Button */}

      {/* Next Button */}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 ml-2 text-black rounded focus:outline-none ${
          currentPage === totalPages ? "opacity-50" : ""
        }`}
      >
        <FcNext />
      </button>
      
      {currentPage !== totalPages && (
        <button
          onClick={handleLastPage}
          className="px-2 py-2 ml-2 text-black rounded focus:outline-none"
        >
          <ImLast size={18} color='#7FC2F8'/>
        </button>
      )}

      {/* Items per page dropdown */}
      <div className="ml-4">
        <label htmlFor="itemsPerPage" className="mr-2" style={{color: `${theme.theme.textColor}`}}>Items/page:</label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value={2}>2</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
