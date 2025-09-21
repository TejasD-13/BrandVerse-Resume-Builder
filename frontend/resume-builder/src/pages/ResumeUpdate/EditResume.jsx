import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import {
  LuArrowLeft,
  LuCircleAlert,
  LuDownload,
  LuPalette,
  LuSave,
  LuTrash2,
  LuTrash,
  LuFileText,
} from 'react-icons/lu';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import {useReactToPrint} from 'react-to-print';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import TitleInput from '../../components/Inputs/TitleInput';
import uploadResumeImages from '../../utils/uploadImage';
import StepProgress from '../../components/ResumeTemplates/StepProgress';
import  ProfileInfoForm from './Forms/ProfileInfoForm';
import ContactInfoForm from './Forms/ContactInfoForm';
import WorkExperienceForm from './Forms/WorkExperienceForm';
import EducationDetailsForm from './Forms/EducationDetailsForm';
import SkillsInfoForm from './Forms/SkillsInfoForm';
import ProjectsDeatilForm from './Forms/ProjectsDeatilForm';
import AdditionalInfoCard from './Forms/AdditionalInfoCard';
import CertificationInfoForm from './Forms/CertificationInfoForm';
import RenderResume from '../../components/ResumeTemplates/RenderResume'
import html2canvas from 'html2canvas';
import Modal from '../../components/Modal'
import ThemeSelector from './ThemeSelector';
import Chatbot from '../../components/Chatbot/Chatbot';
import { DUMMY_RESUME_DATA } from '../../utils/data';

