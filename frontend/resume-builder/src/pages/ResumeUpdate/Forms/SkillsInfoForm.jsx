import React from 'react'
import Input from '../../../components/Inputs/Input'
import { LuPlus, LuTrash2 } from 'react-icons/lu'
import RatingInput from '../../../components/ResumeSection/RatingInput'

function SkillsInfoForm({ skillsInfo = [], updateArrayItem, addArrayItem, removeArrayItem }) {
  return (
    <div className="flex flex-col gap-6 p-4">
      <h2 className="text-xl font-semibold">Skills</h2>

      <div className="flex flex-col gap-4">
        {skillsInfo.map((skill, index) => (
          <div
            key={index}
            className="border rounded-2xl shadow-sm p-4 "
            >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Skill Name"
                placeholder="JavaScript"
                type="text"
                value={skill.name || ''}
                onChange={({ target }) =>
                  updateArrayItem(index, 'name', target.value)
                }
              />

              <div className="flex flex-col">
                <label className="mb-1 font-medium text-sm 
">
                  Proficiency ({Math.round((skill.progress || 0) / 20)}/5)
                </label>
                <div className="mt-2">
                  <RatingInput
                    value={skill.progress || 0}
                    total={5}
                    onChange={(newValue) =>
                      updateArrayItem(index, 'progress', newValue)
                    }
                  />
                </div>
              </div>
            </div>

            {skillsInfo.length > 1 && (
              <button
                type="button"
                className="mt-4 text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                onClick={() => removeArrayItem(index)}
              >
                <LuTrash2 className="h-4 w-4" />
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="bg-blue-600 text-white py-2 px-4 rounded-xl shadow hover:bg-blue-700 transition-all flex items-center gap-2 w-fit text-sm"
          onClick={() =>
            addArrayItem({
              name: '',
              progress: 0,
            })
          }
        >
          <LuPlus className="h-5 w-5" />
          Add Skill
        </button>
      </div>
    </div>
  )
}

export default SkillsInfoForm
