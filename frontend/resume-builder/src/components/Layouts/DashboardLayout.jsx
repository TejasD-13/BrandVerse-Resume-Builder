import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar'; // now importing it

function DashboardLayout({ activeMenu, children }) {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="pt-20 container mx-auto">
          {/* pt-20 = 5rem to push content below fixed navbar */}
          {children}
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;
