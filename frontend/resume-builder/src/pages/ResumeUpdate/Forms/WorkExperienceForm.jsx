import React from 'react';
import Input from '../../../components/Inputs/Input';
import DateInput from '../../../components/Inputs/DateInput';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

function WorkExperienceForm({ workExperience, updateArrayItem, addArrayItem, removeArrayItem }) {
  return (
    <div className='space-y-5 p-4'>
      <h2 className='text-xl  font-semibold text-gray-800'>Work Experience</h2>

      <div className='space-y-6'>
        {workExperience.map((experience, index) => (
          <div
            key={index}
            className='bg-white border border-purple-100 rounded-2xl p-4 shadow-sm'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                label='Company'
                placeholder='ABC Corp'
                type='text'
                value={experience.company || ''}
                onChange={({ target }) =>
                  updateArrayItem(index, 'company', target.value)
                }
              />

              <Input
                label='Role'
                placeholder='Frontend Developer'
                type='text'
                value={experience.role || ''}
                onChange={({ target }) =>
                  updateArrayItem(index, 'role', target.value)
                }
              />

              <DateInput
                label='Start Date'
                value={experience.startDate || ''}
                onChange={({ target }) =>
                  updateArrayItem(index, 'startDate', target.value)
                }
              />

              <DateInput
                label='End Date'
                value={experience.endDate || ''}
                onChange={({ target }) =>
                  updateArrayItem(index, 'endDate', target.value)
                }
              />
            </div>

            <div className='mt-4'>
              <label className='text-sm font-medium text-gray-700'>Description</label>
              <textarea
                className='mt-1 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:outline-none px-3 py-2 text-sm'
                placeholder='What did you do in this role?'
                rows={3}
                value={experience.description || ''}
                onChange={({ target }) =>
                  updateArrayItem(index, 'description', target.value)
                }
              />
            </div>

            {workExperience.length > 1 && (
              <div className='mt-3 flex justify-end'>
                <button
                  type='button'
                  className='text-red-600 text-sm flex items-center gap-1 hover:underline'
                  onClick={() => removeArrayItem(index)}
                >
                  <LuTrash2 className='text-base' />
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}

        <div>
          <button
              type='button'
              className='flex items-center gap-2 bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-purple-700 transition'
              onClick={() =>
                addArrayItem({
                  company: '',
                  role: '',
                  startDate: '',
                  endDate: '',
                  description: ''
                })
              }
            >
              <LuPlus className='text-base' />
              Add Work Experience
            </button>

        </div>
      </div>
    </div>
  );
}

export default WorkExperienceForm;