function EditResume() {
  const {resumeId} = useParams();
  const navigate = useNavigate();

  const resumeRef = useRef(null);
  const resumeDownloadRef = useRef(null);

  const [baseWidth, setBaseWidth] = useState(800);

  const [openThemeSelector, setOpenThemeSelector] = useState(false);

  const [openPreviewModel, setOpenPreviewModel] = useState(false);

  const [currentPage, setCurrentPage] = useState('profile-info');
  const [progress, setProgress] = useState()
  const[resumeData, setResumeData] = useState({
    title: "",
    thumbnail:"",
    profileInfo: {
      profileImg: null,
      profilePreviewUrl: "",
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "",
      colorPalette: "",
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
      github: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "", 
        endDate: "", 
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certification: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0,
      },
    ],
    interests: [""],
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Remove currentPage, progress, goToNextStep, goBack, validateAndNext, and renderForm logic

  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));

  }

  const updateArrayItem = (section, index, key, value) => {
  setResumeData((prev) => {
    const currentSection = prev[section];

    // Safety check
    if (!Array.isArray(currentSection)) {
      console.error(`Section "${section}" is not an array`, currentSection);
      return prev;
    }

    const updatedArray = [...currentSection];

    if (key == null) {
      updatedArray[index] = value;
    } else {
      updatedArray[index] = {
        ...updatedArray[index],
        [key]: value,
      };
    }

    return {
      ...prev,
      [section]: updatedArray,
    };
  });
};


  const addArrayItem = (section, newItem) => {
  setResumeData((prev) => {
    const currentSection = prev[section];

    // Safety check: If the section is not an array, initialize it as one
    const updatedArray = Array.isArray(currentSection)
      ? [...currentSection, newItem]
      : [newItem];

    return {
      ...prev,
      [section]: updatedArray,
    };
  });
};



  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray.splice(index,1);
      return {
        ...prev,
        [section]: updatedArray,
      }
    })
  }

  const fetchResumeDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.GET_BY_ID(resumeId)
      );
      console.log("Resume response:", response.data);

      if(response.data) {
        const resumeInfo = response.data;
        console.log("Fetched resumeInfo:", resumeInfo);
        setResumeData((prevState) => ({
          ...prevState,
          ...resumeInfo,
          profileInfo: {
            profileImg: null,
            profilePreviewUrl: "",
            fullName: "",
            designation: "",
            summary: "",
            ...(resumeInfo.profileInfo || {})
          },
          contactInfo: {
            email: "",
            phone: "",
            location: "",
            linkedin: "",
            github: "",
            website: "",
            ...(resumeInfo.contactInfo || {})
          },
          workExperience: resumeInfo.workExperience || [],
          education: resumeInfo.education || [],
          skills: resumeInfo.skills || [],
          projects: resumeInfo.projects || [],
          certification: resumeInfo.certification || [],
          languages: resumeInfo.languages || resumeInfo.language || [],
          interests: resumeInfo.interests || [],
        }));
      }
    } catch (error){
      console.error("Error fetching resumes:" , error);
    }
  };

  const uploadResumeImages = async() => {
    try {
      setIsLoading(true)

      // Patch oklch() colors in the resume DOM before html2canvas
      patchOklchColors(resumeRef.current);

      // Patch background color to avoid oklch error in html2canvas
      const resumeEl = resumeRef.current;
      const originalBg = resumeEl.style.backgroundColor;
      resumeEl.style.backgroundColor = '#fff';

      const imageDataUrl = await captureElementAsImage(resumeEl)

      // Restore original background color
      resumeEl.style.backgroundColor = originalBg;

      //convert base64 to file
      const thumbnailFile = dataURLtoFile(
        imageDataUrl,
        `resume-${resumeId}.png`
      );

      const profileImageFile = resumeData?.profileInfo?.profileImg || null;

      const formData = new FormData();
      if(profileImageFile) formData.append("profileImage", profileImageFile);
      if(thumbnailFile) formData.append("thumbnail", thumbnailFile);

      const uploadResponse = await axiosInstance.post(
        API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
        formData,
        { headers: {"Content-Type": "multipart/form-data"}}
      );

      const { thumbnailLink , profilePreviewUrl } = uploadResponse.data;
      console.log("RESUME_DATA__", resumeData);

      // CALL the second api to update other resume data
      await updateResumeDetails(thumbnailLink, profilePreviewUrl);

      toast.success("Resume Updated Successfully!");
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Error uploading images: ", error);
      toast.error("Failed to upload images ")
      
    } finally {
      setIsLoading(false);
    }
  }

  const updateResumeDetails = async (thumbnail, profilePreviewUrl) => {
    try {
      setIsLoading(true);

      console.log("Saving resumeData:", resumeData);
      const response = await axiosInstance.put(
        API_PATHS.RESUME.UPDATE(resumeId),
        {
          ...resumeData,
          thumbnailLink: thumbnail || "",
          profileInfo: {
            ...resumeData.profileInfo,
            profilePreviewUrl: profilePreviewUrl || ""
          },
        }
      );
      console.log("profileInfo being saved:", resumeData.profileInfo);
    } catch (error) {
      console.error("Error Capturing image", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Delete 
  const handleDeleteResume = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success('Resume Deleted Successfully')
      navigate('/dashboard')
    } catch (error) {
      console.error("Error capturing image: ", error);
      
    }finally{
      setIsLoading(false);
    }
  }

  const reactToPrintFn = useReactToPrint({ contentRef: resumeDownloadRef })

  const updateBaseWidth = () => {
    if(resumeRef.current){
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  }

  const loadDummyData = () => {
    setResumeData(prevData => ({
      ...prevData,
      profileInfo: {
        ...prevData.profileInfo,
        fullName: DUMMY_RESUME_DATA.profileInfo.fullName,
        designation: DUMMY_RESUME_DATA.profileInfo.designation,
        summary: DUMMY_RESUME_DATA.profileInfo.summary,
      },
      contactInfo: {
        ...prevData.contactInfo,
        email: DUMMY_RESUME_DATA.contactInfo.email,
        phone: DUMMY_RESUME_DATA.contactInfo.phone,
        location: DUMMY_RESUME_DATA.contactInfo.location,
        linkedIn: DUMMY_RESUME_DATA.contactInfo.linkedin,
        github: DUMMY_RESUME_DATA.contactInfo.github,
        website: DUMMY_RESUME_DATA.contactInfo.website,
      },
      workExperience: DUMMY_RESUME_DATA.workExperience,
      education: DUMMY_RESUME_DATA.education,
      skills: DUMMY_RESUME_DATA.skills,
      projects: DUMMY_RESUME_DATA.projects,
      certification: DUMMY_RESUME_DATA.certifications,
      languages: DUMMY_RESUME_DATA.languages,
      interests: DUMMY_RESUME_DATA.interests,
    }));
    toast.success('Sample data loaded successfully!');
  }

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener('resize', updateBaseWidth);

    if(resumeId){
      fetchResumeDetailsById();
    }

    return () => {
      window.removeEventListener('resize', updateBaseWidth)
    }
  }, []);

  return (
    <>
      {/* Floating Chatbot */}
      <Chatbot />
      {/* Existing EditResume UI */}
      <DashboardLayout>
        <div className='container mx-auto'>
          <div className='flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4'>
            <TitleInput
                title = {resumeData.title}
                setTitle = {(value) => 
                  setResumeData((prevState) => ({
                    ...prevState,
                    title: value,
                  }))
                } 
              />

              <div className="flex items-center gap-3 md:gap-4">
              <button
                className="flex items-center gap-2 px-3 py-1.5 border border-green-300 text-green-600 rounded-md text-sm hover:bg-green-50 transition"
                onClick={loadDummyData}
              >
                <LuFileText className="text-base" />
                <span className="hidden md:block">Load Sample Data</span>
              </button>

              <button
                className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition"
                onClick={() => setOpenThemeSelector(true)}
              >
                <LuPalette className="text-base" />
                <span className="hidden md:block">Change Theme</span>
              </button>

              <button
                className="flex items-center gap-2 px-3 py-1.5 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-50 transition"
                onClick={handleDeleteResume}
              >
                <LuTrash className="text-base" />
                <span className="hidden md:block">Delete</span>
              </button>

              <button
                className="flex items-center gap-2 px-3 py-1.5 border border-blue-300 text-blue-600 rounded-md text-sm hover:bg-blue-50 transition"
                onClick={() => setOpenPreviewModel(true)}
              >
                <LuDownload className="text-base" />
                <span className="hidden md:block">Preview & Download</span>
              </button>
            </div>

          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='bg-white rounded-lg border border-purple-100 overflow-hidden p-6 h-[90vh] overflow-y-auto'>
              {/* All form sections stacked vertically */}
              {/* <h2 className='text-xl font-bold mb-2'>Personal Information</h2> */}
              <ProfileInfoForm 
                profileData={resumeData?.profileInfo}
                updateSection={(key, value) => updateSection("profileInfo", key, value)}
              />
              <hr className='my-6' />

              {/* <h2 className='text-xl font-bold mb-2'>Contact Information</h2> */}
              <ContactInfoForm 
                contactInfo={resumeData?.contactInfo}
                updateSection={(key, value) => updateSection("contactInfo", key, value)}
              />
              <hr className='my-6' />

              {/* <h2 className='text-xl font-bold mb-2'>Work Experience</h2> */}
              <WorkExperienceForm
                workExperience={resumeData?.workExperience}
                updateArrayItem={(index, key, value) => updateArrayItem("workExperience", index, key, value)}
                addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
                removeArrayItem={(index) => removeArrayItem("workExperience", index)}
              />
              <hr className='my-6' />

              {/* <h2 className='text-xl font-bold mb-2'>Education</h2> */}
              <EducationDetailsForm
                eduacationInfo={resumeData?.education}
                updatedArrayItem={(index, key, value) => updateArrayItem("education", index, key, value)}
                addArrayItem={(newItem) => addArrayItem('education', newItem)}
                removeArrayItem={(index) => removeArrayItem('education', index)}
              />
              <hr className='my-6' />

              {/* <h2 className='text-xl font-bold mb-2'>Skills</h2> */}
              <SkillsInfoForm 
                skillsInfo={resumeData?.skills}
                updateArrayItem={(index, key, value) => updateArrayItem("skills", index, key, value)}
                addArrayItem={(newItem) => addArrayItem("skills", newItem)}
                removeArrayItem={(index) => removeArrayItem("skills", index)}
              />
              <hr className='my-6' />

              {/* <h2 className='text-xl font-bold mb-2'>Projects</h2> */}
              <ProjectsDeatilForm 
                projectInfo={resumeData?.projects}
                updateArrayItem={(index, key, value) => updateArrayItem("projects", index, key, value)}
                addArrayItem={(newItem) => addArrayItem("projects", newItem)}
                removeArrayItem={(index) => removeArrayItem("projects", index)}
              />
              <hr className='my-6' />

              {/* <h2 className='text-xl font-bold mb-2'>Certifications</h2> */}
              <CertificationInfoForm 
                certificationInfo={resumeData?.certification}
                updateArrayItem={(index, key, value) => updateArrayItem("certification", index, key, value)}
                addArrayItem={(newItem) => addArrayItem("certification", newItem)}
                removeArrayItem={(index) => removeArrayItem('certification', index)}
              />
              <hr className='my-6' />

              {/* <h2 className='text-xl font-bold mb-2'>Additional Information</h2> */}
              <AdditionalInfoCard 
                languages={resumeData.languages}
                interests={resumeData.interests}
                updateArrayItem={(section, index, key, value) => updateArrayItem(section, index, key, value)}
                addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
                removeArrayItem={(section, index) => removeArrayItem(section, index)}
              />

              <div className='flex items-center justify-end gap-3 mt-8'>
                <button
                  className='flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium px-4 py-2 rounded-lg transition-all'
                  onClick={uploadResumeImages}
                  disabled={isLoading}
                >
                  <LuSave className='text-[16px]' />
                  {isLoading ? "Updating..." : "Save & Exit"}
                </button>
              </div>

              {errorMsg && (
                <div className='flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 my-1 rounded'>
                  <LuCircleAlert className='text-md'/>
                  {errorMsg}
                </div>
              )}
            </div>

            <div ref={resumeRef} className='h-[100vh]'>
              {/* { Resume Template } */}

              <RenderResume 
                  templateId= {resumeData?.template?.theme || ""}
                  resumeData={resumeData}
                  colorPalette={resumeData?.template?.colorPalette || []}
                  containerWidth={baseWidth}
              />
            </div>
          </div>
        </div>

        <Modal 
            isOpen={openThemeSelector}
            onClose={() => setOpenThemeSelector(false)}
            title="Change Theme"
        >
          <div className='w-[90vw] h-[80vh]'>
            <ThemeSelector 
                selectTheme={resumeData?.template}
                setSelectedTheme={(value) => {
                  setResumeData((prevState) => ({
                    ...prevState,
                    template: value || prevState.template,

                  }));
                }}

                resumeData={null}
                onClose={() => setOpenThemeSelector(false)}
            />
          </div>
        </Modal>

        <Modal
          isOpen={openPreviewModel}
          onClose={() => setOpenPreviewModel(false)}
          title={resumeData.title}
          showActionBtn
          actionBtnText="Download"
          actionBtnIcon={<LuDownload className='text-[16px]'/>}
          onActionClick={() => reactToPrintFn()}
        >
          <div ref={resumeDownloadRef} className='w-[98vw] h-[90vh]'>
            <RenderResume 
              templateId={resumeData?.template?.theme || ""}
              resumeData={resumeData}
              colorPalette={resumeData?.template?.colorPalette || []}
            />
          </div>
        </Modal>
      </DashboardLayout>
    </>
  )
}

// Helper to capture a DOM element as an image (base64 PNG)
async function captureElementAsImage(element) {
  const canvas = await html2canvas(element);
  return canvas.toDataURL('image/png');
}

// Helper to patch oklch() colors in the DOM tree
function patchOklchColors(element) {
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT);
  while (treeWalker.nextNode()) {
    const el = treeWalker.currentNode;
    const style = window.getComputedStyle(el);
    ['color', 'backgroundColor', 'borderColor'].forEach((prop) => {
      const value = style[prop];
      if (value && value.startsWith('oklch')) {
        el.style[prop] = '#000'; // fallback to black, or use '#fff' for backgrounds
      }
    });
  }
}

// Helper to convert a data URL to a File object
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export default EditResume
