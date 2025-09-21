import React from 'react';
import Input from '../../../components/Inputs/Input';
import YearInput from '../../../components/Inputs/YearInput';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

const cardStyle =
  'border rounded-2xl bg-white dark:bg-zinc-900 shadow-md p-5 space-y-4 transition-all';

const CertificationInfoForm = ({
  certificationInfo = [],
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
    <div className="flex flex-col gap-8 p-4">
      <h2 className="text-2xl font-bold text-zinc-800 dark:text-white tracking-tight mb-4">
        Certifications
      </h2>
      {certificationInfo.map((cert, index) => (
        <div key={index} className={cardStyle}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="Title"
              placeholder="e.g. AWS Certified Developer"
              value={cert.title || ''}
              onChange={({ target }) => updateArrayItem(index, 'title', target.value)}
            />
            <Input
              label="Issuer"
              placeholder="e.g. Amazon"
              value={cert.issuer || ''}
              onChange={({ target }) => updateArrayItem(index, 'issuer', target.value)}
            />
            <YearInput
              label="Year"
              placeholder="e.g. 2023"
              value={cert.year || ''}
              onChange={({ target }) => updateArrayItem(index, 'year', target.value)}
            />
          </div>
          {certificationInfo.length > 1 && (
            <button
              type="button"
              className="text-red-500 text-sm flex items-center gap-1 hover:underline mt-2"
              onClick={() => removeArrayItem(index)}
            >
              <LuTrash2 className="w-4 h-4" />
              Remove Certification
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="min-w-[160px] bg-purple-100 text-purple-700 hover:bg-purple-200 transition px-4 py-2 rounded-lg text-sm flex items-center gap-2 w-fit font-medium"
        onClick={() => addArrayItem({ title: '', issuer: '', year: '' })}
      >
        <LuPlus className="w-4 h-4" />
        Add Certification
      </button>
    </div>
  );
};

export default CertificationInfoForm;
