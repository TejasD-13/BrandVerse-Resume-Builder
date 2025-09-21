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
    <h2 className='text-sm font-bold text-black uppercase tracking-wide border-b border-gray-300 pb-1'>
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
      className="mb-3 group cursor-move border border-transparent hover:border-gray-200 rounded-lg p-1 transition-all duration-200"
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

const TemplateSeven = ({ resumeData, colorPalette, containerWidth }) => {
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
              <p className='text-xs leading-relaxed text-black text-justify mb-2'>
                {profileInfo.summary}
              </p>
            </div>
          </DraggableSection>
        ) : null;

      case 'experience':
        return workExperience?.length > 0 ? (
          <DraggableSection key="experience" {...sectionProps}>
            <div>
              <Title text="Professional Experience" />
              {workExperience.map((data, index) => (
                <div key={`work_${index}`} className='mb-3'>
                  <div className='mb-1'>
                    <h3 className='font-bold text-sm text-black'>
                      {data.role}
                    </h3>
                    <div className='flex justify-between items-start mt-1'>
                      <p className='text-xs font-medium text-black'>{data.company}</p>
                      <p className='text-xs text-black'>
                        {formatYearMonth(data.startDate)} - {formatYearMonth(data.endDate)}
                      </p>
                    </div>
                    {data.location && (
                      <p className='text-xs text-gray-700'>{data.location}</p>
                    )}
                  </div>
                  <div className='text-xs leading-relaxed text-black'>
                    {data.description && (
                      <ul className='list-disc list-inside space-y-1 ml-3'>
                        {data.description.split('\n').filter(item => item.trim()).slice(0, 3).map((item, idx) => (
                          <li key={idx}>{item.trim()}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </DraggableSection>
        ) : null;

      case 'skills':
        return skills?.length > 0 ? (
          <DraggableSection key="skills" {...sectionProps}>
            <div>
              <Title text="Core Competencies" />
              <div className='mb-2'>
                <div className='flex flex-wrap gap-1'>
                  {skills.map((skill, index) => (
                    <span key={index} className='text-xs text-black'>
                      {skill.name}{index < skills.length - 1 ? ' •' : ''}
                    </span>
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
              {projects.map((project, index) => (
                <div key={index} className='mb-2'>
                  <h3 className='font-bold text-xs text-black mb-1'>{project.title}</h3>
                  <p className='text-xs text-black leading-relaxed mb-1'>
                    {project.description}
                  </p>
                  {(project.github || project.liveDemo) && (
                    <div className='text-xs text-black'>
                      {project.github && (
                        <span>GitHub: {project.github}</span>
                      )}
                      {project.github && project.liveDemo && <span> | </span>}
                      {project.liveDemo && (
                        <span>Live Demo: {project.liveDemo}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DraggableSection>
        ) : null;

      case 'education':
        return education?.length > 0 ? (
          <DraggableSection key="education" {...sectionProps}>
            <div>
              <Title text="Education" />
              {education.map((data, index) => (
                <div key={`education_${index}`} className='mb-2'>
                  <h3 className='font-bold text-xs text-black'>{data.degree}</h3>
                  <p className='text-xs text-black'>{data.institution}</p>
                  <p className='text-xs text-gray-700'>
                    {data.location ? `${data.location} | ` : ''}Graduated: {formatYearMonth(data.endDate)}
                  </p>
                </div>
              ))}
            </div>
          </DraggableSection>
        ) : null;

      case 'certifications':
        return certification?.length > 0 ? (
          <DraggableSection key="certifications" {...sectionProps}>
            <div>
              <Title text='Certifications' />
              {certification.map((data, index) => (
                <div key={`cert_${index}`} className='mb-2'>
                  <h3 className='font-bold text-xs text-black'>{data.title}</h3>
                  <p className='text-xs text-black'>{data.issuer}</p>
                  {data.year && <p className='text-xs text-gray-700'>{data.year}</p>}
                </div>
              ))}
            </div>
          </DraggableSection>
        ) : null;

      case 'languages':
        return languages?.length > 0 ? (
          <DraggableSection key="languages" {...sectionProps}>
            <div>
              <Title text='Languages' />
              <div className='mb-2'>
                <div className='flex flex-wrap gap-1'>
                  {languages.map((lang, index) => (
                    <span key={index} className='text-xs text-black'>
                      {lang.name} ({lang.proficiency || 'Fluent'}){index < languages.length - 1 ? ' •' : ''}
                    </span>
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
              <div className='mb-2'>
                <div className='flex flex-wrap gap-1'>
                  {interests
                    .filter(interest => interest.trim() !== "")
                    .map((interest, index) => (
                      <span key={`interest_${index}`} className='text-xs text-black'>
                        {interest}{index < interests.filter(i => i.trim()).length - 1 ? ' •' : ''}
                      </span>
                    ))}
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
      {/* Header Section - Compact and ATS-friendly */}
      <div className='text-center mb-4 border-b border-gray-300 pb-3'>
        <h1 className='text-xl font-bold mb-2 text-black tracking-wide'>
          {profileInfo.fullName?.toUpperCase() || 'FULL NAME'}
        </h1>
        
        {/* Contact Information - Single line for ATS */}
        <div className='text-xs text-black'>
          <div className='flex justify-center items-center gap-3 flex-wrap'>
            {contactInfo?.phone && <span>{contactInfo.phone}</span>}
            {contactInfo?.email && (
              <>
                {contactInfo?.phone && <span>|</span>}
                <span>{contactInfo.email}</span>
              </>
            )}
            {contactInfo?.location && (
              <>
                <span>|</span>
                <span>{contactInfo.location}</span>
              </>
            )}
          </div>
          
          {/* Social Links - Second line */}
          {(contactInfo.linkedin || contactInfo.github || contactInfo.website) && (
            <div className='flex justify-center items-center gap-3 flex-wrap mt-1'>
              {contactInfo.linkedin && (
                <span>LinkedIn: {contactInfo.linkedin}</span>
              )}
              {contactInfo.github && (
                <>
                  {contactInfo.linkedin && <span>|</span>}
                  <span>GitHub: {contactInfo.github}</span>
                </>
              )}
              {contactInfo.website && (
                <>
                  {(contactInfo.linkedin || contactInfo.github) && <span>|</span>}
                  <span>Website: {contactInfo.website}</span>
                </>
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

export default TemplateSeven;