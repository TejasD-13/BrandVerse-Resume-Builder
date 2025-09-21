import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import {useNavigate} from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import { LuCirclePlus, LuFileText, LuClock, LuSearch, LuFilter, LuGrid3X3, LuList } from 'react-icons/lu'
import moment from 'moment';
import ResumeSummaryCard from '../../components/Cards/ResumeSummaryCard';
import Modal from '../../components/Modal';
import CreateResumeForm from '../../pages/Home/CreateResumeForm';
import { toast } from "react-hot-toast";
//import { LuCirclePlus, LuFileText } from "react-icons/lu";

function Dashboard() {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'oldest'
  const [isLoading, setIsLoading] = useState(true);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeFormData, setResumeFormData] = useState(null);

  const fetchAllResumes = async() => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      setAllResumes(response.data);
    } catch (error) {
      console.error("Error fetching resume:", error);
    } finally {
      setIsLoading(false);
    }
  };

    const handleUploadResume = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("resumeFile", selectedFile);

    try {
      const response = await axiosInstance.post("/api/resume/parse", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resumeData = response.data.resume;

      // Prefill data for CreateResumeForm
      setResumeFormData(resumeData);
      setOpenUploadModal(false);
      setOpenCreateModal(true);

      toast.success("Resume parsed successfully!");
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast.error("Failed to parse resume. Please check the file format.");
    }
  };


  // Filter and sort resumes
  const filteredAndSortedResumes = React.useMemo(() => {
    if (!allResumes) return [];
    
    let filtered = allResumes.filter(resume =>
      resume.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
    }

    return filtered;
  }, [allResumes, searchTerm, sortBy]);

  useEffect(() => {
    fetchAllResumes();
  }, [])

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-[300px] bg-gray-200 rounded-xl"></div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
              <p className="text-gray-600 mt-1">
                {allResumes ? `${allResumes.length} resume${allResumes.length !== 1 ? 's' : ''} total` : 'Loading...'}
              </p>
            </div>
            
            <button
              onClick={() => setOpenCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <LuCirclePlus className="text-lg" />
              Create New Resume
            </button>

            <button
                  onClick={() => setOpenCreateModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <LuCirclePlus className="text-lg" />
                  Create New Resume
                </button>

                <button
                  onClick={() => setOpenUploadModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <LuFileText className="text-lg" />
                  Upload Old Resume
             </button>
          </div>

          {/* Search and Filter Bar */}
          {allResumes && allResumes.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resumes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                </select>
                
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <LuGrid3X3 />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <LuList />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6' 
            : 'space-y-4'
        }`}>
          {/* Create New Resume Card */}
          <div 
            className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${
              viewMode === 'list' ? 'order-last' : ''
            }`}
            onClick={() => setOpenCreateModal(true)}
          >
            <div className="h-[300px] flex flex-col gap-4 items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-dashed border-purple-200 hover:border-purple-400 hover:from-purple-100 hover:to-blue-100 transition-all duration-300">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <LuCirclePlus className="text-2xl text-white"/> 
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-800 mb-2">Create New Resume</h3>
                <p className="text-sm text-gray-600">Start building your professional resume</p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <>
              {[...Array(8)].map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </>
          )}

          {/* Resume Cards */}
          {!isLoading && filteredAndSortedResumes.map((resume, index) => (
            <div
              key={resume?._id}
              className="group cursor-pointer transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {viewMode === 'grid' ? (
                <ResumeSummaryCard
                  imgUrl={resume?.thumbnailLink || null}
                  title={resume.title}
                  lastUpdated={
                    resume?.updatedAt
                      ? moment(resume.updatedAt).format("DD MMM YYYY")
                      : ""
                  }
                  onSelect={() => navigate(`/resume/${resume?._id}`)}
                />
              ) : (
                // List View
                <div 
                  onClick={() => navigate(`/resume/${resume?._id}`)}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 flex items-center gap-4"
                >
                  <div className="w-16 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    {resume?.thumbnailLink ? (
                      <img 
                        src={resume.thumbnailLink} 
                        alt={resume.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <LuFileText className="text-2xl text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{resume.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <LuClock className="w-4 h-4" />
                      <span>
                        Updated {resume?.updatedAt ? moment(resume.updatedAt).fromNow() : 'Recently'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && filteredAndSortedResumes.length === 0 && allResumes && allResumes.length > 0 && (
          <div className="text-center py-12">
            <LuSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No resumes found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* No Resumes State */}
        {!isLoading && (!allResumes || allResumes.length === 0) && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <LuFileText className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Welcome to Resume Builder!</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't created any resumes yet. Start building your professional resume to stand out from the crowd.
            </p>
            <button
              onClick={() => setOpenCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
            >
              <LuCirclePlus className="text-lg" />
              Create Your First Resume
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader>
        <CreateResumeForm isModal={true} resumeFormData={resumeFormData} />
      </Modal>


      <Modal isOpen={openUploadModal} onClose={() => setOpenUploadModal(false)} hideHeader>
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Upload Your Old Resume</h3>

          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />

          <button
            onClick={handleUploadResume}
            disabled={!selectedFile}
            className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition ${
              selectedFile
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Upload & Parse
          </button>
        </div>
      </Modal>

    </DashboardLayout>
  )
}

export default Dashboard