'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AIContentWriter = () => {
  const [activeTab, setActiveTab] = useState('Generate Content');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Formal');
  const [wordCount, setWordCount] = useState('500');
  const [isGenerating, setIsGenerating] = useState(false);

  const tabs = ['Generate Content', 'Analyses Content', 'Refine Content'];
  const tones = ['Formal', 'Casual', 'Professional', 'Friendly', 'Academic', 'Creative'];
  const wordCounts = ['250', '500', '750', '1000', '1500', '2000'];

  const getHeaderContent = () => {
    switch (activeTab) {
      case 'Generate Content':
        return {
          title: 'Welcome to the AI Content Writer!',
          description: 'Streamline your content creation, review, and optimization process. Use AI to generate new content, analyze existing pieces, and refine them for specific niches.'
        };
      default:
        return {
          title: '',
          description: ''
        };
    }
  };

  const handleAction = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);

    console.log(`${activeTab} with:`, { prompt, tone, wordCount });
  };

  const handleKeyPress = (e:any) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAction();
    }
  };

  const getButtonText = () => {
    switch (activeTab) {
      case 'Generate Content':
        return 'Generate with AI';
      case 'Analyses Content':
        return 'Analyses with AI';
      case 'Refine Content':
        return 'Refine with AI';
      default:
        return 'Analyses with AI';
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="min-h-screen text-white flex flex-col">
      {/* Header Section */}
      <div className="w-full p-6">
        <div className="mb-8">
          <h1 className="text-[32px] font-medium text-[#00FFFF] mb-4">
            {headerContent.title}
          </h1>
          <p className="text-white text-lg font-normal leading-relaxed">
            {headerContent.description}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex mb-8 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 text-center font-medium transition-colors border-b-2 ${activeTab === tab
                ? 'text-white border-[#00FFFF] bg-[#0f1419]'
                : 'text-gray-400 border-transparent hover:text-white hover:bg-[#1a1f2e]'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Spacer to push content to bottom */}
      <div className="flex-grow"></div>

      {/* Main Content Area (positioned at bottom) */}
      <div className="w-full p-6">
        <div className="rounded-lg border border-gray-700">
          {/* Content based on active tab */}
          {activeTab === 'Generate Content' && (
            <div className="p-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write a post about eco-friendly with your niche.."
                className="w-full h-32 p-4 mb-6 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent"
              />

              <div className="flex flex-col sm:flex-row gap-4 ">
                {/* Tone & Style Dropdown */}
                <div className="flex-1">
                  <label className="block text-sm text-gray-300 mb-2">
                    Tone & Style
                  </label>
                  <div className="relative">
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-[#1a1f2e] border border-gray-600 rounded-lg p-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#00FFFF] cursor-pointer"
                    >
                      {tones.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                {/* Word Count Dropdown */}
                <div className="flex-1">
                  <label className="block text-sm text-gray-300 mb-2">
                    Word Count Target
                  </label>
                  <div className="relative">
                    <select
                      value={wordCount}
                      onChange={(e) => setWordCount(e.target.value)}
                      className="w-full bg-[#1a1f2e] border border-gray-600 rounded-lg p-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#00FFFF] cursor-pointer"
                    >
                      {wordCounts.map((count) => (
                        <option key={count} value={count}>{count} words</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="">
                    <button
                      onClick={handleAction}
                      disabled={!prompt.trim() || isGenerating}
                      className={`px-6 py-4 rounded-lg font-medium transition-all ${!prompt.trim() || isGenerating
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#00FF7F] to-[#00C260] text-black hover:from-[#00E070] hover:to-[#00B055] hover:scale-105'
                        }`}
                    >
                      {isGenerating ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        getButtonText()
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'Analyses Content' || activeTab === 'Refine Content') && (
            <>
              <div className="p-6">
                <textarea
                  placeholder="Write a post about eco-friendly with your niche.."
                  className="w-full h-32 p-4 mb-6 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent"
                />
              </div>
              {/* Action Buttons */}
              <div className="p-6">
                <div className="flex justify-end gap-4">
                  <button className="px-6 py-2 bg-[#2a2f3e] text-white rounded-lg font-medium hover:bg-[#343a4a] transition-all">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.9976 5.24658V18.7456" stroke="#00FFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18.747 11.9958H5.24805" stroke="#00FFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={handleAction}
                    disabled={!prompt.trim() || isGenerating}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${!prompt.trim() || isGenerating
                      ? 'bg-[#00FF7F] text-black cursor-not-allowed'
                      : 'bg-[#00FF7F] from-[#00FF7F] to-[#00C260] text-black hover:from-[#00E070] hover:to-[#00B055] hover:scale-105'
                      }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      getButtonText()
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default AIContentWriter;