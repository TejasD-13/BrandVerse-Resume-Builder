// ResumeAssistant.jsx - Enhanced Resume Assistant Chatbot Component

import React, { useState, useRef, useEffect } from 'react';
import { askGemini, testGeminiConnection } from '../../utils/gemini';

// SVG Icons
const MinimizeIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeWidth="2" d="M5 12h14"/>
  </svg>
);

const ExpandIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeWidth="2" d="M12 5v14"/>
    <path stroke="currentColor" strokeWidth="2" d="M5 12h14"/>
  </svg>
);

const ClipboardIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
    <rect x="7" y="4" width="10" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 2h6v4H9z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeWidth="2" d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z"/>
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeWidth="2" d="m22 2-7 20-4-9-9-4 20-7z"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeWidth="2" d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path stroke="currentColor" strokeWidth="2" d="M21 3v5h-5"/>
    <path stroke="currentColor" strokeWidth="2" d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path stroke="currentColor" strokeWidth="2" d="M8 16H3v5"/>
  </svg>
);

const Chatbot = () => {
  // Draggable state
  const [position, setPosition] = useState({ x: 40, y: 120 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const botRef = useRef(null);

  // UI state
  const [minimized, setMinimized] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown'); // 'connected', 'error', 'unknown'

  // Chat state
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: '🚀 **Resume Assistant Ready!**\n\nI specialize in helping you create impactful, ATS-optimized resumes. Here\'s what I can do:\n\n• **✏️ Rephrase** bullet points for maximum impact\n• **🔑 Suggest keywords** for your target industry\n• **📊 Quantify achievements** with metrics and numbers\n• **💪 Enhance with power words** and strong action verbs\n• **🎯 Optimize for ATS** systems and hiring managers\n\n**💡 Pro Tip:** Just paste your resume content and tell me what you need help with!',
      type: 'welcome',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  // Quick action templates
  const quickActions = [
    { 
      label: 'Rephrase Text', 
      icon: '✏️', 
      prompt: 'Help me rephrase this resume bullet point to be more impactful and ATS-friendly:\n\n',
      placeholder: 'Paste your bullet point here...'
    },
    { 
      label: 'Add Keywords', 
      icon: '🔑', 
      prompt: 'What ATS keywords should I include for this job role/industry:\n\n',
      placeholder: 'Describe the role or paste job description...'
    },
    { 
      label: 'Quantify Impact', 
      icon: '📊', 
      prompt: 'Help me add metrics and quantify this achievement:\n\n',
      placeholder: 'Describe your achievement...'
    },
    { 
      label: 'Power Words', 
      icon: '💪', 
      prompt: 'Suggest powerful action verbs to replace weak words in this resume content:\n\n',
      placeholder: 'Paste content to enhance...'
    }
  ];

  // Sample prompts for inspiration
  const samplePrompts = [
    "Rephrase: Managed a team and completed projects on time",
    "Keywords for software engineer position",
    "Quantify: Improved customer satisfaction through better service",
    "Make this more powerful: Responsible for handling customer complaints"
  ];

  // Initialize connection test
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await testGeminiConnection();
        setConnectionStatus(isConnected ? 'connected' : 'error');
      } catch {
        setConnectionStatus('error');
      }
    };
    checkConnection();
  }, []);

  // Drag functionality
  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    
    setDragging(true);
    const rect = botRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - (minimized ? 320 : 384);
      const maxY = window.innerHeight - (minimized ? 60 : 576);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setDragging(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, minimized]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when expanded
  useEffect(() => {
    if (!minimized && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [minimized]);

  // Quick action handler
  const handleQuickAction = (action) => {
    setInput(action.prompt);
    if (!minimized) {
      inputRef.current?.focus();
      // Move cursor to end
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(action.prompt.length, action.prompt.length);
        }
      }, 50);
    }
  };

  // Sample prompt handler
  const handleSamplePrompt = (prompt) => {
    setInput(prompt);
    if (!minimized) {
      inputRef.current?.focus();
    }
  };

  // Message sending
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMessage = { 
      sender: 'user', 
      text: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await askGemini(userMessage.text);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: response,
        type: 'response',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: '❌ **Oops! Something went wrong.**\n\nPlease check your connection and try again. If the problem persists, make sure your Gemini API key is properly configured.',
        type: 'error',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Copy functionality with enhanced feedback
  const handleCopy = async (text, index) => {
    try {
      // Clean markdown formatting for copying
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, ''))
        .trim();

      await navigator.clipboard.writeText(cleanText);
      setCopiedIdx(index);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedIdx(index);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([messages[0]]); // Keep welcome message
  };

  // Retry last message
  const retryLastMessage = () => {
    const lastUserMessage = messages.slice().reverse().find(msg => msg.sender === 'user');
    if (lastUserMessage) {
      setInput(lastUserMessage.text);
      inputRef.current?.focus();
    }
  };

  return (
    <div
      ref={botRef}
      className={`fixed z-50 shadow-2xl rounded-xl bg-white border border-gray-300 flex flex-col transition-all duration-300 ease-in-out ${
        minimized ? 'w-80 h-16' : 'w-96 h-[36rem]'
      }`}
      style={{ 
        left: position.x, 
        top: position.y,
        cursor: dragging ? 'grabbing' : 'default',
        maxHeight: '90vh',
        maxWidth: '90vw'
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-t-xl cursor-move text-white select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <SparkleIcon />
          <span className="font-bold text-sm">Resume Assistant</span>
          {connectionStatus === 'connected' && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Connected"></div>
          )}
          {connectionStatus === 'error' && (
            <div className="w-2 h-2 bg-red-400 rounded-full" title="Connection Error"></div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {!minimized && (
            <>
              <button
                className="p-1 rounded hover:bg-white/20 focus:outline-none transition-colors"
                onClick={clearChat}
                title="Clear chat"
                tabIndex={0}
              >
                <RefreshIcon />
              </button>
            </>
          )}
          <button
            className="p-1 rounded hover:bg-white/20 focus:outline-none transition-colors"
            onClick={() => setMinimized(!minimized)}
            title={minimized ? 'Expand' : 'Minimize'}
            tabIndex={0}
          >
            {minimized ? <ExpandIcon /> : <MinimizeIcon />}
          </button>
        </div>
      </div>

      {/* Quick Actions Bar (when minimized) */}
      {minimized && (
        <div className="px-3 py-2 bg-gray-50 rounded-b-xl">
          <div className="flex gap-2 overflow-x-auto">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm"
                onClick={() => {
                  setMinimized(false);
                  setTimeout(() => handleQuickAction(action), 100);
                }}
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      {!minimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 bg-gradient-to-b from-gray-50 to-white" style={{ minHeight: '0' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="relative flex items-start group max-w-[85%]">
                  <div
                    className={`px-4 py-3 rounded-lg text-sm whitespace-pre-line leading-relaxed shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-sm'
                        : msg.type === 'welcome'
                        ? 'bg-gradient-to-r from-green-50 to-blue-50 text-gray-800 border-2 border-green-200 rounded-bl-sm'
                        : msg.type === 'error'
                        ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                  
                  {/* Copy button for bot messages */}
                  {msg.sender === 'bot' && (
                    <button
                      className="ml-2 mt-1 p-2 rounded-full hover:bg-gray-200 focus:outline-none transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy response"
                      onClick={() => handleCopy(msg.text, i)}
                      tabIndex={0}
                    >
                      <ClipboardIcon />
                      {copiedIdx === i && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs rounded px-2 py-1 pointer-events-none select-none shadow-lg z-10">
                          ✓ Copied!
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white rounded-lg px-4 py-3 shadow-md border border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">Resume Assistant is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions Section */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  className="text-xs px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm border border-gray-200"
                  onClick={() => handleQuickAction(action)}
                  title={action.placeholder}
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sample Prompts */}
          {messages.length === 1 && !loading && (
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
              <div className="text-xs text-blue-700 font-medium mb-2">💡 Try these examples:</div>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    onClick={() => handleSamplePrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Section */}
          <form onSubmit={sendMessage} className="px-4 py-3 bg-white border-t border-gray-200 rounded-b-xl">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me to rephrase, add keywords, quantify achievements, or enhance your resume content..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none text-sm leading-relaxed max-h-20"
                  rows="1"
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(e);
                    }
                  }}
                  disabled={loading}
                />
                {connectionStatus === 'error' && (
                  <div className="absolute -top-6 left-0 text-xs text-red-600">
                    ⚠️ API connection error
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium shadow-md"
              >
                <SendIcon />
                Send
              </button>
            </div>
            
            {/* Error message for connection issues */}
            {connectionStatus === 'error' && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded border border-red-200">
                ⚠️ Unable to connect to Gemini API. Please check your configuration.
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default Chatbot;