import React, { useRef } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

function ProfilePhotoSelector({ image, setImage, preview, setPreview }) {
  const inputRef = useRef(null);

  // Helper to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      if (setPreview) {
        const base64 = await fileToBase64(file);
        setPreview(base64);
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview && setPreview(null);
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!preview ? (
        <div className="w-20 h-20 flex items-center justify-center bg-purple-50 rounded-full relative cursor-pointer">
          <LuUser className="text-4xl text-purple-500" />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img src={preview} alt="profile" className="w-20 h-20 rounded-full object-cover" />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePhotoSelector;
