'use client';
import React, { useState } from 'react';

const MainContent: React.FC = () => {
  const [url, setUrl] = useState('');

  const handleAnalyze = () => {
    if (url.trim()) {
      console.log('Analyzing:', url);
      // Add your analysis logic here
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="flex-1  p-8">
      <div className="w-full ">
        {/* Main Heading */}
        <h2 className="text-[32px]  font-medium text-[#00FFFF] mb-4">
          Optimize Your Website for Maximum Reach
        </h2>

        {/* Description */}
        <p className="text-[#FFFFFF
] text-[18px] font-normal mb-8 leading-relaxed">
          Unlock your website's full potential with SEO Insights. Identify issues, get actionable recommendations, and improve visibility across search engines to attract more visitors and grow your online presence.
        </p>

        {/* URL Input Section */}
        <div className="flex items-center  w-full ">
          <div className="relative flex-1">
            {/* Link icon (left side) */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.1002 3.5C7.45057 3.50657 5.53942 3.59617 4.31806 4.81754C3 6.13559 3 8.25698 3 12.4997C3 16.7425 3 18.8639 4.31806 20.1819C5.63611 21.5 7.7575 21.5 12.0003 21.5C16.243 21.5 18.3644 21.5 19.6825 20.1819C20.9038 18.9606 20.9934 17.0494 21 13.3998" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M21.0705 4.53235C21.3645 4.24058 21.3663 3.76571 21.0745 3.4717C20.7827 3.17769 20.3079 3.17588 20.0139 3.46765L21.0705 4.53235ZM14.4717 8.96765C14.1777 9.25942 14.1759 9.73429 14.4676 10.0283C14.7594 10.3223 15.2343 10.3241 15.5283 10.0324L14.4717 8.96765ZM20.0285 3.72706L19.8977 4.46557L20.0285 3.72706ZM15.9999 2.75C15.5857 2.75004 15.25 3.08585 15.25 3.50007C15.25 3.91428 15.5859 4.25004 16.0001 4.25L15.9999 2.75ZM20.25 8.5C20.25 8.91421 20.5858 9.25 21 9.25C21.4142 9.25 21.75 8.91421 21.75 8.5H20.25ZM20.7729 4.47175L21.5115 4.34109V4.34109L20.7729 4.47175ZM20.5422 4L20.0139 3.46765L14.4717 8.96765L15 9.5L15.5283 10.0324L21.0705 4.53235L20.5422 4ZM20.0285 3.72706L20.1593 2.98855C19.4584 2.86443 18.4015 2.80696 17.558 2.77871C17.1282 2.76432 16.7396 2.75715 16.4585 2.75357C16.3178 2.75179 16.2038 2.75089 16.1247 2.75045C16.0851 2.75022 16.0542 2.75011 16.0331 2.75006C16.0225 2.75003 16.0144 2.75001 16.0088 2.75001C16.0061 2.75 16.0039 2.75 16.0024 2.75C16.0017 2.75 16.0011 2.75 16.0007 2.75C16.0005 2.75 16.0003 2.75 16.0002 2.75C16.0001 2.75 16.0001 2.75 16 2.75C16 2.75 15.9999 2.75 16 3.5C16.0001 4.25 16 4.25 16 4.25C16 4.25 16 4.25 16.0001 4.25C16.0001 4.25 16.0002 4.25 16.0003 4.25C16.0006 4.25 16.001 4.25 16.0016 4.25C16.0027 4.25 16.0045 4.25 16.007 4.25001C16.0119 4.25001 16.0193 4.25002 16.0292 4.25005C16.0489 4.2501 16.0782 4.25021 16.1162 4.25042C16.1922 4.25085 16.3027 4.25171 16.4394 4.25345C16.7131 4.25694 17.091 4.26391 17.5078 4.27787C18.3577 4.30633 19.3151 4.36239 19.8977 4.46557L20.0285 3.72706ZM21 8.5C21.75 8.5 21.75 8.49996 21.75 8.49991C21.75 8.49988 21.75 8.49981 21.75 8.49975C21.75 8.49963 21.75 8.49946 21.75 8.49926C21.75 8.49884 21.75 8.49826 21.75 8.49752C21.75 8.49603 21.75 8.49388 21.75 8.49109C21.75 8.48552 21.75 8.47739 21.7499 8.46682C21.7499 8.4457 21.7498 8.41483 21.7495 8.37526C21.7491 8.29614 21.7482 8.18213 21.7464 8.04148C21.7428 7.7604 21.7356 7.37182 21.7212 6.94203C21.6929 6.09857 21.6355 5.04186 21.5115 4.34109L20.7729 4.47175L20.0344 4.6024C20.1375 5.18506 20.1936 6.14247 20.222 6.99229C20.236 7.40913 20.243 7.78697 20.2465 8.06066C20.2483 8.19739 20.2491 8.30784 20.2496 8.38384C20.2498 8.42183 20.2499 8.45119 20.2499 8.4709C20.25 8.48075 20.25 8.48819 20.25 8.49308C20.25 8.49553 20.25 8.49734 20.25 8.4985C20.25 8.49908 20.25 8.49949 20.25 8.49974C20.25 8.49987 20.25 8.49995 20.25 8.5C20.25 8.50002 20.25 8.50002 20.25 8.50003C20.25 8.50002 20.25 8.5 21 8.5ZM20.0285 3.72706L19.8977 4.46557C19.9482 4.47451 19.9756 4.49342 19.9911 4.50886C20.0065 4.52432 20.0255 4.55182 20.0344 4.6024L20.7729 4.47175L21.5115 4.34109C21.3874 3.63972 20.8609 3.1128 20.1593 2.98855L20.0285 3.72706Z" fill="white" />
              </svg>
            </div>

            {/* Input field */}
            <input
              type="url"
              placeholder="Paste website URL here..."
              className="w-full h-[71px] bg-transparent border border-gray-600 rounded-lg py-3 pl-10 pr-24 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Analyze button (right side) */}

            <button
              className={`
            flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
            absolute inset-y-0 right-0 px-4 m-1
            w-[172px] h-[55px] text-black mt-2
          `}
              style={{ background: 'linear-gradient(to right, #00FF7F, #00C260)' }}
            >
              <span className="text-[20px]  font-normal">Analyze</span>
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.1666 14.6667L16.875 17.375" stroke="#0D1117" stroke-width="2.16667" stroke-linejoin="round" />
                <path d="M16.8027 19.5689C16.1769 18.9431 16.1769 17.9285 16.8027 17.3027C17.4285 16.6769 18.4432 16.6769 19.069 17.3027L22.364 20.5977C22.9898 21.2235 22.9898 22.2382 22.364 22.864C21.7382 23.4898 20.7236 23.4898 20.0978 22.864L16.8027 19.5689Z" stroke="#0D1117" stroke-width="2.16667" stroke-linecap="round" />
                <path d="M16.3333 9.25001C16.3333 5.06185 12.9381 1.66667 8.74996 1.66667C4.5618 1.66667 1.16663 5.06185 1.16663 9.25001C1.16663 13.4382 4.5618 16.8333 8.74996 16.8333C12.9381 16.8333 16.3333 13.4382 16.3333 9.25001Z" stroke="#0D1117" stroke-width="2.16667" stroke-linejoin="round" />
              </svg>

            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;