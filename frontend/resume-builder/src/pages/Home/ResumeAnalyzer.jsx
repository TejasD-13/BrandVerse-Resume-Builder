import React, { useState } from 'react';
import {
  LuUpload,
  LuFileText,
  LuCheck,
  LuX,
  LuUser,
  LuTarget,
  LuFile,
  LuBook,
  LuLayers,
  LuBriefcase,
} from 'react-icons/lu';
import { parseResume } from '../../utils/parseResume';
import { analyzeWithGemini } from '../../utils/analyzeWithGemini';
import Navbar from '../../components/Layouts/Navbar';
import { useNavigate } from 'react-router-dom';

const initialResult = {
  summary: '',
  atsSuggestions: '',
  recommendedEdits: '',
  suggestedCourses: '',
  suggestedDomains: '',
  jobRecommendations: '',
};

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(initialResult);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(initialResult);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(initialResult);
    try {
      const resumeText = await parseResume(file);
      if (!resumeText || resumeText.length < 30) {
        throw new Error('Could not extract enough text from the file.');
      }
      const analysis = await analyzeWithGemini(resumeText);
      setResult(analysis);
    } catch (err) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const cleanLine = (line) => line.replace(/^[-#*\s]+/, '').trim();

  const renderSection = (title, content, IconComponent, gradient, bgGradient) => {
    if (!content) return null;

    const points = content.split('\n').filter((line) => line.trim());

    return (
      <div
        className={`rounded-2xl p-8 shadow-lg border border-gray-100 ${bgGradient} relative overflow-hidden`}
      >
        <div className={`absolute top-0 left-0 w-full h-1 ${gradient}`}></div>
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center text-white shadow-lg`}
          >
            <IconComponent className="text-xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="space-y-3">
          {points.map((line, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 leading-relaxed">{cleanLine(line)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const hasResults =
    result.summary ||
    result.atsSuggestions ||
    result.recommendedEdits ||
    result.suggestedCourses ||
    result.suggestedDomains ||
    result.jobRecommendations;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar onAuthClick={() => navigate('/')} />

      <main className="pt-24 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              AI-Powered{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-500">
                Resume Analyzer
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Get comprehensive AI insights on your resume's structure, content quality, optimization suggestions, and job recommendations.
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
                <p className="text-gray-600 mb-8">Supports PDF and DOCX formats</p>
              </div>

              <label className="group block cursor-pointer">
                <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileChange} />
                <div className="border-2 border-dashed border-gray-300 group-hover:border-purple-400 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LuUpload className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Click to upload your resume</h3>
                  <p className="text-gray-500">Drag and drop or click to browse files</p>
                </div>
              </label>

              {file && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <LuFileText className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">Ready for analysis</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 font-medium text-sm px-3 py-1 rounded-lg hover:bg-red-50"
                      onClick={() => {
                        setFile(null);
                        setResult(initialResult);
                        setError('');
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Analyzing Your Resume...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LuUser className="text-xl" />
                    Analyze Resume
                  </div>
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <LuX className="text-red-500 text-xl" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Results */}
          {!loading && !error && hasResults && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LuCheck className="text-2xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete!</h2>
                <p className="text-gray-600">Here are your personalized insights and job suggestions</p>
              </div>

              <div className="grid gap-8">
                {renderSection('Resume Summary', result.summary, LuUser, 'bg-gradient-to-r from-blue-500 to-purple-500', 'bg-gradient-to-br from-blue-50 to-purple-50')}
                {renderSection('ATS Compatibility Suggestions', result.atsSuggestions, LuTarget, 'bg-gradient-to-r from-green-500 to-emerald-500', 'bg-gradient-to-br from-green-50 to-emerald-50')}
                {renderSection('Recommended Edits', result.recommendedEdits, LuFile, 'bg-gradient-to-r from-orange-500 to-red-500', 'bg-gradient-to-br from-orange-50 to-red-50')}
                {renderSection('Suggested Skills & Courses', result.suggestedCourses, LuBook, 'bg-gradient-to-r from-purple-500 to-pink-500', 'bg-gradient-to-br from-purple-50 to-pink-50')}
                {renderSection('Suggested Job Domains', result.suggestedDomains, LuLayers, 'bg-gradient-to-r from-blue-600 to-indigo-600', 'bg-gradient-to-br from-blue-50 to-indigo-50')}
                {renderSection('Job Recommendations', result.jobRecommendations, LuBriefcase, 'bg-gradient-to-r from-amber-600 to-yellow-500', 'bg-gradient-to-br from-yellow-50 to-amber-50')}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ResumeAnalyzer;