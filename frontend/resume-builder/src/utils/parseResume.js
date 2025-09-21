import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import mammoth from 'mammoth';

// Don't set workerSrc - let PDF.js use its default behavior
// This should avoid the CORS issues while still allowing PDF processing

export async function parseResume(file) {
  if (!file) throw new Error('No file provided');
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'pdf') {
    // PDF extraction
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + '\n';
    }
    return text;
  } else if (ext === 'docx') {
    // DOCX extraction
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value;
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX.');
  }
} 