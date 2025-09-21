import React, { useEffect, useRef, useState } from 'react';

const TemplateFourPerfect = ({ resumeData, colorPalette, containerWidth }) => {
  const themeColor = colorPalette?.length > 0 ? colorPalette : ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#E60000", "#4A5565"];
  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [scale, setScale] = useState(1);

  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    workExperience = [],
    skills = [],
    languages = [],
    interests =[],
  } = resumeData || {};

  useEffect(() => {
    if (resumeRef.current) {
      const actualBaseWidth = resumeRef.current.offsetWidth;
      if (baseWidth !== actualBaseWidth) setBaseWidth(actualBaseWidth);
      const newScale = containerWidth / (actualBaseWidth || 1);
      if (scale !== newScale) setScale(newScale);
    }
  }, [containerWidth]);

  const SectionTitle = ({ text }) => (
    <h2 className="uppercase font-semibold text-center text-red-700 text-base border-b-2 border-red-700 pb-1 mb-3">
      {text}
    </h2>
  );

  return (
    <div
      ref={resumeRef}
      className='bg-white text-black px-10 py-8 font-sans'
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
      }}
    >
      {/* Header */}
      <div className='text-center mb-6'>
        <h1 className='text-3xl font-bold'>
          <span>{(profileInfo.fullName || '').split(' ')[0]}</span>{' '}
          <span className='text-red-700'>{(profileInfo.fullName || '').split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className='text-sm mt-1'>
          {contactInfo.location} | {contactInfo.phone} | {contactInfo.email}
        </p>
      </div>

      {/* Summary */}
      <div className='mb-6'>
        <SectionTitle text="Summary" />
        <p className='text-sm text-justify leading-relaxed'>{profileInfo.summary}</p>
      </div>

      {/* Skills */}
      <div className='mb-6'>
        <SectionTitle text="Skills" />
        <div className='grid grid-cols-2 gap-6'>
          <ul className='list-disc list-inside text-sm space-y-1'>
            {skills.slice(0, Math.ceil(skills.length / 2)).map((skill, index) => (
              <li key={index}>{skill.name}</li>
            ))}
          </ul>
          <ul className='list-disc list-inside text-sm space-y-1'>
            {skills.slice(Math.ceil(skills.length / 2)).map((skill, index) => (
              <li key={index + Math.ceil(skills.length / 2)}>{skill.name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Experience */}
      <div className='mb-6'>
        <SectionTitle text="Experience" />
        {workExperience.map((exp, index) => (
          <div key={index} className='mb-4'>
            <div className='flex justify-between font-semibold text-sm'>
              <span>{exp.role}</span>
              <span>{exp.startDate} - {exp.endDate || 'Present'}</span>
            </div>
            <div className='text-sm font-bold'>{exp.company}</div>
            <ul className='list-disc list-inside text-sm space-y-1'>
              {(exp.description || '').split('\n').filter(Boolean).map((line, i) => (
                <li key={i}>{line.trim()}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className='mb-6'>
        <SectionTitle text="Education and Training" />
        {education.map((edu, index) => (
          <div key={index} className='mb-3'>
            <div className='text-sm font-bold'>{edu.degree}</div>
            <div className='text-sm'>{edu.institution}</div>
            <div className='text-sm text-red-700'>{edu.endDate}</div>
          </div>
        ))}
      </div>

      {/* Projects */}
      {Array.isArray(resumeData.projects) && resumeData.projects.length > 0 && (
        <div className='mb-6'>
          <SectionTitle text="Projects" />
          {resumeData.projects.map((project, index) => (
            <div key={index} className='mb-3'>
              <div className='text-sm font-bold'>{project.title}</div>
              <div className='text-sm'>{project.description}</div>
              <div className='flex gap-4 mt-1'>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-700 underline"
                  >
                    GitHub
                  </a>
                )}
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-700 underline"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      <div>
        <SectionTitle text="Languages" />
        <ul className='list-disc list-inside text-sm space-y-1'>
          {languages.map((lang, index) => (
            <li key={index}>{lang.name}</li>
          ))}
        </ul>
      </div>

      {/* Interests */}
        {interests.length > 0 && (
        <div className='mt-6'>
            <SectionTitle text="Interests" />
            <ul className='list-disc list-inside text-sm space-y-1'>
            {interests.map((interest, index) => (
                <li key={index}>{interest}</li>
            ))}
            </ul>
        </div>
        )}

    </div>
  );
};

export default TemplateFourPerfect;
