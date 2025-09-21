import React, { useState, useRef, useEffect } from 'react';

function DateInput({ value, onChange, label, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const dropdownRef = useRef(null);

  // Generate years from 1950 to current year + 10
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 11 }, (_, i) => 1950 + i);
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [year, month] = value.split('-');
      setSelectedYear(year || '');
      setSelectedMonth(month || '');
    }
  }, [value]);

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
    setSelectedYear(year);
    if (selectedMonth) {
      onChange({ target: { value: `${year}-${selectedMonth}` } });
    }
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    if (selectedYear) {
      onChange({ target: { value: `${selectedYear}-${month}` } });
    }
  };

  const formatDisplayValue = () => {
    if (!selectedYear && !selectedMonth) return '';
    
    const monthLabel = months.find(m => m.value === selectedMonth)?.label || '';
    return `${monthLabel} ${selectedYear}`.trim();
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
          placeholder={placeholder || "Select date"}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          value={formatDisplayValue()}
          onClick={() => setIsOpen(!isOpen)}
          readOnly
        />

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            <div className="p-3">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                >
                  <option value="">Select Month</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DateInput; 