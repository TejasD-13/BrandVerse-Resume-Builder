import React, { useEffect, useState } from 'react';
import { getLightColorFromImage } from '../../utils/helper';

function ResumeSummaryCard({ imgUrl, title, lastUpdated, onSelect }) {
  const [bgColor, setBgColor] = useState('#f9f9f9');

  useEffect(() => {
    if (imgUrl) {
      getLightColorFromImage(imgUrl)
        .then(setBgColor)
        .catch(() => setBgColor('#f9f9f9'));
    }
  }, [imgUrl]);

  return (
    <div
      onClick={onSelect}
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl rounded-xl border border-gray-200 overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="h-44 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt="Resume preview"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Preview</span>
        )}
      </div>

      <div className="bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {title || 'Untitled Resume'}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Last Updated: {lastUpdated || 'N/A'}
        </p>
      </div>
    </div>
  );
}

export default ResumeSummaryCard;
