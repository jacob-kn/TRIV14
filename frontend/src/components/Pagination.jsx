import React, { useState, useEffect } from 'react';

function Pagination({ totalPages, currentPage, onPageChange }) {
  const [visiblePages, setVisiblePages] = useState([]);

  useEffect(() => {
    const calculateVisiblePages = () => {
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      } else if (currentPage <= 3) {
        return [1, 2, 3, 4, '...'];
      } else if (currentPage >= totalPages - 2) {
        return [
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        return ['...', currentPage - 1, currentPage, currentPage + 1, '...'];
      }
    };

    setVisiblePages(calculateVisiblePages());
  }, [totalPages, currentPage]);

  return (
    <div className="flex justify-center items-center gap-3 mt-8">
      <button
        className="flex justify-center items-center px-4 py-2 rounded-md bg-surface text-white hover:opacity-80 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      <div className="flex gap-1">
        {visiblePages.map((page, index) => (
          <button
            key={index}
            className={`flex justify-center items-center px-4 py-2 rounded-md hover:opacity-80 ${
              page === currentPage
                ? 'bg-gray-200 text-bunker-200'
                : 'bg-surface text-white'
            }`}
            onClick={() => onPageChange(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        className="flex justify-center items-center px-4 py-2 rounded-md bg-surface text-white hover:opacity-80 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
