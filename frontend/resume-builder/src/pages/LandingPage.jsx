import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Signup from './Auth/Signup';
import Login from './Auth/Login';
import Modal from '../components/Modal';
import Navbar from '../components/Layouts/Navbar';
import { UserContext } from '../context/userContext';

function LandingPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModel(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-gray-50 to-white'>
      <div className='container mx-auto px-6 py-8 pt-24'>
        
        {/* Header */}
        <Navbar onAuthClick={() => setOpenAuthModel(true)} />

        {/* Hero Section - Resume Builder */}
        <section className='flex flex-col lg:flex-row items-center gap-16 mb-32'>
          <div className='w-full lg:w-1/2 space-y-8'>
            <h1 className='text-5xl lg:text-6xl font-bold leading-tight text-gray-900'>
              Build Your{' '}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-green-500'>
                Resume Effortlessly
              </span>
            </h1>
            <p className='text-xl text-gray-600 leading-relaxed max-w-xl'>
              Craft a professional resume in minutes with our smart resume builder.
            </p>
            <button
              className='bg-black text-white px-10 py-4 text-lg font-semibold rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              onClick={handleCTA}
            >
              Get Started
            </button>
          </div>
          <div className='w-full lg:w-1/2'>
            <div className='relative'>
              <img
                src='/resume-hero-img.jpg'
                alt='Resume builder illustration'
                className='w-full rounded-2xl shadow-2xl'
              />
              <div className='absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-xl'></div>
              <div className='absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 blur-xl'></div>
            </div>
          </div>
        </section>

        {/* Resume Analyzer Section */}
        <section className='flex flex-col lg:flex-row-reverse items-center gap-16 mb-32'>
          <div className='w-full lg:w-1/2 space-y-8'>
            <h2 className='text-5xl lg:text-6xl font-bold leading-tight text-gray-900'>
              AI-Powered{' '}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-500'>
                Resume Analyzer
              </span>
            </h2>
            <p className='text-xl text-gray-600 leading-relaxed max-w-xl'>
              Get comprehensive AI insights on your resume's structure, content quality, and optimization suggestions to make it stand out to recruiters.
            </p>
            <button
              className='bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 text-lg font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              onClick={() => navigate('/resume-analyzer')}
            >
              📊 Analyze Your Resume
            </button>
          </div>
          <div className='w-full lg:w-1/2'>
            <div className='relative'>
              <img
                src='/resume-analyse.png'
                alt='Resume analyzer tool interface'
                className='w-full rounded-2xl shadow-2xl'
                onError={(e) => {
                  // Fallback to placeholder if image doesn't load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className='w-full h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-2xl overflow-hidden' style={{display: 'none'}}>
                <div className='p-8'>
                  <div className='bg-white rounded-xl p-6 shadow-lg'>
                    <div className='flex items-center gap-4 mb-4'>
                      <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold'>
                        A+
                      </div>
                      <div>
                        <div className='h-4 bg-green-400 rounded w-32 mb-2'></div>
                        <div className='h-3 bg-gray-200 rounded w-24'></div>
                      </div>
                    </div>
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2'>
                        <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                        <div className='h-3 bg-gray-200 rounded flex-1'></div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                        <div className='h-3 bg-gray-200 rounded flex-1'></div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                        <div className='h-3 bg-gray-200 rounded flex-1'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full opacity-20 blur-xl'></div>
              <div className='absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 blur-xl'></div>
            </div>
          </div>
        </section>

        {/* ATS Score Checker Section */}
        <section className='flex flex-col lg:flex-row items-center gap-16 mb-32'>
          <div className='w-full lg:w-1/2 space-y-8'>
            <h2 className='text-5xl lg:text-6xl font-bold leading-tight text-gray-900'>
              Beat the{' '}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500'>
                ATS System
              </span>
            </h2>
            <p className='text-xl text-gray-600 leading-relaxed max-w-xl'>
              Compare your resume against job descriptions and get an ATS compatibility score with detailed recommendations for optimization.
            </p>
            <Link to="/ats-score-checker">
              <button
                className='bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 text-lg font-semibold rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              >
                🎯 Check ATS Score
              </button>
            </Link>
          </div>
          <div className='w-full lg:w-1/2'>
            <div className='relative'>
              <img
                src='/ats-score-img.jpeg'
                alt='ATS score checker tool interface'
                className='w-full rounded-2xl shadow-2xl'
                onError={(e) => {
                  // Fallback to placeholder if image doesn't load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className='w-full h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl shadow-2xl overflow-hidden' style={{display: 'none'}}>
                <div className='p-8'>
                  <div className='bg-white rounded-xl p-6 shadow-lg'>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='text-sm font-medium text-gray-600'>ATS Score</div>
                      <div className='text-2xl font-bold text-green-600'>85%</div>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-3 mb-4'>
                      <div className='bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full' style={{width: '85%'}}></div>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                        <div className='h-2 bg-gray-200 rounded w-3/4'></div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                        <div className='h-2 bg-gray-200 rounded w-1/2'></div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                        <div className='h-2 bg-gray-200 rounded w-2/3'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full opacity-20 blur-xl'></div>
              <div className='absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 blur-xl'></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='mb-20'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-gray-900 mb-4'>
              Features That Make You Shine ✨
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Everything you need to create a professional resume that gets noticed by recruiters
            </p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
            <div className='group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200'>
              <div className='w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center text-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300'>
                ✏️
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>Easy Editing</h3>
              <p className='text-gray-600 leading-relaxed'>
                Live preview, auto-formatting, and section-level editing for seamless resume building.
              </p>
            </div>
            
            <div className='group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200'>
              <div className='w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300'>
                🎨
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>Beautiful Templates</h3>
              <p className='text-gray-600 leading-relaxed'>
                Pick from stunning professional templates optimized for different industries and roles.
              </p>
            </div>
            
            <div className='group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200'>
              <div className='w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300'>
                📄
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>One-Click Export</h3>
              <p className='text-gray-600 leading-relaxed'>
                Download your resume instantly as a polished PDF with perfect formatting and layout.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='text-center py-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl text-white'>
          <h2 className='text-4xl font-bold mb-6'>Ready to Build Your Perfect Resume?</h2>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            Join thousands of professionals who have already created their winning resumes
          </p>
          <button
            className='bg-white text-gray-900 px-10 py-4 text-lg font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            onClick={handleCTA}
          >
            Start Building Now
          </button>
        </section>
      </div>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModel}
        onClose={() => {
          setOpenAuthModel(false);
          setCurrentPage('login');
        }}
        hideHeader
      >
        <div>
          {currentPage === 'login' && (
            <Login
              setCurrentPage={setCurrentPage}
              setOpenAuthModel={setOpenAuthModel}
            />
          )}
          {currentPage === 'signup' && (
            <Signup setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </div>
  );
}

export default LandingPage;