import React, { useEffect, useRef, useState } from 'react'
import {
    LuMapPinHouse, LuMail, LuPhone, LuRss, LuGithub, LuUser,
} from "react-icons/lu"
import { RiLinkedinLine } from "react-icons/ri"
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LuGripVertical } from 'react-icons/lu';

import ContactInfo from '../ResumeSection/ContactInfo'
import EducationInfo from '../ResumeSection/EducationInfo'
import formatYearMonth from '../../utils/helper'
import WorkExperience from '../ResumeSection/WorkExperience'
import LanguageSection from '../ResumeSection/LanguageSection'
import ProjectInfo from '../ResumeSection/ProjectInfo'
import SkillSection from '../ResumeSection/SkillSection'
import CertificationInfo from '../ResumeSection/CertificationInfo'

const DEFAULT_THEME = ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#00B8DB", "#4A5565"]

const Title = ({ text, color }) => (
    <div className='relative w-fit mb-2.5'>
        <span 
            className='absolute bottom-0 left-0 w-full h-2'
            style={{ backgroundColor: color }}
        ></span>
        <h2 className='relative text-sm font-bold'>{text}</h2>
    </div>
)

const SECTION_KEYS = [
  'summary',
  'skills',
  'experience',
  'education',
  'languages',
  'projects',
  'certifications',
  'interests'
];

