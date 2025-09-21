import React, { useState, useRef, useEffect } from 'react';

function YearInput({ value, onChange, label, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Generate years from 1950 to current year + 10
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 11 }, (_, i) => 1950 + i);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleYearChange = (year) => {
    onChange({ target: { value: year } });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        <input
          type="text"
          placeholder={placeholder || "Select year"}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          value={value || ''}
          onClick={() => setIsOpen(!isOpen)}
          readOnly
        />

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            <div className="p-2">
              {years.map((year) => (
                <div
                  key={year}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleYearChange(year.toString())}
                >
                  {year}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default YearInput; 