import React from 'react';
import ProfilePhotoSelector from '../../../components/Inputs/ProfilePhotoSelector';
import Input from '../../../components/Inputs/Input';

function ProfileInfoForm({ profileData, updateSection, onNext }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>

      <div className="flex flex-col items-center gap-6 md:gap-10">
        {/* Profile Photo */}
        <ProfilePhotoSelector
          image={profileData?.profileImg}
          setImage={(value) => updateSection("profileImg", value)}
          preview={profileData?.profilePreviewUrl}
          setPreview={(value) => updateSection("profilePreviewUrl", value)}
        />

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          <Input
            value={profileData.fullName || ""}
            onChange={({ target }) => updateSection("fullName", target.value)}
            label="Full Name"
            placeholder="John"
            type="text"
            className="w-full"
          />

          <Input
            value={profileData.designation || ""}
            onChange={({ target }) => updateSection("designation", target.value)}
            label="Designation"
            placeholder="UI Designer"
            type="text"
            className="w-full"
          />
        </div>

        {/* Summary */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Summary
          </label>
          <textarea
            placeholder="Short Introduction"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            rows={4}
            value={profileData.summary || ""}
            onChange={({ target }) => updateSection("summary", target.value)}
          />
        </div>
      </div>

      
    </div>
  );
}

export default ProfileInfoForm;
