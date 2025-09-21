import React from 'react';
import Input from '../../../components/Inputs/Input';

function ContactInfoForm({ contactInfo, updateSection }) 
 {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Address"
          placeholder="Short Address"
          type="text"
          value={contactInfo.location || ""}
          onChange={({ target }) => updateSection("location", target.value)}
          className="w-full"
        />

        <Input
          label="Email"
          placeholder="Email Address"
          type="email"
          value={contactInfo.email || ""}
          onChange={({ target }) => updateSection("email", target.value)}
          className="w-full"
        />

        <Input
          label="Phone Number"
          placeholder="999-999-9999"
          type="text"
          value={contactInfo.phone || ""}
          onChange={({ target }) => updateSection("phone", target.value)}
          className="w-full"
        />

        <Input
          label="LinkedIn Profile"
          placeholder="https://www.linkedin.com/in/your-profile"
          type="text"
          value={contactInfo.linkedin || ""}
          onChange={({ target }) => updateSection("linkedin", target.value)}
          className="w-full"
        />

        <Input
          label="GitHub Profile"
          placeholder="http://www.github.com/your-profile"
          type="text"
          value={contactInfo.github || ""}
          onChange={({ target }) => updateSection("github", target.value)}
          className="w-full"
        />

        <Input
          label="Website/Portfolio"
          placeholder="http://www.yourwebsite.com"
          type="text"
          value={contactInfo.website || ""}
          onChange={({ target }) => updateSection("website", target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default ContactInfoForm;
