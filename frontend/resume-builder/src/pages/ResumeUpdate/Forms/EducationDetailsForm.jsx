import React from 'react'
import Input from '../../../components/Inputs/Input'
import DateInput from '../../../components/Inputs/DateInput'
import { LuPlus, LuTrash2 } from 'react-icons/lu'

function EducationDetailsForm({
  eduacationInfo,
  updatedArrayItem,
  addArrayItem,
  removeArrayItem,
}) {
  return (
    <div className="flex flex-col gap-6 px-6 py-4">
      <h2 className="text-xl font-semibold text-gray-800">Education</h2>

      <div className="flex flex-col gap-4">
        {eduacationInfo.map((education, index) => (
          <div
            key={index}
            className="border border-purple-100 rounded-2xl shadow-sm p-4 bg-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Degree"
                placeholder="B.Tech in Computer Science"
                type="text"
                value={education.degree || ''}
                onChange={({ target }) =>
                  updatedArrayItem(index, 'degree', target.value)
                }
              />

              <Input
                label="Institution"
                placeholder="ABC University"
                type="text"
                value={education.institution || ''}
                onChange={({ target }) =>
                  updatedArrayItem(index, 'institution', target.value)
                }
              />

              <DateInput
                label="Start Date"
                value={education.startDate || ''}
                onChange={({ target }) =>
                  updatedArrayItem(index, 'startDate', target.value)
                }
              />

              <DateInput
                label="End Date"
                value={education.endDate || ''}
                onChange={({ target }) =>
                  updatedArrayItem(index, 'endDate', target.value)
                }
              />
            </div>

            {eduacationInfo.length > 1 && (
              <button
                type="button"
                className="mt-4 text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"
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
          className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium px-4 py-2 rounded-lg transition-all w-fit"
          onClick={() =>
            addArrayItem({
              degree: '',
              institution: '',
              startDate: '',
              endDate: '',
            })
          }
        >
          <LuPlus className="h-5 w-5" />
          Add Education
        </button>
      </div>
    </div>
  )
}

export default EducationDetailsForm
