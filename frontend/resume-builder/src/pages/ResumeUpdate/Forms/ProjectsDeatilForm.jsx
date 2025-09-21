import React from 'react';
import Input from '../../../components/Inputs/Input';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

const ProjectsDetailForm = ({ projectInfo, updateArrayItem, addArrayItem, removeArrayItem }) => {
  return (
    <div className="flex flex-col gap-6 p-4">
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Projects</h2>

      <div className="flex flex-col gap-4">
        {projectInfo.map((project, index) => (
          <div
            key={index}
            className="border rounded-2xl shadow-sm p-5 bg-white dark:bg-zinc-900 space-y-4"
          >
            {/* Project Title */}
            <Input
              label="Project Title"
              placeholder="Portfolio Website"
              type="text"
              value={project.title || ''}
              onChange={({ target }) => updateArrayItem(index, 'title', target.value)}
            />

            {/* Description */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Description
              </label>
              <textarea
                placeholder="Short description about the project"
                className="w-full border rounded-lg p-2 text-sm bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white resize-none"
                rows={3}
                value={project.description || ''}
                onChange={({ target }) => updateArrayItem(index, 'description', target.value)}
              />
            </div>

            {/* GitHub and Live Demo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="GitHub Link"
                placeholder="https://github.com/username/project"
                type="url"
                value={project.github || ''}
                onChange={({ target }) => updateArrayItem(index, 'github', target.value)}
              />
              <Input
                label="Live Demo URL"
                placeholder="https://yourproject.live"
                type="url"
                value={project.liveDemo || ''}
                onChange={({ target }) => updateArrayItem(index, 'liveDemo', target.value)}
              />
            </div>

            {/* Remove Button */}
            {projectInfo.length > 1 && (
              <button
                type="button"
                className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                onClick={() => removeArrayItem(index)}
              >
                <LuTrash2 className="h-4 w-4" />
                Remove Project
              </button>
            )}
          </div>
        ))}

        {/* Add Project Button */}
        <button
          type="button"
          className="mt-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl shadow transition-all text-sm w-fit flex items-center gap-2"
          onClick={() =>
            addArrayItem({
              title: '',
              description: '',
              github: '',
              liveDemo: '',
            })
          }
        >
          <LuPlus className="h-5 w-5" />
          Add Project
        </button>
      </div>
    </div>
  );
};

export default ProjectsDetailForm;
