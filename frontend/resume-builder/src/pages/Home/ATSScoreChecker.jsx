import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { LuUpload, LuFileText, LuCheck, LuX, LuTarget, LuSearch, LuAlignLeft, LuLightbulb, LuTrendingUp } from 'react-icons/lu';
import { parseResume } from '../../utils/parseResume';
import { analyzeATSScore } from '../../utils/analyzerATSScore';
import Navbar from '../../components/Layouts/Navbar';
import { useNavigate } from 'react-router-dom';

function ATSScoreChecker() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription.trim()) {
      setError('Please upload your resume and enter a job description.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const resumeText = await parseResume(resumeFile);
      const analysis = await analyzeATSScore(resumeText, jobDescription);
      console.log(analysis);
      
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const renderSection = (title, content, IconComponent, gradient, bgGradient) => {
    if (!content) return null;
    
    return (
      <div className={`rounded-2xl p-6 shadow-lg border border-gray-100 ${bgGradient} relative overflow-hidden`}>
        <div className={`absolute top-0 left-0 w-full h-1 ${gradient}`}></div>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl ${gradient} flex items-center justify-center text-white shadow-lg`}>
            <IconComponent className="text-lg" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <div className="prose prose-sm max-w-none text-gray-700">
          <ReactMarkdown
            components={{
              ul: ({children}) => <ul className="space-y-1 ml-4">{children}</ul>,
              li: ({children}) => (
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{children}</span>
                </li>
              ),
              p: ({children}) => <p className="mb-2 leading-relaxed">{children}</p>
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar onAuthClick={() => navigate('/')} />
      
      <main className="pt-24 min-h-screen">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Beat the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500">
                ATS System
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Compare your resume against job descriptions and get an ATS compatibility score with detailed optimization recommendations
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload & Compare</h2>
                <p className="text-gray-600">Upload your resume and paste the job description to get started</p>
              </div>

              {/* Resume Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  📄 Upload Your Resume
                </label>
                <label className="group block cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleResumeChange}
                  />
                  <div className="border-2 border-dashed border-gray-300 group-hover:border-blue-400 rounded-2xl p-8 text-center transition-all duration-200 group-hover:bg-blue-50">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                      <LuUpload className="text-xl text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Click to upload resume
                    </h3>
                    <p className="text-sm text-gray-500">
                      PDF or DOCX format
                    </p>
                  </div>
                </label>

                {resumeFile && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <LuFileText className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{resumeFile.name}</p>
                          <p className="text-xs text-gray-600">Ready for analysis</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 font-medium text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        onClick={() => {
                          setResumeFile(null);
                          setResult(null);
                          setError('');
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  💼 Job Description
                </label>
                <textarea
                  placeholder="Paste the complete job description here including requirements, responsibilities, and qualifications..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none transition-all duration-200"
                />
                <p className="text-xs text-gray-500">
                  💡 Tip: Include all sections like requirements, responsibilities, and preferred qualifications for better analysis
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !resumeFile || !jobDescription.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Analyzing Compatibility...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LuTarget className="text-xl" />
                    Check ATS Compatibility
                  </div>
                )}
              </button>

              

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <LuX className="text-red-500 text-xl flex-shrink-0" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <LuTarget className="text-2xl text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analyzing ATS compatibility...
              </h3>
              <p className="text-gray-600">
                Comparing your resume with the job requirements
              </p>
            </div>
          )}

          {/* Results Section */}
          {!loading && result && (
            <div className="space-y-8">
              {/* Score Display */}
              <div className="text-center mb-12">
                <div className="relative inline-block">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${getScoreGradient(result.atsScore)} flex items-center justify-center mx-auto mb-4 shadow-2xl`}>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{result.atsScore || 'N/A'}</div>
                      <div className="text-sm text-white opacity-90">/ 100</div>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <LuTrendingUp className={`text-xl ${getScoreColor(result.atsScore)}`} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">ATS Compatibility Score</h2>
                <p className="text-gray-600 max-w-xl mx-auto">
                  {result.atsScore >= 80 ? 'Excellent! Your resume is highly compatible with ATS systems.' :
                   result.atsScore >= 60 ? 'Good score! Some improvements could boost your compatibility.' :
                   'Needs improvement. Follow the suggestions below to optimize for ATS systems.'}
                </p>
              </div>

              {/* Analysis Sections */}
              <div className="grid gap-6">
                {renderSection(
                  'Missing Keywords',
                  result.keywords,
                  LuSearch,
                  'bg-gradient-to-r from-red-500 to-pink-500',
                  'bg-gradient-to-br from-red-50 to-pink-50'
                )}
                
                {renderSection(
                  'Formatting Issues',
                  result.formatting,
                  LuAlignLeft,
                  'bg-gradient-to-r from-yellow-500 to-orange-500',
                  'bg-gradient-to-br from-yellow-50 to-orange-50'
                )}
                
                {renderSection(
                  'Optimization Suggestions',
                  result.suggestions,
                  LuLightbulb,
                  'bg-gradient-to-r from-green-500 to-emerald-500',
                  'bg-gradient-to-br from-green-50 to-emerald-50'
                )}
              </div>

              {/* CTA Section */}
              <div className="text-center mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Optimize Your Resume?</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Use these insights to improve your ATS score and increase your chances of getting noticed
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/resume-analyzer')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Analyze Resume Further
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Build Optimized Resume
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ATSScoreChecker;