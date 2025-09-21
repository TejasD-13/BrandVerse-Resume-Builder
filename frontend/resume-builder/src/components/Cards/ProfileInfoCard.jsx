import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom';

function ProfileInfoCard() {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate()

    const handleLogout = () => {
        clearUser();
        navigate("/");
    }

  return (
    user && (
    <div className='flex items-center'>
        {user?.profileImageUrl
          ? (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className='w-11 h-11 bg-gray-300 rounded-full mr-3'
            />
          )
          : (
            <div className='w-11 h-11 bg-gray-300 rounded-full mr-3 flex items-center justify-center'>
              <span className='text-gray-500 text-xs'>No Image</span>
            </div>
          )
        }

       <div>
            <div className='text-[15px] font-bold leading-3'> { user?.name || "Unnamed User"}</div>
            <button
             className='text-purple-500 text-sm font-semibold cursor-pointer hover:underline'
             onClick={handleLogout}>
                Logout
             </button>
       </div>
    </div>
  )
 );
}

export default ProfileInfoCard