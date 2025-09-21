import React, { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserContext } from '../../context/userContext'
import ProfileInfoCard from '../Cards/ProfileInfoCard'

function Navbar({ onAuthClick }) {
  const { user } = useContext(UserContext)
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    {
      name: 'Resume Builder',
      path: '/dashboard',
      icon: '📄',
      description: 'Create professional resumes'
    },
    {
      name: 'ATS Scanner',
      path: '/ats-score-checker',
      icon: '🔍',
      description: 'Check ATS compatibility'
    },
    {
      name: 'Resume Analyzer',
      path: '/resume-analyzer',
      icon: '📊',
      description: 'Get detailed insights'
    }
  ]

  const isActivePath = (path) => location.pathname === path

  return (
        <nav className='fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm'>
      <div className='container mx-auto px-6 py-4 flex items-center justify-between'>

        {/* Left: Logo */}
        <Link to='/' className='flex items-center space-x-2'>
          <h2 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
            Resumate
          </h2>
        </Link>

        {/* Right: Navigation + Auth/Profile */}
        <div className='flex items-center space-x-6'>

          {/* Desktop Navigation (aligned right) */}
          <div className='hidden lg:flex items-center space-x-1'>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className='flex items-center space-x-2'>
                  <span className='text-base'>{item.icon}</span>
                  <span>{item.name}</span>
                </div>

                {/* Tooltip */}
                <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
                  {item.description}
                  <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900'></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Auth/Profile */}
          {user ? (
            <ProfileInfoCard />
          ) : (
            <button
              className='bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              onClick={onAuthClick}
            >
              Get Started
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className='lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className='w-5 h-5 flex flex-col justify-center space-y-1'>
              <div className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className='lg:hidden mt-4 py-4 border-t border-gray-200/50'>
            <div className='grid gap-2 px-4'>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(item.path)
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className='text-lg'>{item.icon}</span>
                  <div>
                    <div className='font-medium'>{item.name}</div>
                    <div className='text-xs text-gray-500 mt-0.5'>{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>

  )
}

export default Navbar
