import React from 'react';
import Input from '../../../components/Inputs/Input';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import RatingInput from '../../../components/ResumeSection/RatingInput';

const cardStyle = 'border rounded-2xl bg-white dark:bg-zinc-900 shadow-md p-5 space-y-4 transition-all';

const AdditionalInfoCard = ({
  languages,
  interests,
  updateArrayItem,
  addArrayItem,
  removeArrayItem
}) => {
  return (
    <div className="flex flex-col gap-8 p-4">

      {/* Section Title */}
      <h2 className="text-2xl font-bold text-zinc-800 dark:text-white tracking-tight">
        Additional Info
      </h2>

      {/* Languages Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-zinc-700 dark:text-zinc-200">Languages</h3>

        {languages?.map((lang, index) => (
          <div key={index} className={cardStyle}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Language"
                placeholder="e.g. English"
                value={lang.name || ''}
                onChange={({ target }) =>
                  updateArrayItem('languages', index, 'name', target.value)
                }
              />

              <div>
                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">
                  Proficiency
                </label>
                <RatingInput
                  value={lang.progress || 0}
                  onChange={(value) =>
                    updateArrayItem('languages', index, 'progress', value)
                  }
                  total={5}
                  activeColor="#a855f7"
                  inactiveColor="#f3e8ff"
                />
              </div>
            </div>

            {languages.length > 1 && (
              <button
                type="button"
                className="text-red-500 text-sm flex items-center gap-1 hover:underline"
                onClick={() => removeArrayItem('languages', index)}
              >
                <LuTrash2 className="w-4 h-4" />
                Remove Language
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="bg-purple-100 text-purple-700 hover:bg-purple-200 transition px-4 py-2 rounded-lg text-sm flex items-center gap-2 w-fit font-medium"
          onClick={() => addArrayItem('languages', { name: '', progress: 0 })}
        >
          <LuPlus className="w-4 h-4" />
          Add Language
        </button>
      </div>

      {/* Interests Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-zinc-700 dark:text-zinc-200">Interests</h3>

        {interests?.map((interest, index) => (
          <div key={index} className={cardStyle}>
            <Input
              placeholder="e.g. Reading"
              value={interest || ''}
              onChange={({ target }) =>
                updateArrayItem('interests', index, null, target.value)
              }
            />

            {interests.length > 1 && (
              <button
                type="button"
                className="text-red-500 text-sm flex items-center gap-1 hover:underline"
                onClick={() => removeArrayItem('interests', index)}
              >
                <LuTrash2 className="w-4 h-4" />
                Remove Interest
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="bg-purple-100 text-purple-700 hover:bg-purple-200 transition px-4 py-2 rounded-lg text-sm flex items-center gap-2 w-fit font-medium"
          onClick={() => addArrayItem('interests', '')}
        >
          <LuPlus className="w-4 h-4" />
          Add Interest
        </button>
      </div>
    </div>
  );
};

export default AdditionalInfoCard;
