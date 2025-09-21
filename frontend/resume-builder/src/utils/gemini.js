// gemini.js - Enhanced Resume Assistant API with Concise Responses

/**
 * Enhanced Gemini API function specifically designed for resume assistance
 * Includes intelligent prompt engineering and error handling
 */
export async function askGemini(userInput) {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 
                         process.env.REACT_APP_GEMINI_API_KEY || 
                         process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error('Gemini API key not found in environment variables');
    return '❌ **API Configuration Error**\n\nPlease add your Gemini API key to your environment variables:\n• `VITE_GEMINI_API_KEY` (for Vite)\n• `REACT_APP_GEMINI_API_KEY` (for Create React App)\n• `GEMINI_API_KEY` (for Node.js)';
  }

  const enhancedPrompt = createResumePrompt(userInput);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: enhancedPrompt }] 
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return handleApiError(data, response.status);
    }

    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      console.error("No text generated:", data);
      return '❌ **No Response Generated**\n\nThe AI didn\'t generate a response. This might be due to safety filters or content policies. Please try rephrasing your question.';
    }

    return formatResponse(generatedText);

  } catch (error) {
    console.error("Gemini API network error:", error);
    return handleNetworkError(error);
  }
}

/**
 * Creates enhanced prompts based on user intent for resume optimization
 * Modified to give concise, copy-ready responses
 */
function createResumePrompt(userInput) {
  const lowerInput = userInput.toLowerCase();
  
  // System context for all prompts - emphasizing brevity
  const systemContext = `You are an expert resume writer and ATS specialist. Your responses must be:
- CONCISE and ready-to-copy
- No explanations unless specifically asked
- Focus only on the improved content
- Use bullet points format for resume content
- Include relevant keywords naturally`;

  // Rephrase/Improve Intent
  if (lowerInput.includes('rephrase') || lowerInput.includes('improve') || 
      lowerInput.includes('rewrite') || lowerInput.includes('better') ||
      lowerInput.includes('enhance')) {
    return `${systemContext}

**TASK:** Rewrite this resume content to be more impactful and ATS-optimized.

**USER CONTENT:** "${userInput}"

**RESPONSE FORMAT:** Only provide the improved bullet points, ready to copy. Use strong action verbs, specific metrics, and relevant keywords. No explanations.

**EXAMPLE OUTPUT:**
• Developed and deployed 15+ full-stack web applications using React and Node.js, increasing user engagement by 30%
• Led migration of legacy systems to AWS microservices architecture, reducing infrastructure costs by 20%`;
  }

  // Keywords/ATS Intent
  if (lowerInput.includes('keyword') || lowerInput.includes('ats') || 
      lowerInput.includes('seo') || lowerInput.includes('optimize')) {
    return `${systemContext}

**TASK:** Provide relevant ATS keywords for this role/industry.

**USER QUERY:** "${userInput}"

**RESPONSE FORMAT:** List only the most important keywords, organized by category. No explanations.

**EXAMPLE OUTPUT:**
**Technical Skills:** React, Node.js, Python, AWS, Docker, PostgreSQL
**Action Verbs:** Developed, Implemented, Optimized, Led, Architected
**Industry Terms:** Full-stack, Microservices, API, CI/CD, Agile`;
  }

  // Quantify/Metrics Intent
  if (lowerInput.includes('quantify') || lowerInput.includes('metric') || 
      lowerInput.includes('number') || lowerInput.includes('measure')) {
    return `${systemContext}

**TASK:** Add specific metrics and quantify this achievement.

**USER CONTENT:** "${userInput}"

**RESPONSE FORMAT:** Only provide the quantified version, ready to copy. Include specific numbers, percentages, timeframes, and scope.

**EXAMPLE OUTPUT:**
• Managed 12-person cross-functional team across 3 departments, delivering 8 projects on time and 15% under budget over 6 months`;
  }

  // Power Words/Action Verbs Intent
  if (lowerInput.includes('power word') || lowerInput.includes('action verb') || 
      lowerInput.includes('strong') || lowerInput.includes('impactful')) {
    return `${systemContext}

**TASK:** Replace weak language with powerful action verbs.

**USER CONTENT:** "${userInput}"

**RESPONSE FORMAT:** Only provide the enhanced version with strong action verbs, ready to copy.

**EXAMPLE OUTPUT:**
• Spearheaded development of customer portal, resulting in 40% faster query resolution
• Orchestrated team restructuring initiative, boosting productivity by 25%`;
  }

  // General Resume Help - Keep it concise
  return `${systemContext}

**USER QUESTION:** "${userInput}"

**TASK:** Provide a concise, actionable answer.

**RESPONSE FORMAT:** Give direct, practical advice. If providing examples, make them copy-ready. Keep explanations brief and focused.`;
}

