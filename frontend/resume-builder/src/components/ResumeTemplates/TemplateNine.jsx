import React, { useEffect, useRef, useState } from 'react';
import {
  LuMapPinHouse, LuMail, LuPhone, LuRss, LuGithub, LuUser, LuGripVertical,
} from "react-icons/lu";
import { RiLinkedinLine } from "react-icons/ri";

import ContactInfo from '../ResumeSection/ContactInfo';
import EducationInfo from '../ResumeSection/EducationInfo';
import formatYearMonth from '../../utils/helper';
import WorkExperience from '../ResumeSection/WorkExperience';
import LanguageSection from '../ResumeSection/LanguageSection';
import ProjectInfo from '../ResumeSection/ProjectInfo';
import SkillSection from '../ResumeSection/SkillSection';
import CertificationInfo from '../ResumeSection/CertificationInfo';

const DEFAULT_THEME = ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#00B8DB", "#4A5565"];

const Title = ({ text }) => (
  <div className='mb-3'>
    <h2 className='text-sm font-bold text-white bg-gray-800 px-4 py-2 uppercase tracking-wide'>
      {text}
    </h2>
  </div>
);

const DraggableSection = ({ children, onDragStart, onDragEnd, onDragOver, onDrop, index }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className="mb-4 group cursor-move border border-transparent hover:border-gray-200 rounded-lg p-1 transition-all duration-200"
    >
      <div className="flex items-start gap-2">
        <LuGripVertical className="text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" size={14} />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

const TemplateNine = ({ resumeData, colorPalette, containerWidth }) => {
  const themeColor = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;
  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [scale, setScale] = useState(1);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    workExperience = [],
    projects = [],
    skills = [],
    certification = [],
    languages = [],
    interests = [],
  } = resumeData || {};

  // Define section order state
  const [sectionOrder, setSectionOrder] = useState([
    'summary',
    'experience',
    'skills',
    'projects',
    'education',
    'certifications',
    'languages',
    'interests'
  ]);

  useEffect(() => {
    if (resumeRef.current) {
      const actualBaseWidth = resumeRef.current.offsetWidth;
      if (baseWidth !== actualBaseWidth) {
        setBaseWidth(actualBaseWidth);
      }
      const newScale = containerWidth / (actualBaseWidth || 1);
      if (scale !== newScale) {
        setScale(newScale);
      }
    }
  }, [containerWidth]);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newOrder = [...sectionOrder];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);
    
    setSectionOrder(newOrder);
    setDraggedIndex(null);
  };

  const renderSection = (sectionType, index) => {
    const sectionProps = {
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      index
    };

    switch (sectionType) {
      case 'summary':
        return profileInfo.summary ? (
          <DraggableSection key="summary" {...sectionProps}>
            <div>
              <Title text="Professional Profile" />
              <div className='px-4'>
                <p className='text-xs leading-relaxed text-black text-justify bg-gray-50 p-3 rounded'>
                  {profileInfo.summary}
                </p>
              </div>
            </div>
          </DraggableSection>
        ) : null;

      case 'experience':
        return workExperience?.length > 0 ? (
          <DraggableSection key="experience" {...sectionProps}>
            <div>
              <Title text="Work Experience" />
              <div className='px-4'>
                {workExperience.map((data, index) => (
                  <div key={`work_${index}`} className='mb-4 bg-gray-50 p-3 rounded'>
                    <div className='flex justify-between items-start mb-2'>
                      <div className='flex-1'>
                        <h3 className='font-bold text-sm text-black'>
                          {data.role}
                        </h3>
                        <p className='text-xs font-semibold text-gray-700'>{data.company}</p>
                        {data.location && (
                      <p className='text-xs text-gray-500'>{data.location}</p>
                    )}
                      </div>
                      <div className='text-right'>
                        <p className='text-xs text-gray-600 font-medium bg-white px-2 py-1 rounded'>
                          {formatYearMonth(data.startDate)} - {formatYearMonth(data.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className='text-xs leading-relaxed text-black'>
                      {data.description && (
                        <ul className='list-disc list-inside space-y-1 ml-2'>
                          {data.description.split('\n').filter(item => item.trim()).slice(0, 3).map((item, idx) => (
                            <li key={idx}>{item.trim()}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DraggableSection>
        ) : null;

      case 'skills':
        return skills?.length > 0 ? (
          <DraggableSection key="skills" {...sectionProps}>
            <div>
              <Title text="Core Skills" />
              <div className='px-4'>
                <div className='bg-gray-50 p-3 rounded'>
                  <div className='flex flex-wrap gap-2'>
                    {skills.map((skill, index) => (
                      <span key={index} className='text-xs bg-white text-black px-2 py-1 rounded shadow-sm border'>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DraggableSection>
        ) : null;

      case 'projects':
        return projects?.length > 0 ? (
          <DraggableSection key="projects" {...sectionProps}>
            <div>
              <Title text="Notable Projects" />
              <div className='px-4'>
                {projects.map((project, index) => (
                  <div key={index} className='mb-3 bg-gray-50 p-3 rounded'>
                    <h3 className='font-bold text-xs text-black mb-1'>{project.title}</h3>
                    <p className='text-xs text-black leading-relaxed mb-2'>
                      {project.description}
                    </p>
                    {(project.github || project.liveDemo) && (
                      <div className='text-xs text-gray-600 flex gap-4'>
                        {project.github && (
                          <span className='bg-white px-2 py-1 rounded text-xs'>
                            GitHub: {project.github}
                          </span>
                        )}
                        {project.liveDemo && (
                          <span className='bg-white px-2 py-1 rounded text-xs'>
                            Demo: {project.liveDemo}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </DraggableSection>
        ) : null;

      case 'education':
        return education?.length > 0 ? (
          <DraggableSection key="education" {...sectionProps}>
            <div>
              <Title text="Academic Background" />
              <div className='px-4'>
                <div className='bg-gray-50 p-3 rounded'>
                  {education.map((data, index) => (
                    <div key={`education_${index}`} className='mb-2 last:mb-0'>
                      <h3 className='font-bold text-xs text-black'>{data.degree}</h3>
                      <p className='text-xs text-gray-700'>{data.institution}</p>
                                        <p className='text-xs text-gray-500'>
                    {data.location ? `${data.location} • ` : ''}{formatYearMonth(data.endDate)}
                  </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DraggableSection>
        ) : null;

      case 'certifications':
        return certification?.length > 0 ? (
          <DraggableSection key="certifications" {...sectionProps}>
            <div>
              <Title text='Professional Certifications' />
              <div className='px-4'>
                <div className='bg-gray-50 p-3 rounded'>
                  {certification.map((data, index) => (
                    <div key={`cert_${index}`} className='mb-2 last:mb-0'>
                      <h3 className='font-bold text-xs text-black'>{data.title}</h3>
                      <p className='text-xs text-gray-700'>{data.issuer}</p>
                      {data.year && <p className='text-xs text-gray-500'>{data.year}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DraggableSection>
        ) : null;

      case 'languages':
        return languages?.length > 0 ? (
          <DraggableSection key="languages" {...sectionProps}>
            <div>
              <Title text='Language Proficiency' />
              <div className='px-4'>
                <div className='bg-gray-50 p-3 rounded'>
                  <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
                    {languages.map((lang, index) => (
                      <div key={index} className='text-xs text-black'>
                        <span className='font-medium'>{lang.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DraggableSection>
        ) : null;

      case 'interests':
        return interests?.filter(i => i.trim()).length > 0 ? (
          <DraggableSection key="interests" {...sectionProps}>
            <div>
              <Title text="Personal Interests" />
              <div className='px-4'>
                <div className='bg-gray-50 p-3 rounded'>
                  <div className='flex flex-wrap gap-2'>
                    {interests
                      .filter(interest => interest.trim() !== "")
                      .map((interest, index) => (
                        <span key={`interest_${index}`} className='text-xs bg-white text-black px-2 py-1 rounded shadow-sm'>
                          {interest}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </DraggableSection>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div
      ref={resumeRef}
      className='bg-white p-6'
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
        height: "auto",
        fontFamily: 'Arial, sans-serif',
        minHeight: '11in',
        pageBreakAfter: 'avoid'
      }}
    >
      {/* Header Section - Modern card style */}
      <div className='mb-5 bg-gray-800 text-white p-4 rounded-lg'>
        <h1 className='text-xl font-bold mb-3 text-center tracking-wide'>
          {profileInfo.fullName || 'FULL NAME'}
        </h1>
        
        {/* Contact Information - Clean grid layout */}
        <div className='text-xs'>
          <div className='flex justify-center flex-wrap gap-6'>
            {contactInfo?.phone && (
              <div className='flex items-center gap-1'>
                <LuPhone size={12} />
                <span>{contactInfo.phone}</span>
              </div>
            )}
            {contactInfo?.email && (
              <div className='flex items-center gap-1'>
                <LuMail size={12} />
                <span>{contactInfo.email}</span>
              </div>
            )}
            {contactInfo?.location && (
              <div className='flex items-center gap-1'>
                <LuMapPinHouse size={12} />
                <span>{contactInfo.location}</span>
              </div>
            )}
          </div>
          
          {/* Social Links */}
          {(contactInfo.linkedin || contactInfo.github || contactInfo.website) && (
            <div className='flex justify-center flex-wrap gap-6 mt-2 pt-2 border-t border-gray-600'>
              {contactInfo.linkedin && (
                <div className='flex items-center gap-1'>
                  <RiLinkedinLine size={12} />
                  <span className='break-all'>{contactInfo.linkedin}</span>
                </div>
              )}
              {contactInfo.github && (
                <div className='flex items-center gap-1'>
                  <LuGithub size={12} />
                  <span className='break-all'>{contactInfo.github}</span>
                </div>
              )}
              {contactInfo.website && (
                <div className='flex items-center gap-1'>
                  <LuRss size={12} />
                  <span className='break-all'>{contactInfo.website}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content - All sections are draggable */}
      <div className="space-y-0">
        {sectionOrder.map((sectionType, index) => renderSection(sectionType, index)).filter(Boolean)}
      </div>
    </div>
  );
};

export default TemplateNine;