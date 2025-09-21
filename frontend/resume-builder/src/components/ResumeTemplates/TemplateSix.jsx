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

const Title = ({ text, color, sidebar = false }) => (
  <div className='relative w-fit mb-3'>
    <h2 className={`relative text-sm font-bold border-b-2 pb-1 ${sidebar ? 'text-white' : 'text-gray-800'}`} 
        style={{ borderBottomColor: color || (sidebar ? '#fff' : '#333') }}>
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

const TemplateSix = ({ resumeData, colorPalette, containerWidth }) => {
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

  // Define section order state for main content (removed education as well)
  const [sectionOrder, setSectionOrder] = useState([
    'summary',
    'experience',
    'projects',
    'certifications'
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
              <Title text="Summary" color="#333" />
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
              <Title text="Skills" color="#333" />
              <div className='grid grid-cols-2 gap-x-8'>
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
              <Title text="Experience" color="#333" />
              {workExperience.map((data, index) => (
                <div key={`work_${index}`} className='mb-5'>
                  <div className='flex justify-between items-start mb-1'>
                    <div>
                      <h3 className='font-bold text-sm text-gray-800'>
                        {data.role}
                      </h3>
                      <p className='text-sm text-gray-600 font-medium'>{data.company}</p>
                      {data.location && (
                        <p className='text-sm text-gray-600'>{data.location}</p>
                      )}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {formatYearMonth(data.startDate)} - {formatYearMonth(data.endDate)}
                    </div>
                  </div>
                  <div className='text-sm leading-relaxed text-gray-700'>
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
              <Title text="Projects" color="#333" />
              {projects.map((project, index) => (
                <div key={index} className='mb-4'>
                  <h3 className='font-bold text-sm text-gray-800 mb-1'>{project.title}</h3>
                  <p className='text-sm text-gray-700 leading-relaxed'>
                    {project.description}
                  </p>
                  {(project.github || project.liveDemo) && (
                    <div className='flex gap-4 mt-2 text-xs'>
                      {project.github && (
                        <a href={project.github} className='text-blue-600 hover:underline'>
                          GitHub
                        </a>
                      )}
                      {project.liveDemo && (
                        <a href={project.liveDemo} className='text-blue-600 hover:underline'>
                          Live Demo
                        </a>
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
              <Title text="Education and Training" color="#333" />
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

      case 'certifications':
        return certification?.length > 0 ? (
          <DraggableSection key="certifications" {...sectionProps}>
            <div>
              <Title text='Certifications' color="#333" />
              {certification.map((data, index) => (
                <div key={`cert_${index}`} className='mb-3'>
                  <h3 className='font-bold text-sm text-gray-800'>{data.title}</h3>
                  <p className='text-sm text-gray-700'>{data.issuer}</p>
                  {data.year && <p className='text-sm text-gray-600'>{data.year}</p>}
                </div>
              ))}
            </div>
          </DraggableSection>
        ) : null;

      case 'interests':
        return interests?.filter(i => i.trim()).length > 0 ? (
          <DraggableSection key="interests" {...sectionProps}>
            <div>
              <Title text="Interests" color="#333" />
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
      className='bg-white flex'
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
        height: "auto",
      }}
    >
      {/* Left Sidebar */}
      <div className='w-1/3 bg-gray-800 text-white p-6'>
        {/* Profile Name */}
        <div className='mb-6'>
          <h1 className='text-xl font-bold text-white'>
            {profileInfo.fullName}
          </h1>
          <p className='text-sm text-gray-300 mt-1'>{contactInfo.location || 'New Delhi, India 110034'}</p>
        </div>

        {/* Contact Information */}
        <div className='mb-6'>
          <div className='space-y-2 text-sm'>
            {contactInfo?.phone && (
              <div className='flex items-center gap-2'>
                <LuPhone size={14} className='text-gray-300' />
                <span>{contactInfo.phone}</span>
              </div>
            )}
            {contactInfo?.email && (
              <div className='flex items-center gap-2'>
                <LuMail size={14} className='text-gray-300' />
                <span>{contactInfo.email}</span>
              </div>
            )}
            {contactInfo?.linkedin && (
              <div className='flex items-center gap-2'>
                <RiLinkedinLine size={14} className='text-gray-300' />
                <span className='break-all'>{contactInfo.linkedin}</span>
              </div>
            )}
            {contactInfo?.github && (
              <div className='flex items-center gap-2'>
                <LuGithub size={14} className='text-gray-300' />
                <span className='break-all'>{contactInfo.github}</span>
              </div>
            )}
            {contactInfo?.website && (
              <div className='flex items-center gap-2'>
                <LuRss size={14} className='text-gray-300' />
                <span className='break-all'>{contactInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Education Section */}
        {education?.length > 0 && (
          <div className='mb-6'>
            <Title text='Education and Training' color="#fff" sidebar={true} />
            <div className='space-y-3'>
              {education.map((data, index) => (
                <div key={`education_${index}`} className='text-sm'>
                  <h3 className='font-bold text-white text-xs leading-tight'>{data.degree}</h3>
                  <p className='text-gray-300 text-xs leading-tight mt-1'>
                    {data.institution}
                  </p>
                  <p className='text-gray-400 text-xs'>
                    {contactInfo.location || 'New Delhi, India'} {formatYearMonth(data.endDate)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section */}
        {languages?.length > 0 && (
          <div className='mb-6'>
            <Title text='Languages' color="#fff" sidebar={true} />
            <div className='space-y-1'>
              {languages.map((lang, index) => (
                <div key={index} className='text-sm text-white'>
                  {lang.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {skills?.length > 0 && (
          <div className='mb-6'>
            <Title text='Skills' color="#fff" sidebar={true} />
            <div className='space-y-1'>
              {skills.map((skill, index) => (
                <div key={index} className='text-sm text-white'>
                  • {skill.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests Section */}
        {interests?.filter(i => i.trim()).length > 0 && (
          <div className='mb-6'>
            <Title text='Interests' color="#fff" sidebar={true} />
            <div className='space-y-1'>
              {interests
                .filter(interest => interest.trim() !== "")
                .map((interest, index) => (
                  <div key={`interest_${index}`} className='text-sm text-white'>
                    • {interest}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Main Content */}
      <div className='w-2/3 p-6'>
        {/* Draggable Sections */}
        <div className="space-y-0">
          {sectionOrder.map((sectionType, index) => renderSection(sectionType, index)).filter(Boolean)}
        </div>
      </div>
    </div>
  );
};

export default TemplateSix;