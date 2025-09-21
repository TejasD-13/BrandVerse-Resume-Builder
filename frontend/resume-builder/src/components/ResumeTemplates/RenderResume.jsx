import React from 'react'
import TemplateOne from './TemplateOne';
import TemplateTwo from './TemplateTwo'
import TemplateThree from './TemplateThree';
import TemplateFour from './TemplateFour'
import TemplateFive from './TemplateFive';
import TemplateSix from './TemplateSix';
import TemplateSeven from './TemplateSeven';
import TemplateEight from './TemplateEight';
import TemplateNine from './TemplateNine';
import TemplateTen from './TemplateTen';

const RenderResume = ({
    templateId, resumeData, colorPalette, containerWidth
}) => {
    switch ( templateId) {
        case "01":
            return (
                <TemplateOne 
                    resumeData={resumeData}
                    colorPalette={colorPalette}
                    containerWidth={containerWidth}
                />
            );
        
        case "02":
            return (
                <TemplateTwo
                    resumeData={resumeData}
                    colorPalette={colorPalette}
                    containerWidth={containerWidth}
                />
            );

        case "03":
            return (
                <TemplateThree
                    resumeData={resumeData}
                    colorPalette={colorPalette}
                    containerWidth={containerWidth}
                />
            );
        case "04":
            return (
                <TemplateFour
                    resumeData={resumeData}
                    colorPalette={colorPalette}
                    containerWidth={containerWidth}
                />
            );
        case "05":
            return (
                <TemplateFive
                    resumeData={resumeData}
                    colorPalette={colorPalette}
                    containerWidth={containerWidth}
                />
            );
        case "06":
            return (
                <TemplateSix
                    resumeData={resumeData}
                    colorPalette={colorPalette}
                    containerWidth={containerWidth}
                />
            );
        case "07":
            return (
                <TemplateSeven
                    resumeData={resumeData}
                    colorPalette={colorPalette}
                    containerWidth={containerWidth}
                />
            );
        case "08":
            return (
                <TemplateEight
                    resumeData={resumeData}
                    colorPalette={colorPalette}
                    containerWidth={containerWidth}
                />
            );
         case "09":
            return (
                <TemplateNine
                    resumeData={resumeData}
                    colorPalette={colorPalette}
                    containerWidth={containerWidth}
                />
            );
        case "10":
            return (
                <TemplateTen
                    resumeData={resumeData}
                    colorPalette={colorPalette}
                    containerWidth={containerWidth}
                />
            );
        default:
            return(
                <TemplateOne 
                    resumeData={resumeData}
                    colorPalette={colorPalette}
                    containerWidth={containerWidth}
                />
            )

    }
  return (
    <div>RenderResume</div>
  )
}

export default RenderResume