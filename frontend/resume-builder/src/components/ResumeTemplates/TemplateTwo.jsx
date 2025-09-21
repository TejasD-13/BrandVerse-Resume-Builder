import React, { useEffect, useRef, useState } from 'react'
import {
    LuMapPinHouse, LuMail, LuPhone, LuRss, LuGithub, LuUser,
} from "react-icons/lu"
import { RiLinkedinLine } from "react-icons/ri"

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
    <div className='relative w-fit mb-3'>
        <h2 className='relative text-base font-bold border-b-2 pb-1' style={{ borderBottomColor: color }}>
            {text}
        </h2>
    </div>
)

const TemplateOne = ({ resumeData, colorPalette, containerWidth }) => {
    const themeColor = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME
    const resumeRef = useRef(null)
    const [baseWidth, setBaseWidth] = useState(800)
    const [scale, setScale] = useState(1)

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

    return (
        <div
            ref={resumeRef}
            className='bg-white'
            style={{
                transform: containerWidth > 0 ? `scale(${scale})` : "none",
                transformOrigin: "top left",
                width: containerWidth > 0 ? `${baseWidth}px` : "auto",
                height: "auto",
            }}
        >
            {/* Header Section */}
            <div className='text-center py-8 border-b' style={{ borderBottomColor: themeColor[3] }}>
                <div className='flex justify-center mb-4'>
                    <div
                        className='w-20 h-20 rounded-full flex items-center justify-center border-2'
                        style={{ borderColor: themeColor[3] }}
                    >
                        {profileInfo.profilePreviewUrl ? (
                            <img
                                src={profileInfo.profilePreviewUrl}
                                className='w-16 h-16 rounded-full object-cover'
                                alt='Profile'
                            />
                        ) : (
                            <div
                                className='w-16 h-16 flex items-center justify-center text-2xl rounded-full'
                                style={{ color: themeColor[4] }}
                            >
                                <LuUser />
                            </div>
                        )}
                    </div>
                </div>
                
                <h1 className='text-2xl font-bold mb-2 tracking-wider' style={{ color: themeColor[4] }}>
                    {profileInfo.fullName}
                </h1>
                
                {/* Contact Info in Header */}
                <div className='flex justify-center items-center gap-6 text-sm' style={{ color: themeColor[4] }}>
                    {contactInfo?.email && (
                        <div className='flex items-center gap-1'>
                            <span>{contactInfo.email}</span>
                        </div>
                    )}
                    {contactInfo?.phone && (
                        <div className='flex items-center gap-1'>
                            <span>|</span>
                            <span>{contactInfo.phone}</span>
                        </div>
                    )}
                    {contactInfo?.location && (
                        <div className='flex items-center gap-1'>
                            <span>|</span>
                            <span>{contactInfo.location}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className='px-8 py-6'>
                {/* Summary Section */}
                <div className='mb-6'>
                    <Title text="Summary" color={themeColor[3]} />
                    <p className='text-sm leading-relaxed text-justify'>
                        {profileInfo.summary}
                    </p>
                </div>

                <div className='grid grid-cols-12 gap-8'>
                    {/* Left Column */}
                    <div className='col-span-8'>
                        {/* Work Experience */}
                        <div className='mb-6'>
                            <Title text="Experience" color={themeColor[3]} />
                            {workExperience.map((data, index) => (
                                <div key={`work_${index}`} className='mb-4'>
                                    <div className='flex justify-between items-start mb-1'>
                                        <div>
                                            <h3 className='font-bold text-sm'>{data.company} | {data.role}</h3>
                                        </div>
                                        <div className='text-xs font-medium' style={{ color: themeColor[4] }}>
                                            {formatYearMonth(data.startDate)} - {formatYearMonth(data.endDate)}
                                        </div>
                                    </div>
                                    <div className='text-xs leading-relaxed ml-4'>
                                        {data.description && (
                                            <ul className='list-disc space-y-1'>
                                                {data.description.split('\n').filter(item => item.trim()).map((item, idx) => (
                                                    <li key={idx}>{item.trim()}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Projects */}
                        {projects?.length > 0 && (
                            <div className='mb-6'>
                                <Title text="Projects" color={themeColor[3]} />
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
                        )}

                        {/* Education and Training */}
                        <div className='mb-6'>
                            <Title text="Education and Training" color={themeColor[3]} />
                            {education.map((data, index) => (
                                <div key={`education_${index}`} className='mb-3'>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <h3 className='font-bold text-sm'>{data.institution}</h3>
                                            <p className='text-sm'>{data.degree}</p>
                                        </div>
                                        <div className='text-xs font-medium' style={{ color: themeColor[4] }}>
                                            {formatYearMonth(data.endDate)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className='col-span-4'>
                        {/* Skills */}
                        <div className='mb-6'>
                            <Title text="Skills" color={themeColor[3]} />
                            <div className='space-y-1'>
                                {skills.map((skill, index) => (
                                    <div key={index} className='text-xs'>
                                        <span className='font-medium'>{skill.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Languages */}
                        {languages?.length > 0 && (
                            <div className='mb-6'>
                                <Title text='Languages' color={themeColor[3]} />
                                <div className='space-y-2'>
                                    {languages.map((lang, index) => (
                                        <div key={index} className='text-xs'>
                                            <div className='flex items-center justify-between mb-1'>
                                                <span className='font-medium'>{lang.name}</span>
                                                <span className='text-xs'>{lang.level}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certifications */}
                        {certification?.length > 0 && (
                            <div className='mb-6'>
                                <Title text='Certifications' color={themeColor[3]} />
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
                        )}

                        {/* Additional Contact Info */}
                        {(contactInfo.linkedin || contactInfo.github || contactInfo.website) && (
                            <div className='mb-6'>
                                <div className='space-y-2 text-xs'>
                                    {contactInfo.linkedin && (
                                        <div className='flex items-center gap-2'>
                                            <RiLinkedinLine style={{ color: themeColor[3] }} />
                                            <span>{contactInfo.linkedin}</span>
                                        </div>
                                    )}
                                    {contactInfo.github && (
                                        <div className='flex items-center gap-2'>
                                            <LuGithub style={{ color: themeColor[3] }} />
                                            <span>{contactInfo.github}</span>
                                        </div>
                                    )}
                                    {contactInfo.website && (
                                        <div className='flex items-center gap-2'>
                                            <LuRss style={{ color: themeColor[3] }} />
                                            <span>{contactInfo.website}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Interests */}
                        {interests?.filter(i => i.trim()).length > 0 && (
                            <div className='mb-6'>
                                <Title text="Interests" color={themeColor[3]} />
                                <div className='flex flex-wrap gap-2'>
                                    {interests
                                        .filter(interest => interest.trim() !== "")
                                        .map((interest, index) => (
                                            <span
                                                key={`interest_${index}`}
                                                className='text-xs px-2 py-1 rounded-full'
                                            >
                                                {interest}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TemplateOne