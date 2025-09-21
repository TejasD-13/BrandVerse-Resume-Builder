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
    <h2 className='text-sm font-bold text-black uppercase tracking-widest border-b-2 border-black pb-1 mb-2'>
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

const TemplateTen = ({ resumeData, colorPalette, containerWidth }) => {
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
              <Title text="Executive Summary" />
              <div className='pl-3 border-l-4 border-gray-300'>
                <p className='text-xs leading-relaxed text-black text-justify italic'>
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
              {workExperience.map((data, index) => (
                <div key={`work_${index}`} className='mb-3'>
                  <div className='flex justify-between items-start border-b border-gray-200 pb-1 mb-2'>
                    <div className='flex-1'>
                      <h3 className='text-sm font-bold text-black mb-0.5'>
                        {data.role}
                      </h3>
                      <p className='text-xs font-semibold text-gray-700 uppercase tracking-wide'>
                        {data.company}
                      </p>
                      {data.location && (
                        <p className='text-xs text-gray-600 mt-0.5'>
                          {data.location}
                        </p>
                      )}
                    </div>
                    <div className='text-right'>
                      <p className='text-xs font-medium text-black border border-gray-300 px-2 py-0.5 rounded'>
                        {formatYearMonth(data.startDate)} - {formatYearMonth(data.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className='text-xs leading-relaxed text-black pl-3'>
                    {data.description && (
                      <ul className='space-y-1'>
                        {data.description.split('\n').filter(item => item.trim()).map((item, idx) => (
                          <li key={idx} className='flex items-start gap-2'>
                            <span className='inline-block w-1.5 h-1.5 bg-black rounded-full mt-1.5 flex-shrink-0'></span>
                            <span>{item.trim()}</span>
                          </li>
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
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  {skills.slice(0, Math.ceil(skills.length / 2)).map((skill, index) => (
                    <div key={index} className='mb-1 flex items-center gap-2'>
                      <div className='w-2 h-2 bg-black'></div>
                      <span className='text-xs font-medium text-black'>{skill.name}</span>
                    </div>
                  ))}
                </div>
                <div>
                  {skills.slice(Math.ceil(skills.length / 2)).map((skill, index) => (
                    <div key={index + Math.ceil(skills.length / 2)} className='mb-1 flex items-center gap-2'>
                      <div className='w-2 h-2 bg-black'></div>
                      <span className='text-xs font-medium text-black'>{skill.name}</span>
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
              <Title text="Key Projects & Achievements" />
              {projects.map((project, index) => (
                <div key={index} className='mb-2 border-l-4 border-gray-300 pl-3'>
                  <h3 className='font-bold text-xs text-black mb-1 uppercase tracking-wide'>
                    {project.title}
                  </h3>
                  <p className='text-xs text-black leading-relaxed mb-2'>
                    {project.description}
                  </p>
                  {(project.github || project.liveDemo) && (
                    <div className='text-xs text-gray-700 flex gap-4'>
                      {project.github && (
                        <div>
                          <span className='font-medium'>Repository:</span> {project.github}
                        </div>
                      )}
                      {project.liveDemo && (
                        <div>
                          <span className='font-medium'>Live Demo:</span> {project.liveDemo}
                        </div>
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
              <Title text="Education & Training" />
              {education.map((data, index) => (
                <div key={`education_${index}`} className='mb-2 flex justify-between items-start border-b border-gray-200 pb-2'>
                  <div>
                    <h3 className='font-bold text-xs text-black mb-0.5'>{data.degree}</h3>
                    <p className='text-xs text-gray-700 font-medium'>{data.institution}</p>
                    {data.location && (
                      <p className='text-xs text-gray-600'>
                        {data.location}
                      </p>
                    )}
                  </div>
                  <div className='text-right'>
                    <p className='text-xs font-medium text-black'>
                      {formatYearMonth(data.endDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </DraggableSection>
        ) : null;

      case 'certifications':
        return certification?.length > 0 ? (
          <DraggableSection key="certifications" {...sectionProps}>
            <div>
              <Title text='Professional Certifications' />
              <div className='grid grid-cols-1 gap-2'>
                {certification.map((data, index) => (
                  <div key={`cert_${index}`} className='flex justify-between items-start border-b border-gray-200 pb-1'>
                    <div>
                      <h3 className='font-bold text-xs text-black'>{data.title}</h3>
                      <p className='text-xs text-gray-700'>{data.issuer}</p>
                    </div>
                    {data.year && (
                      <p className='text-xs font-medium text-black'>{data.year}</p>
                    )}
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
              <div className='grid grid-cols-2 gap-3'>
                {languages.map((lang, index) => (
                  <div key={index} className='flex justify-between items-center border-b border-gray-200 pb-1'>
                    <span className='text-xs font-medium text-black'>{lang.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </DraggableSection>
        ) : null;

      case 'interests':
        return interests?.filter(i => i.trim()).length > 0 ? (
          <DraggableSection key="interests" {...sectionProps}>
            <div>
              <Title text="Personal Interests" />
              <div className='flex flex-wrap gap-3'>
                {interests
                  .filter(interest => interest.trim() !== "")
                  .map((interest, index) => (
                    <div key={`interest_${index}`} className='flex items-center gap-1'>
                      <div className='w-1.5 h-1.5 bg-black rounded-full'></div>
                      <span className='text-xs text-black'>{interest}</span>
                    </div>
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
      className='bg-white p-6'
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
        height: "auto",
        fontFamily: 'Times New Roman, serif',
        minHeight: '11in',
        pageBreakAfter: 'avoid'
      }}
    >
      {/* Header Section - Executive style */}
      <div className='text-center mb-4 border-b-4 border-black pb-3'>
        <h1 className='text-2xl font-bold mb-2 text-black tracking-wider uppercase'>
          {profileInfo.fullName || 'FULL NAME'}
        </h1>
        
        {/* Contact Information - Professional layout */}
        <div className='text-xs text-black'>
          <div className='flex justify-center items-center gap-6 flex-wrap mb-1'>
            {contactInfo?.phone && (
              <div className='flex items-center gap-1'>
                <LuPhone size={14} className='text-black' />
                <span className='tracking-wide'>{contactInfo.phone}</span>
              </div>
            )}
            {contactInfo?.email && (
              <div className='flex items-center gap-1'>
                <LuMail size={14} className='text-black' />
                <span className='tracking-wide'>{contactInfo.email}</span>
              </div>
            )}
            {contactInfo?.location && (
              <div className='flex items-center gap-1'>
                <LuMapPinHouse size={14} className='text-black' />
                <span className='tracking-wide'>{contactInfo.location}</span>
              </div>
            )}
          </div>
          
          {/* Professional Links */}
          {(contactInfo.linkedin || contactInfo.github || contactInfo.website) && (
            <div className='flex justify-center items-center gap-6 flex-wrap'>
              {contactInfo.linkedin && (
                <div className='flex items-center gap-1'>
                  <RiLinkedinLine size={14} className='text-black' />
                  <span className='tracking-wide'>LinkedIn: {contactInfo.linkedin}</span>
                </div>
              )}
              {contactInfo.github && (
                <div className='flex items-center gap-1'>
                  <LuGithub size={14} className='text-black' />
                  <span className='tracking-wide'>GitHub: {contactInfo.github}</span>
                </div>
              )}
              {contactInfo.website && (
                <div className='flex items-center gap-1'>
                  <LuRss size={14} className='text-black' />
                  <span className='tracking-wide'>Portfolio: {contactInfo.website}</span>
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

export default TemplateTen;