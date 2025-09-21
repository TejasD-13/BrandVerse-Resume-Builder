export async function analyzeWithGemini(resumeText) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not found');

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const prompt = `
You are a professional resume reviewer and career coach.

Analyze the following resume and return your feedback in **plain text** format.

Use this exact structure:

## Resume Summary
- Write 2–3 lines about the overall quality and tone.

## ATS Compatibility Suggestions
- Point out any formatting issues for ATS.
- Note any missing resume sections or weak keywords.

## Recommended Improvements
- Reword weak bullet points or vague phrasing.
- Recommend better structure, phrasing, or clarity.

## Suggested Skills or Courses
Suggest relevant online courses or certifications, grouped like this:

### Technical Skills
- Example: Coursera – Algorithms Specialization by Stanford

### Tools & Platforms
- Example: Coursera – Google Cloud Professional Certificate

### Soft Skills
- Example: Udemy – Effective Communication for Engineers

## Suggested Job Domains
Based on the resume’s skills and experience, recommend 2–3 career paths:
- Frontend Development
- Backend Development
- QA Automation
- Cloud Engineering
- AI/ML Research

Now evaluate the following resume and return results in the exact format:

Resume:
${resumeText}
  `;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to analyze resume with Gemini';

      switch (response.status) {
        case 400:
          errorMessage = 'Invalid request. Please check your resume content.';
          break;
        case 401:
          errorMessage = 'API key is invalid or expired.';
          break;
        case 403:
          errorMessage = 'Access denied. Please check your API key permissions.';
          break;
        case 429:
          errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
          break;
        case 503:
          errorMessage = 'Gemini service is temporarily unavailable. Please try again in a few minutes.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = `API Error (${response.status}): ${errorText}`;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const extractSection = (label) => {
      const regex = new RegExp(
        `(?:\\*\\*|##)?\\s*${label}\\s*\\n+([\\s\\S]*?)(?=\\n\\s*(?:##|\\*\\*|$))`,
        'i'
      );
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    return {
      summary: extractSection('Resume Summary'),
      atsSuggestions: extractSection('ATS Compatibility Suggestions'),
      recommendedEdits: extractSection('Recommended Improvements'),
      suggestedCourses: extractSection('Suggested Skills or Courses'),
      raw: text,
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
}

