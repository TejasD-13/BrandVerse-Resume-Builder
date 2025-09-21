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
  <div className='mb-2'>
    <h2 className='text-sm font-bold text-black uppercase tracking-wider bg-gray-100 px-3 py-1 border-l-4 border-black'>
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

const TemplateEight = ({ resumeData, colorPalette, containerWidth }) => {
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
              <Title text="Professional Summary" />
              <div className='ml-4'>
                <p className='text-xs leading-relaxed text-black text-justify'>
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
              <Title text="Professional Experience" />
              <div className='ml-4'>
                {workExperience.map((data, index) => (
                  <div key={`work_${index}`} className='mb-3'>
                    <div className='border-l-2 border-gray-300 pl-3'>
                      <div className='mb-1'>
                        <h3 className='font-bold text-sm text-black'>
                          {data.role}
                        </h3>
                        <div className='flex justify-between items-start'>
                          <p className='text-xs font-semibold text-gray-700'>{data.company}</p>
                          <p className='text-xs text-gray-600 font-medium'>
                            {formatYearMonth(data.startDate)} - {formatYearMonth(data.endDate)}
                          </p>
                        </div>
                        {data.location && (
                      <p className='text-xs text-gray-500'>{data.location}</p>
                    )}
                      </div>
                      <div className='text-xs leading-relaxed text-black'>
                        {data.description && (
                          <ul className='list-disc list-inside space-y-1'>
                            {data.description.split('\n').filter(item => item.trim()).slice(0, 3).map((item, idx) => (
                              <li key={idx}>{item.trim()}</li>
                            ))}
                          </ul>
                        )}
                      </div>
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
              <Title text="Technical Skills" />
              <div className='ml-4'>
                <div className='grid grid-cols-3 gap-x-4'>
                  {skills.map((skill, index) => (
                    <div key={index} className='text-xs text-black mb-1'>
                      • {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DraggableSection>
        ) : null;

      case 'projects':
        return projects?.length > 0 ? (
          <DraggableSection key="projects" {...sectionProps}>
            <div>
              <Title text="Key Projects" />
              <div className='ml-4'>
                {projects.map((project, index) => (
                  <div key={index} className='mb-2 border-l-2 border-gray-300 pl-3'>
                    <h3 className='font-bold text-xs text-black mb-1'>{project.title}</h3>
                    <p className='text-xs text-black leading-relaxed mb-1'>
                      {project.description}
                    </p>
                    {(project.github || project.liveDemo) && (
                      <div className='text-xs text-gray-600'>
                        {project.github && (
                          <span>Repository: {project.github}</span>
                        )}
                        {project.github && project.liveDemo && <span> | </span>}
                        {project.liveDemo && (
                          <span>Demo: {project.liveDemo}</span>
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
              <Title text="Education" />
              <div className='ml-4'>
                {education.map((data, index) => (
                  <div key={`education_${index}`} className='mb-2'>
                    <h3 className='font-bold text-xs text-black'>{data.degree}</h3>
                    <p className='text-xs text-gray-700'>{data.institution}</p>
                                      <p className='text-xs text-gray-500'>
                    {data.location ? `${data.location} • ` : ''}{formatYearMonth(data.endDate)}
                  </p>
                  </div>
                ))}
              </div>
            </div>
          </DraggableSection>
        ) : null;

      case 'certifications':
        return certification?.length > 0 ? (
          <DraggableSection key="certifications" {...sectionProps}>
            <div>
              <Title text='Certifications' />
              <div className='ml-4'>
                {certification.map((data, index) => (
                  <div key={`cert_${index}`} className='mb-2'>
                    <h3 className='font-bold text-xs text-black'>{data.title}</h3>
                    <p className='text-xs text-gray-700'>{data.issuer}</p>
                    {data.year && <p className='text-xs text-gray-500'>{data.year}</p>}
                  </div>
                ))}
              </div>
            </div>
          </DraggableSection>
        ) : null;

      case 'languages':
        return languages?.length > 0 ? (
          <DraggableSection key="languages" {...sectionProps}>
            <div>
              <Title text='Languages' />
              <div className='ml-4'>
                <div className='grid grid-cols-2 gap-x-4'>
                  {languages.map((lang, index) => (
                    <div key={index} className='text-xs text-black mb-1'>
                      <span className='font-medium'>{lang.name}</span>
                      
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DraggableSection>
        ) : null;

      case 'interests':
        return interests?.filter(i => i.trim()).length > 0 ? (
          <DraggableSection key="interests" {...sectionProps}>
            <div>
              <Title text="Additional Information" />
              <div className='ml-4'>
                <p className='text-xs text-black'>
                  {interests
                    .filter(interest => interest.trim() !== "")
                    .join(' • ')}
                </p>
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
      {/* Header Section - Left aligned professional style */}
      <div className='mb-4 border-b-2 border-black pb-3'>
        <h1 className='text-2xl font-bold mb-2 text-black tracking-wider'>
          {profileInfo.fullName || 'FULL NAME'}
        </h1>
        
        {/* Contact Information - Horizontal layout */}
        <div className='text-xs text-black'>
          <div className='grid grid-cols-2 gap-x-8 gap-y-1'>
            <div className='space-y-1'>
              {contactInfo?.phone && (
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>Phone:</span>
                  <span>{contactInfo.phone}</span>
                </div>
              )}
              {contactInfo?.email && (
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>Email:</span>
                  <span>{contactInfo.email}</span>
                </div>
              )}
              {contactInfo?.location && (
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>Location:</span>
                  <span>{contactInfo.location}</span>
                </div>
              )}
            </div>
            
            <div className='space-y-1'>
              {contactInfo.linkedin && (
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>LinkedIn:</span>
                  <span className='break-all'>{contactInfo.linkedin}</span>
                </div>
              )}
              {contactInfo.github && (
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>GitHub:</span>
                  <span className='break-all'>{contactInfo.github}</span>
                </div>
              )}
              {contactInfo.website && (
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>Website:</span>
                  <span className='break-all'>{contactInfo.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - All sections are draggable */}
      <div className="space-y-0">
        {sectionOrder.map((sectionType, index) => renderSection(sectionType, index)).filter(Boolean)}
      </div>
    </div>
  );
};

export default TemplateEight;