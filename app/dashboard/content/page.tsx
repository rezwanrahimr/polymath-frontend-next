'use client';
import React, { useState, useRef } from 'react';
import { ChevronDown, Sparkles, FileText, RefreshCw, Plus, Copy, Download, PlusIcon } from 'lucide-react';

const AIContentWriter = () => {
  const [activeTab, setActiveTab] = useState('Generate Content');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Formal');
  const [wordCount, setWordCount] = useState('500');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const textareaRef = useRef(null);

  const tabs = [
    { id: 'Generate Content', icon: Sparkles, label: 'Generate Content' },
    { id: 'Analyses Content', icon: FileText, label: 'Analyze Content' },
    { id: 'Refine Content', icon: RefreshCw, label: 'Refine Content' }
  ];

  const tones = [
    { value: 'Formal', label: 'Formal' },
    { value: 'Casual', label: 'Casual' },
    { value: 'Professional', label: 'Professional' },
    { value: 'Friendly', label: 'Friendly' },
    { value: 'Academic', label: 'Academic' },
    { value: 'Creative', label: 'Creative' },
    { value: 'Persuasive', label: 'Persuasive' },
    { value: 'Technical', label: 'Technical' }
  ];

  const wordCounts = [
    { value: '250', label: '250 words' },
    { value: '500', label: '500 words' },
    { value: '750', label: '750 words' },
    { value: '1000', label: '1,000 words' },
    { value: '1500', label: '1,500 words' },
    { value: '2000', label: '2,000 words' },
    { value: '3000', label: '3,000 words' }
  ];

  const getHeaderContent = () => {
    switch (activeTab) {
      case 'Generate Content':
        return {
          title: 'Welcome to the AI Content Writer!',
          description: 'Create high-quality content with AI assistance. Generate blog posts, articles, social media content, and more with customizable tone and length.'
        };
      case 'Analyses Content':
        return {
          title: '',
          description: ''
        };
      case 'Refine Content':
        return {
          title: '',
          description: ''
        };
      default:
        return {
          title: '',
          description: ''
        };
    }
  };

  const getPlaceholderText = () => {
    switch (activeTab) {
      case 'Generate Content':
        return 'Write a post about eco-friendly with your niche..';
      case 'Analyses Content':
        return 'Write a post about eco-friendly with your niche..';
      case 'Refine Content':
        return 'Write a post about eco-friendly with your niche..';
      default:
        return 'Enter your content here...';
    }
  };

  const handleAction = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock generated content
    setGeneratedContent(`This is a sample generated content based on your prompt: "${prompt.substring(0, 50)}..." 

    Generated with ${tone} tone and targeting ${wordCount} words. This would be replaced with actual AI-generated content in a real implementation.`);

    setIsGenerating(false);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAction();
    }
  };

  const getButtonText = () => {
    switch (activeTab) {
      case 'Generate Content':
        return 'Generate with AI';
      case 'Analyses Content':
        return 'Analyze Content';
      case 'Generate with AI':
        return 'Refine with AI';
      default:
        return 'Process Content';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="w-full px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00FFFF] via-[#00E6E6] to-[#00CCCC] bg-clip-text text-transparent mb-4">
              {headerContent.title}
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {headerContent.description}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#00FFFF] to-[#00E6E6] text-black shadow-lg shadow-cyan-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-white/10 border border-white/20'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-2xl bg-[#1a1f2e]/80 backdrop-blur-sm border transition-all duration-300 ${isFocus ? 'border-[#00FFFF] shadow-[0_0_30px_rgba(0,255,255,0.3)]' : 'border-white/10'
            }`}>

            {/* Input Section */}
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  {activeTab === 'Generate Content' ? 'Content Brief' : 'Input Content'}
                </label>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    placeholder={getPlaceholderText()}
                    className={`w-full h-40 p-4 text-white bg-[#0f1419] rounded-xl border transition-all duration-300 resize-none focus:outline-none placeholder-gray-500 ${isFocus ? 'border-[#00FFFF] shadow-[0_0_15px_rgba(0,255,255,0.2)]' : 'border-white/20'
                      }`}
                    style={{ fontSize: '16px' }} // Prevents zoom on iOS
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                    {prompt.length} characters
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              {activeTab === 'Generate Content' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Tone Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Tone & Style
                    </label>
                    <div className="relative">
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full bg-[#0f1419] border border-white/20 rounded-xl p-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] transition-all duration-300 cursor-pointer"
                      >
                        {tones.map((t) => (
                          <option key={t.value} value={t.value} className="bg-[#1a1f2e]">
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Word Count */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Target Length
                    </label>
                    <div className="relative">
                      <select
                        value={wordCount}
                        onChange={(e) => setWordCount(e.target.value)}
                        className="w-full bg-[#0f1419] border border-white/20 rounded-xl p-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] transition-all duration-300 cursor-pointer"
                      >
                        {wordCounts.map((count) => (
                          <option key={count.value} value={count.value} className="bg-[#1a1f2e]">
                            {count.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">

                  </span>
                </div>

                <div className="flex gap-3">
                  {(activeTab === 'Analyses Content' || activeTab === 'Refine Content') && (
                    <button
                      onClick={() => setPrompt('')}
                      className="flex items-center gap-2 px-4 py-3 bg-[#2a2f3e] color-[#00FFFF] rounded-xl font-medium hover:bg-[#343a4a] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    >
                      <PlusIcon />
                    </button>
                  )}

                  <button
                    onClick={handleAction}
                    disabled={!prompt.trim() || isGenerating}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${!prompt.trim() || isGenerating
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#00FF7F] to-[#00E070] text-black hover:from-[#00E070] hover:to-[#00D060] hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,127,0.4)]'
                      }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        {getButtonText()}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Content Section */}
            {/* {generatedContent && (
              <div className="border-t border-white/10 p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Generated Content</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-3 py-2 bg-[#2a2f3e] text-white rounded-lg text-sm hover:bg-[#343a4a] transition-all duration-300"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-[#2a2f3e] text-white rounded-lg text-sm hover:bg-[#343a4a] transition-all duration-300">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
                <div className="bg-[#0f1419] rounded-xl p-4 text-gray-300 leading-relaxed">
                  {generatedContent}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIContentWriter;


// backup
// 'use client';
// import React, { useState } from 'react';
// import { ChevronDown } from 'lucide-react';

// const AIContentWriter = () => {
//   const [activeTab, setActiveTab] = useState('Generate Content');
//   const [prompt, setPrompt] = useState('');
//   const [tone, setTone] = useState('Formal');
//   const [wordCount, setWordCount] = useState('500');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isFocus, setIsFocus] = useState(false);

//   const tabs = ['Generate Content', 'Analyses Content', 'Refine Content'];
//   const tones = ['Formal', 'Casual', 'Professional', 'Friendly', 'Academic', 'Creative'];
//   const wordCounts = ['250', '500', '750', '1000', '1500', '2000'];

//   const getHeaderContent = () => {
//     switch (activeTab) {
//       case 'Generate Content':
//         return {
//           title: 'Welcome to the AI Content Writer!',
//           description: 'Streamline your content creation, review, and optimization process. Use AI to generate new content, analyze existing pieces, and refine them for specific niches.'
//         };
//       default:
//         return {
//           title: '',
//           description: ''
//         };
//     }
//   };

//   const handleAction = async () => {
//     if (!prompt.trim()) return;

//     setIsGenerating(true);
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     setIsGenerating(false);

//     console.log(`${activeTab} with:`, { prompt, tone, wordCount });
//   };

//   const handleKeyPress = (e: any) => {
//     if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
//       handleAction();
//     }
//   };

//   const getButtonText = () => {
//     switch (activeTab) {
//       case 'Generate Content':
//         return 'Generate with AI';
//       case 'Analyses Content':
//         return 'Analyses with AI';
//       case 'Refine Content':
//         return 'Refine with AI';
//       default:
//         return 'Analyses with AI';
//     }
//   };

//   const headerContent = getHeaderContent();

//   return (
//     <div className="flex flex-col overflow-hidden bg-[#0f1419]">
//       {/* Header Section */}
//       <div className="w-full p-6">
//         <div className="mb-8">
//           <h1 className="text-[32px] font-medium text-[#00FFFF] mb-4">
//             {headerContent.title}
//           </h1>
//           <p className="text-white text-lg font-normal leading-relaxed">
//             {headerContent.description}
//           </p>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="flex mb-8 px-16">

//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex-1 px-6 py-3 text-center font-medium transition-colors border-b-2 ${activeTab === tab
//                 ? 'text-white border-[#00FFFF] bg-[#0f1419]'
//                 : 'text-gray-400 border-transparent hover:text-white hover:bg-[#1a1f2e]'
//                 }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 overflow-y-auto p-4 md:px-44 mt-0 md:mt-46 ">
//         <div className={`rounded-lg bg-[#1a1f2e] border-[1px] transition-all duration-300 ${isFocus ? 'border-[#00FFFF] shadow-[0_0_30px_rgba(0,255,255,0.5)]' : 'border-white/8'}`}>
//           {/* Content based on active tab */}
//           {activeTab === 'Generate Content' && (
//             <div className="p-6">
//               <textarea
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 onFocus={() => setIsFocus(true)}
//                 onBlur={() => setIsFocus(false)}
//                 placeholder="Write a post about eco-friendly with your niche.."
//                 className="w-full h-32 p-4 mb-6 text-white bg-transparent placeholder-gray-400 resize-none focus:outline-none transition-all duration-300"
//               />

//               <div className="flex flex-col sm:flex-row  gap-4 border-[2px] border-white/8 rounded-lg p-4  h-12 sm:h-auto">
//                 {/* Tone & Style Dropdown */}
//                 <div className="flex-1 ">
//                   <label className="block text-sm text-gray-300 mb-2">
//                     Tone & Style
//                   </label>
//                   <div className="relative">
//                     <select
//                       value={tone}
//                       onChange={(e) => setTone(e.target.value)}
//                       className="w-full bg-[#1a1f2e] border border-gray-600 rounded-lg p-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300 cursor-pointer"
//                     >
//                       {tones.map((t) => (
//                         <option key={t} value={t}>{t}</option>
//                       ))}
//                     </select>
//                     <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
//                   </div>
//                 </div>

//                 {/* Word Count Dropdown */}
//                 <div className="flex-1">
//                   <label className="block text-sm text-gray-300 mb-2">
//                     Word Count Target
//                   </label>
//                   <div className="relative">
//                     <select
//                       value={wordCount}
//                       onChange={(e) => setWordCount(e.target.value)}
//                       className="w-full bg-[#1a1f2e] border border-gray-600 rounded-lg p-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300 cursor-pointer"
//                     >
//                       {wordCounts.map((count) => (
//                         <option key={count} value={count}>{count} words</option>
//                       ))}
//                     </select>
//                     <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
//                   </div>
//                 </div>
//                 <div className="flex items-end">
//                   <button
//                     onClick={handleAction}
//                     disabled={!prompt.trim() || isGenerating}
//                     className={`px-6 py-4 rounded-lg font-medium transition-all duration-300 ${!prompt.trim() || isGenerating
//                       ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//                       : 'bg-gradient-to-r from-[#00FF7F] to-[#00C260] text-black hover:from-[#00E070] hover:to-[#00B055] hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,127,0.4)]'
//                       }`}
//                   >
//                     {isGenerating ? (
//                       <div className="flex items-center space-x-2">
//                         <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
//                         <span>Processing...</span>
//                       </div>
//                     ) : (
//                       getButtonText()
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {(activeTab === 'Analyses Content' || activeTab === 'Refine Content') && (
//             <>
//               <div className="p-6">
//                 <textarea
//                   onFocus={() => setIsGenerating(true)}
//                   onBlur={() => setIsGenerating(false)}
//                   placeholder="Write a post about eco-friendly with your niche.."
//                   className="w-full h-32 p-4 mb-6 text-white bg-transparent placeholder-gray-400 resize-none focus:outline-none transition-all duration-300"
//                 />
//               </div>
//               {/* Action Buttons */}
//               <div className="p-6">
//                 <div className="flex justify-end gap-4">
//                   <button className="px-6 py-2 bg-[#2a2f3e] text-white rounded-lg font-medium hover:bg-[#343a4a] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M11.9976 5.24658V18.7456" stroke="#00FFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                       <path d="M18.747 11.9958H5.24805" stroke="#00FFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                   </button>
//                   <button
//                     onClick={handleAction}
//                     disabled={!prompt.trim() || isGenerating}
//                     className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${!prompt.trim() || isGenerating
//                       ? 'bg-[#00FF7F] text-black cursor-not-allowed'
//                       : 'bg-[#00FF7F] from-[#00FF7F] to-[#00C260] text-black hover:from-[#00E070] hover:to-[#00B055] hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,127,0.4)]'
//                       }`}
//                   >
//                     {isGenerating ? (
//                       <div className="flex items-center space-x-2">
//                         <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
//                         <span>Processing...</span>
//                       </div>
//                     ) : (
//                       getButtonText()
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIContentWriter;