/**
 * Formats the AI response for better readability - simplified version
 */
function formatResponse(text) {
  // Clean up common formatting issues
  let formatted = text
    .replace(/\*\*\*(.+?)\*\*\*/g, '**$1**') // Triple asterisks to double
    .replace(/\n{3,}/g, '\n\n') // Reduce excessive line breaks
    .replace(/^\*\*EXAMPLE OUTPUT:\*\*\n/gm, '') // Remove example output headers
    .replace(/^\*\*RESPONSE FORMAT:\*\*.*$/gm, '') // Remove response format instructions
    .trim();

  return formatted;
}

/**
 * Handles API errors with user-friendly messages
 */
function handleApiError(data, status) {
  const errorMessage = data.error?.message || 'Unknown API error';
  
  switch (status) {
    case 400:
      return `❌ **Request Error**\n\nThere was an issue with your request. Please try:\n• Simplifying your question\n• Avoiding special characters\n• Making your request more specific\n\n*Technical: ${errorMessage}*`;
    
    case 401:
      return `🔑 **Authentication Error**\n\nYour API key appears to be invalid. Please:\n• Check your Gemini API key\n• Ensure it's properly set in environment variables\n• Verify the key has necessary permissions\n\n*Technical: ${errorMessage}*`;
    
    case 403:
      return `🚫 **Access Denied**\n\nThis request was blocked. This might be due to:\n• Content policy restrictions\n• API quota limits\n• Geographic restrictions\n\n*Technical: ${errorMessage}*`;
    
    case 429:
      return `⏰ **Rate Limit Exceeded**\n\nToo many requests. Please:\n• Wait a moment before trying again\n• Consider upgrading your API plan\n• Reduce request frequency\n\n*Technical: ${errorMessage}*`;
    
    case 500:
    case 502:
    case 503:
      return `🔧 **Server Error**\n\nGemini's servers are experiencing issues. Please:\n• Try again in a few moments\n• The issue is likely temporary\n• Check Gemini's status page\n\n*Technical: ${errorMessage}*`;
    
    default:
      return `❌ **Unexpected Error**\n\nSomething went wrong (Status: ${status}).\n\nPlease try again or contact support if the issue persists.\n\n*Technical: ${errorMessage}*`;
  }
}

/**
 * Handles network errors
 */
function handleNetworkError(error) {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return `🌐 **Connection Error**\n\nCan't reach Gemini's servers. Please check:\n• Your internet connection\n• Firewall/proxy settings\n• Try again in a moment\n\n*Technical: ${error.message}*`;
  }
  
  if (error.name === 'AbortError') {
    return `⏱️ **Request Timeout**\n\nThe request took too long. Please:\n• Try again with a shorter question\n• Check your connection speed\n• The servers might be busy\n\n*Technical: Request was aborted*`;
  }
  
  return `❌ **Network Error**\n\nFailed to connect to Gemini API.\n\nPlease try again or check your connection.\n\n*Technical: ${error.message}*`;
}

/**
 * Test function to verify API connectivity
 */
export async function testGeminiConnection() {
  try {
    const response = await askGemini("Test connection - respond with 'Connected successfully'");
    return response.includes('Connected') || response.includes('successfully');
  } catch {
    return false;
  }
}