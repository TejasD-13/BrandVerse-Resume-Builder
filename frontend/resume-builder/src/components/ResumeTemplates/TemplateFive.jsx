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

const Title = ({ text, color }) => (
  <div className='relative w-fit mb-3'>
    <h2 className='relative text-sm font-bold border-b-2 pb-1' style={{ borderBottomColor: color || '#333' }}>
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
      className="mb-6 group cursor-move border border-transparent hover:border-gray-200 rounded-lg p-2 transition-all duration-200"
    >
      <div className="flex items-start gap-2">
        <LuGripVertical className="text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

const TemplateFive = ({ resumeData, colorPalette, containerWidth }) => {
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
    'skills', 
    'experience',
    'projects',
    'education',
    'languages',
    'certifications',
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
        return (
          <DraggableSection key="summary" {...sectionProps}>
            <div>
              <Title text="SUMMARY" color="#333" />
              <p className='text-sm leading-relaxed text-gray-700 text-justify'>
                {profileInfo.summary}
              </p>
            </div>
          </DraggableSection>
        );

      case 'skills':
        return skills?.length > 0 ? (
          <DraggableSection key="skills" {...sectionProps}>
            <div>
              <Title text="SKILLS" color="#333" />
              <div className='grid grid-cols-2 gap-x-12'>
                <div>
                  <ul className='list-disc list-inside text-sm space-y-1 text-gray-700'>
                    {skills.slice(0, Math.ceil(skills.length / 2)).map((skill, index) => (
                      <li key={index}>{skill.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <ul className='list-disc list-inside text-sm space-y-1 text-gray-700'>
                    {skills.slice(Math.ceil(skills.length / 2)).map((skill, index) => (
                      <li key={index + Math.ceil(skills.length / 2)}>{skill.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </DraggableSection>
        ) : null;

      case 'experience':
        return workExperience?.length > 0 ? (
          <DraggableSection key="experience" {...sectionProps}>
            <div>
              <Title text="EXPERIENCE" color="#333" />
              {workExperience.map((data, index) => (
                <div key={`work_${index}`} className='mb-5'>
                  <div className='flex justify-between items-start mb-1'>
                    <div>
                      <h3 className='font-bold text-sm text-gray-800'>
                        {data.role}, {data.company}
                      </h3>
                      {data.location && (
                        <p className='text-sm text-gray-600'>{data.location}</p>
                      )}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {formatYearMonth(data.startDate)} - {formatYearMonth(data.endDate)}
                    </div>
                  </div>
                  <div className='text-sm leading-relaxed mt-2 text-gray-700'>
                    {data.description && (
                      <ul className='list-disc list-inside space-y-1'>
                        {data.description.split('\n').filter(item => item.trim()).map((item, idx) => (
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

      case 'projects':
        return projects?.length > 0 ? (
          <DraggableSection key="projects" {...sectionProps}>
            <div>
              <Title text="PROJECTS" color="#333" />
              {projects.map((project, index) => (
                <ProjectInfo
                  key={index}
                  title={project.title}
                  description={project.description}
                  githubLink={project.github}
                  liveDemoUrl={project.liveDemo}
                  bgColor={themeColor}
                />
              ))}
            </div>
          </DraggableSection>
        ) : null;

      case 'education':
        return education?.length > 0 ? (
          <DraggableSection key="education" {...sectionProps}>
            <div>
              <Title text="EDUCATION AND TRAINING" color="#333" />
              {education.map((data, index) => (
                <div key={`education_${index}`} className='mb-3'>
                  <h3 className='font-bold text-sm text-gray-800'>{data.degree}</h3>
                  <p className='text-sm text-gray-700'>{data.institution}</p>
                  {data.location && (
                    <p className='text-sm text-gray-600'>{data.location} {formatYearMonth(data.endDate)}</p>
                  )}
                  {!data.location && (
                    <p className='text-sm text-gray-600'>{formatYearMonth(data.endDate)}</p>
                  )}
                </div>
              ))}
            </div>
          </DraggableSection>
        ) : null;

      case 'languages':
        return languages?.length > 0 ? (
          <DraggableSection key="languages" {...sectionProps}>
            <div>
              <Title text='LANGUAGES' color="#333" />
              <div className='grid grid-cols-3 gap-4'>
                {languages.map((lang, index) => (
                  <div key={index} className='text-sm text-gray-700'>
                    <span className='font-medium'>{lang.name}</span>
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
              <Title text='CERTIFICATIONS' color="#333" />
              {certification.map((data, index) => (
                <CertificationInfo
                  key={`cert_${index}`}
                  title={data.title}
                  issuer={data.issuer}
                  year={data.year}
                  bgColor={themeColor[2]}
                />
              ))}
            </div>
          </DraggableSection>
        ) : null;

      case 'interests':
        return interests?.filter(i => i.trim()).length > 0 ? (
          <DraggableSection key="interests" {...sectionProps}>
            <div>
              <Title text="INTERESTS" color="#333" />
              <div className='flex flex-wrap gap-2'>
                {interests
                  .filter(interest => interest.trim() !== "")
                  .map((interest, index) => (
                    <span
                      key={`interest_${index}`}
                      className='text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded-full'
                    >
                      {interest}
                    </span>
                  ))}
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
      className='bg-white p-8'
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
        height: "auto",
      }}
    >
      {/* Header Section - Fixed, not draggable */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold mb-2 text-gray-800'>
          {profileInfo.fullName}
        </h1>
        
        {/* Contact Info in Header */}
        <div className='text-sm text-gray-600 mb-4'>
          <div className='flex items-center gap-4 flex-wrap'>
            {contactInfo?.phone && <span>{contactInfo.phone}</span>}
            {contactInfo?.email && (
              <>
                <span>|</span>
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
        </div>

        {/* Additional Contact Info */}
        {(contactInfo.linkedin || contactInfo.github || contactInfo.website) && (
          <div className='mb-4'>
            <div className='flex items-center gap-4 text-sm'>
              {contactInfo.linkedin && (
                <div className='flex items-center gap-1'>
                  <RiLinkedinLine className='text-gray-600' />
                  <span className='text-gray-700'>{contactInfo.linkedin}</span>
                </div>
              )}
              {contactInfo.github && (
                <div className='flex items-center gap-1'>
                  <LuGithub className='text-gray-600' />
                  <span className='text-gray-700'>{contactInfo.github}</span>
                </div>
              )}
              {contactInfo.website && (
                <div className='flex items-center gap-1'>
                  <LuRss className='text-gray-600' />
                  <span className='text-gray-700'>{contactInfo.website}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Draggable Sections */}
      <div className="space-y-0">
        {sectionOrder.map((sectionType, index) => renderSection(sectionType, index)).filter(Boolean)}
      </div>
    </div>
  );
};

export default TemplateFive;