const TemplateOne = ({ resumeData, colorPalette, containerWidth }) => {
    const themeColor = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME
    const resumeRef = useRef(null)
    const [baseWidth, setBaseWidth] = useState(800)
    const [scale, setScale] = useState(1)
    const [sectionOrder, setSectionOrder] = useState(SECTION_KEYS);

    // Safe destructuring with defaults
    const {
      profileInfo = {},
      contactInfo = {},
      education = [],
      workExperience = [],
      projects = [],
      skills = [],
      certification = [],
      languages = [],
      interests = []
    } = resumeData || {};

    // Filter out empty work experience entries
    const filteredWorkExperience = workExperience.filter(
      exp => exp && (exp.company || exp.role || exp.startDate || exp.endDate || exp.description)
    );

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
        // eslint-disable-next-line
    }, [containerWidth]);

    // DnD sensors
    const sensors = useSensors(
      useSensor(PointerSensor)
    );

    // DnD handler
    const handleDragEnd = (event) => {
      const { active, over } = event;
      if (active && over && active.id !== over.id) {
        setSectionOrder((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    };

    // Section renderers
    const sectionComponents = {
      summary: (
        <div key="summary">
          <Title text="Professional Summary" color={themeColor[1]} />
          <p className='text-sm font-medium'>{profileInfo.summary}</p>
        </div>
      ),
      skills: (
        <div key="skills" className='mt-4'>
          <Title text='Skills' color={themeColor[1]} />
          <SkillSection
            skills={skills}
            accentColor={themeColor[3]}
            bgColor={themeColor[2]}
          />
        </div>
      ),
      experience: (
        filteredWorkExperience.length > 0 && (
          <div key="experience" className='mt-4'>
            <Title text="Work Experience" color={themeColor[1]} />
            {filteredWorkExperience.map((data, index) => (
              <WorkExperience
                key={`work_${index}`}
                company={data.company}
                role={data.role}
                duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                durationColor={themeColor[4]}
                description={data.description}
              />
            ))}
          </div>
        )
      ),
      education: (
        <div key="education" className='mt-4'>
          <Title text="Education" color={themeColor[1]} />
          {education.map((data, index) => (
            <EducationInfo
              key={`education_${index}`}
              degree={data.degree}
              institution={data.institution}
              duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
            />
          ))}
        </div>
      ),
      languages: (
        languages?.length > 0 && (
          <div key="languages" className='mt-4'>
            <Title text='Languages' color={themeColor[1]} />
            <LanguageSection
              languages={languages}
              accentColor={themeColor[3]}
              bgColor={themeColor[2]}
            />
          </div>
        )
      ),
      projects: (
        <div key="projects" className='mt-4'>
          <Title text="Projects" color={themeColor[1]} />
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
      ),
      certifications: (
        certification?.length > 0 && (
          <div key="certifications" className='mt-4'>
            <Title text='Certifications' color={themeColor[1]} />
            <div className='grid grid-cols-2 gap-2'>
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
          </div>
        )
      ),
      interests: (
        interests?.filter(i => i.trim()).length > 0 && (
          <div key="interests" className='mt-4'>
            <Title text="Interests" color={themeColor[1]} />
            <div className='flex items-center flex-wrap gap-3 mt-4'>
              {interests
                .filter(interest => interest.trim() !== "")
                .map((interest, index) => (
                  <div
                    key={`interest_${index}`}
                    className='text-[10px] font-medium py-1 px-3 rounded-lg'
                    style={{ backgroundColor: themeColor[2] }}
                  >
                    {interest}
                  </div>
                ))}
            </div>
          </div>
        )
      )
    };

    // Sortable wrapper with drag handle
    function SortableSection({ id, children }) {
      const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
      return (
        <div
          ref={setNodeRef}
          style={{
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : 1,
            boxShadow: isDragging ? '0 0 0 2px #00B8DB' : undefined,
            cursor: 'grab',
            background: isDragging ? '#f8f8f8' : undefined,
            position: 'relative',
          }}
          {...attributes}
        >
          <div {...listeners} style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, cursor: 'grab', padding: 4 }}>
            <LuGripVertical className='text-blue-700' />
          </div>
          <div style={{ marginLeft: 28 }}>{children}</div>
        </div>
      );
    }

    return (
        <div
            ref={resumeRef}
            className='p-3 bg-white'
            style={{
                transform: containerWidth > 0 ? `scale(${scale})` : "none",
                transformOrigin: "top left",
                width: containerWidth > 0 ? `${baseWidth}px` : "auto",
                height: "auto",
            }}
        >
            <div className='grid grid-cols-12 gap-8'>
                {/* Left Sidebar */}
                <div className='col-span-4 py-10' style={{ backgroundColor: themeColor[0] }}>
                    <div className='flex flex-col items-center px-2'>
                        <div
                            className='w-[100px] h-[100px] rounded-full flex items-center justify-center'
                            style={{ backgroundColor: themeColor[1] }}
                        >
                            {profileInfo.profilePreviewUrl ? (
                                <img
                                    src={profileInfo.profilePreviewUrl}
                                    className='w-[90px] h-[90px] rounded-full'
                                    alt='Profile'
                                />
                            ) : (
                                <div
                                    className='w-[90px] h-[90px] flex items-center justify-center text-5xl rounded-full'
                                    style={{ color: themeColor[4] }}
                                >
                                    <LuUser />
                                </div>
                            )}
                        </div>

                        <h2 className='text-xl font-bold mt-3'>
                            {profileInfo.fullName}
                        </h2>
                        <p className='text-sm text-center'>
                            {profileInfo.designation}
                        </p>
                    </div>

                    <div className='my-6 mx-6'>
                        <div className='flex flex-col gap-4'>
                            <ContactInfo icon={<LuMapPinHouse />} iconBG={themeColor[2]} value={contactInfo?.location} />
                            <ContactInfo icon={<LuMail />} iconBG={themeColor[2]} value={contactInfo?.email} />
                            <ContactInfo icon={<LuPhone />} iconBG={themeColor[2]} value={contactInfo?.phone} />

                            {contactInfo.linkedin && (
                                <ContactInfo icon={<RiLinkedinLine />} iconBG={themeColor[2]} value={contactInfo?.linkedin} />
                            )}
                            {contactInfo.github && (
                                <ContactInfo icon={<LuGithub />} iconBG={themeColor[2]} value={contactInfo?.github} />
                            )}
                            <ContactInfo icon={<LuRss />} iconBG={themeColor[2]} value={contactInfo?.website} />
                        </div>

                        {/* Education */}
                        <div className='mt-5'>
                            <Title text="Education" color={themeColor[1]} />
                            {education.map((data, index) => (
                                <EducationInfo
                                    key={`education_${index}`}
                                    degree={data.degree}
                                    institution={data.institution}
                                    duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                                />
                            ))}
                        </div>

                        {/* Languages */}
                        {languages?.length > 0 && (
                            <div>
                                <Title text='Languages' color={themeColor[1]} />
                                <LanguageSection
                                    languages={languages}
                                    accentColor={themeColor[3]}
                                    bgColor={themeColor[2]}
                                />
                            </div>
                        )}

                    </div>
                </div>

                {/* Right Content */}
                <div className='col-span-8 pt-10 mr-10 pb-5'>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                      {sectionOrder.map((key) =>
                        sectionComponents[key] ? (
                          <SortableSection key={key} id={key}>
                            {sectionComponents[key]}
                          </SortableSection>
                        ) : null
                      )}
                    </SortableContext>
                  </DndContext>
                </div>
            </div>
        </div>
    )
}

export default TemplateOne
