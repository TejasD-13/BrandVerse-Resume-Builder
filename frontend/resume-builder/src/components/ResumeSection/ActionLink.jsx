import React from 'react';

const ActionLink = ({ icon, link, bgColor }) => {
  if (!link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 no-underline"
    >
      <div
        className="w-[25px] h-[25px] flex items-center justify-center rounded-full"
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </div>

      <p className="text-[13px] font-medium underline break-all">
        {link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
      </p>
    </a>
  );
};

export default ActionLink;
