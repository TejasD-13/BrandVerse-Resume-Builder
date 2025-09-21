export async function analyzeATSScore(resumeText, jobDescription) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not found');

  const prompt = `
You are an advanced ATS (Applicant Tracking System) optimization engine.

Evaluate the following resume against the job description and return output using this structure, in plain text (no asterisks, emojis, or Markdown formatting):

1. ATS Score (Score out of 100 with a 2-line explanation)
2. Missing Keywords (List of terms from the job description not found or underused in the resume)
3. Formatting Issues (Only layout and structure issues relevant for ATS parsing)
4. Suggestions (Actionable and non-repetitive advice for improving keyword usage, formatting, and ATS alignment)

Rules:
- Do NOT repeat the same point in multiple sections.
- Each section must appear exactly once.
- Use section titles clearly, and separate each with a blank line.
- Use hyphens (-) for bullet points, NOT asterisks or symbols.
- Be concise but specific. No placeholder or vague phrases.

Now evaluate the resume against the job description:

Resume:
${resumeText}

Job Description:
${jobDescription}
`.trim();

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!response.ok) throw new Error('Gemini API failed');

  const text = (await response.json())?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  console.log('Raw Gemini Response:', text);

  // ATS Score extraction
  const atsScore = (() => {
    const match = text.match(/ATS Score\s*[-–—:]?\s*(\d{1,3})/i);
    const score = match ? parseInt(match[1], 10) : null;
    console.log('Extracted ATS Score:', score);
    return score;
  })();

  // Generic section extractor using numbered headings
  const extractSection = (label) => {
    const pattern = new RegExp(`\\d+\\.\\s*${label}[\\s\\S]*?(?=\\n\\d+\\.|$)`, 'i');
    const match = text.match(pattern);
    if (!match) return '❌ No useful data found for this section.';
    const content = match[0].split('\n').slice(1).join('\n').trim(); // skip the section title
    return content || '❌ No useful data found for this section.';
  };

  const keywords = extractSection('Missing Keywords');
  const formatting = extractSection('Formatting Issues');
  const suggestions = extractSection('Suggestions');

  const result = {
    atsScore,
    keywords,
    formatting,
    suggestions,
    raw: text,
  };

  console.log('Final result object:', result);
  return result;
}
