"use client"

import type React from "react"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts"
import IssueModal from "@/components/IssueModal"
import { MetricCard } from "@/types"
import DashboardMetrics from "@/components/DashboardMetrics"
import { Download } from "lucide-react"
import DownloadIcon from "@/components/icons/Download"

const MainContent: React.FC = () => {
  const [url, setUrl] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<{
    type: 'image' | 'content' | 'keyword';
    data: any;
  } | null>(null);


  const chartData = [
    { month: "JAN", health: 75, issues: 5 },
    { month: "FEB", health: 78, issues: 48 },
    { month: "MAR", health: 82, issues: 45 },
    { month: "APR", health: 20, issues: 42 },
    { month: "MAY", health: 88, issues: 40 },
    { month: "JUN", health: 90, issues: 38 },
    { month: "JUL", health: 60, issues: 35 },
    { month: "AUG", health: 95, issues: 32 },
    { month: "SEP", health: 50, issues: 30 },
    { month: "OCT", health: 100, issues: 28 },
  ]

  const handleAnalyze = () => {
    if (url.trim()) {
      console.log("Analyzing:", url)
      // analysis logic here
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze()
    }
  }

  const chartData2 = [
    { name: 'A', value: 80, color: '#00ff00' },
    { name: 'B', value: 45, color: '#ff0000' },
  ];

  const errorData = {
    imageIssues: [
      {
        url: "www.google.com/yourimagelocationurl",
        issues: [
          { type: "Broken Link", severity: "high", typeCategory: "image" },
          { type: "Solution", severity: "solution", typeCategory: "image" }
        ]
      },
      {
        url: "www.google.com/yourimagelocationurl",
        issues: [
          { type: "Low Reputation", severity: "medium", typeCategory: "image" },
          { type: "Solution", severity: "solution", typeCategory: "image" }
        ]
      },
      {
        url: "www.google.com/yourimagelocationurl",
        issues: [
          { type: "Size Issue", severity: "medium", typeCategory: "image" },
          { type: "Solution", severity: "solution", typeCategory: "image" }
        ]
      }
    ],
    contentIssues: [
      {
        url: "www.google.com/yourimagelocationurl",
        issues: [
          { type: "Heading", severity: "high", typeCategory: "content" },
          { type: "Low Reputation", severity: "medium" },
          { type: "Solution", severity: "solution", typeCategory: "content" }
        ]
      },
      {
        url: "www.google.com/yourimagelocationurl",
        issues: [
          { type: "Image are Blurry", severity: "high", typeCategory: "content" },
          { type: "Solution", severity: "solution", typeCategory: "content" }
        ]
      },
      {
        url: "www.google.com/yourimagelocationurl",
        issues: [
          { type: "Image are Blurry", severity: "high", typeCategory: "content" },
          { type: "Low Reputation", severity: "medium", typeCategory: "content" },
          { type: "Solution", severity: "solution", typeCategory: "content" }
        ]
      }
    ],
    keywordIssues: [
      {
        url: "www.google.com/yourimagelocationurl",
        issues: [
          { type: "Low Keyword", severity: "high", typeCategory: "keyword" },
          { type: "Basic", severity: "info", typeCategory: "keyword" },
          { type: "Solution", severity: "solution", typeCategory: "keyword" }
        ]
      },
      {
        url: "www.google.com/yourimagelocationurl",
        issues: [
          { type: "Image are Blurry", severity: "high", typeCategory: "keyword" },
          { type: "Solution", severity: "solution", typeCategory: "keyword" }
        ]
      },
      {
        url: "www.google.com/yourimagelocationurl",
        issues: [
          { type: "Image are Blurry", severity: "high", typeCategory: "keyword" },
          { type: "Solution", severity: "solution", typeCategory: "keyword" }
        ]
      }
    ]
  }

  // Metric Cards
  const metricData: MetricCard[] = [
    {
      title: 'Authority Score',
      value: 25,
      change: '-20%',
    },
    {
      title: 'Organic Traffic',
      value: 857,
      change: '+2.5%',
    },
    {
      title: 'Organic Keywords',
      value: 412,
      change: '-8%',
    },
    {
      title: 'Paid Keywords',
      value: 75,
      change: '+8.5%',
    },
    {
      title: 'Backlinks',
      value: 351,
      change: '-8.5%',
    }
  ]

  const renderIssueGroup = (title: string, issues: any[]) => (
    <div className="mb-8">
      <h3 className="mb-8 text-lg font-medium text-white">{title}</h3>
      <div className="space-y-4">
        {issues.map((item, index) => (
          <div key={index} className="w-full pb-4 border-b border-gray-600 md:flex md:justify-between">
            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center space-x-2">
                <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11.5" r="10" stroke="#C8081B" strokeWidth="1.5" />
                  <path d="M10.992 14.5H11.001" stroke="#C8081B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11 11.5L11 7.5" stroke="#C8081B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <span className="text-base text-white underline cursor-pointer hover:text-blue-300">
                  {item.url}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap justify-end w-full gap-6">
              {item.issues.map((issue: any, issueIndex: number) => (
                <button
                  key={issueIndex}
                  onClick={() => handleOpenModal(issue.typeCategory)}
                  className={`px-3 py-1 rounded-xl text-normal font-normal ${issue.severity === "solution" ? "bg-green-300/10 text-[#00FF7F] border border-[#00FF7F] px-6" : issue.severity === "high" ? "bg-[#DC091E] text-white" : "bg-yellow-500 text-white"} }`
                  }
                >
                  {issue?.solution === 'high' ? <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.40016 1.5C3.96705 1.50438 2.69295 1.56411 1.87871 2.37836C1 3.25706 1 4.67132 1 7.49983C1 10.3283 0.999999 11.7426 1.8787 12.6213C2.75741 13.5 4.17166 13.5 7.00017 13.5C9.82868 13.5 11.2429 13.5 12.1216 12.6213C12.9359 11.8071 12.9956 10.533 13 8.09984" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M13.135 2.27696C13.38 2.03381 13.3815 1.63809 13.1384 1.39308C12.8952 1.14807 12.4995 1.14656 12.2545 1.38971L13.135 2.27696ZM8.55975 5.05637C8.31474 5.29952 8.31323 5.69524 8.55637 5.94025C8.79952 6.18526 9.19524 6.18677 9.44025 5.94363L8.55975 5.05637ZM12.3523 1.65138L12.2433 2.2668L12.2433 2.2668L12.3523 1.65138ZM9.66661 0.875C9.32143 0.87503 9.04164 1.15488 9.04167 1.50005C9.0417 1.84523 9.32154 2.12503 9.66672 2.125L9.66661 0.875ZM12.375 4.83333C12.375 5.17851 12.6548 5.45833 13 5.45833C13.3452 5.45833 13.625 5.17851 13.625 4.83333H12.375ZM12.8486 2.14783L13.4641 2.03895L13.4641 2.03895L12.8486 2.14783ZM12.6948 1.83333L12.2545 1.38971L8.55975 5.05637L9 5.5L9.44025 5.94363L13.135 2.27696L12.6948 1.83333ZM12.3523 1.65138L12.4613 1.03595C11.9842 0.951455 11.2714 0.913025 10.7095 0.894212C10.4219 0.88458 10.1619 0.879785 9.97393 0.877393C9.87982 0.876196 9.80351 0.875598 9.7505 0.875299C9.72398 0.87515 9.70328 0.875075 9.68907 0.875037C9.68197 0.875019 9.67649 0.875009 9.67272 0.875005C9.67083 0.875002 9.66937 0.875001 9.66835 0.875001C9.66784 0.875 9.66744 0.875 9.66715 0.875C9.667 0.875 9.66689 0.875 9.6668 0.875C9.66675 0.875 9.66671 0.875 9.66668 0.875C9.66664 0.875 9.66661 0.875 9.66667 1.5C9.66672 2.125 9.6667 2.125 9.66669 2.125C9.6667 2.125 9.66669 2.125 9.6667 2.125C9.66673 2.125 9.66677 2.125 9.66685 2.125C9.66701 2.125 9.66727 2.125 9.66764 2.125C9.66839 2.125 9.66957 2.125 9.67117 2.125C9.67437 2.12501 9.67927 2.12502 9.68578 2.12503C9.6988 2.12507 9.71825 2.12514 9.74345 2.12528C9.79385 2.12556 9.86719 2.12614 9.95802 2.12729C10.1399 2.12961 10.3909 2.13424 10.6677 2.14351C11.2348 2.1625 11.8648 2.19976 12.2433 2.2668L12.3523 1.65138ZM13 4.83333C13.625 4.83333 13.625 4.8333 13.625 4.83326C13.625 4.83324 13.625 4.83319 13.625 4.83315C13.625 4.83306 13.625 4.83294 13.625 4.8328C13.625 4.83251 13.625 4.83211 13.625 4.8316C13.625 4.83057 13.625 4.82912 13.625 4.82723C13.625 4.82346 13.625 4.81798 13.625 4.81088C13.6249 4.79667 13.6248 4.77597 13.6247 4.74946C13.6244 4.69645 13.6238 4.62015 13.6226 4.52605C13.6202 4.33805 13.6154 4.0781 13.6057 3.7905C13.5869 3.22872 13.5485 2.51597 13.4641 2.03895L12.8486 2.14783L12.2332 2.25671C12.3002 2.6353 12.3374 3.26531 12.3564 3.83238C12.3657 4.1092 12.3704 4.3602 12.3727 4.54204C12.3738 4.63287 12.3744 4.7062 12.3747 4.75661C12.3749 4.7818 12.3749 4.80125 12.375 4.81427C12.375 4.82078 12.375 4.82568 12.375 4.82889C12.375 4.83049 12.375 4.83167 12.375 4.83241C12.375 4.83279 12.375 4.83305 12.375 4.8332C12.375 4.83328 12.375 4.83333 12.375 4.83335C12.375 4.83336 12.375 4.83336 12.375 4.83336C12.375 4.83335 12.375 4.83333 13 4.83333ZM12.3523 1.65138L12.2433 2.2668C12.2489 2.26779 12.2499 2.26875 12.2479 2.26771C12.2459 2.26666 12.2425 2.26448 12.239 2.26095C12.2355 2.25742 12.2333 2.25407 12.2322 2.25205C12.2312 2.25004 12.2322 2.25111 12.2332 2.25671L12.8486 2.14783L13.4641 2.03895C13.3722 1.5197 12.9807 1.12794 12.4613 1.03595L12.3523 1.65138Z" fill="white" />
                  </svg>
                    : ''} {issue.type}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderErrorContent = () => (
    <div className="p-4 md:p-6">
      <div className="p-8 mb-6 rounded-lg bg-white/5">
        {renderIssueGroup("Image Issues", errorData.imageIssues)}
      </div>
      <div className="p-8 mb-6 rounded-lg bg-white/5">
        {renderIssueGroup("Content Issues", errorData.contentIssues)}
      </div>
      <div className="p-8 mb-6 rounded-lg bg-white/5">
        {renderIssueGroup("Keyword Issues", errorData.keywordIssues)}
      </div>


    </div>
  )

  // function for error section modal handling
  const handleOpenModal = (issueType: 'image' | 'content' | 'keyword') => {
    setCurrentIssue({ type: issueType, data: errorData });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentIssue(null);
  };


  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-full">
          {/* Main Heading */}
          <h2 className="text-2xl md:text-3xl lg:text-[32px] font-medium text-[#00FFFF] mb-4">
            Optimize Your Website for Maximum Reach
          </h2>

          {/* Description */}
          <p className="text-[#FFFFFF] text-base md:text-lg font-normal mb-6 md:mb-8 leading-relaxed">
            Unlock your website's full potential with SEO Insights. Identify issues, get actionable recommendations, and
            improve visibility across search engines to attract more visitors and grow your online presence.
          </p>

          {/* URL Input Section */}
          <div className="flex items-center w-full mb-8 md:mb-12">
            <div className="relative flex-1">
              {/* Link icon (left side) */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11.1002 3.5C7.45057 3.50657 5.53942 3.59617 4.31806 4.81754C3 6.13559 3 8.25698 3 12.4997C3 16.7425 3 18.8639 4.31806 20.1819C5.63611 21.5 7.7575 21.5 12.0003 21.5C16.243 21.5 18.3644 21.5 19.6825 20.1819C20.9038 18.9606 20.9934 17.0494 21 13.3998"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.0705 4.53235C21.3645 4.24058 21.3663 3.76571 21.0745 3.4717C20.7827 3.17769 20.3079 3.17588 20.0139 3.46765L21.0705 4.53235ZM14.4717 8.96765C14.1777 9.25942 14.1759 9.73429 14.4676 10.0283C14.7594 10.3223 15.2343 10.3241 15.5283 10.0324L14.4717 8.96765ZM20.0285 3.72706L19.8977 4.46557L20.0285 3.72706ZM15.9999 2.75C15.5857 2.75004 15.25 3.08585 15.25 3.50007C15.25 3.91428 15.5859 4.25004 16.0001 4.25L15.9999 2.75ZM20.25 8.5C20.25 8.91421 20.5858 9.25 21 9.25C21.4142 9.25 21.75 8.91421 21.75 8.5H20.25ZM20.7729 4.47175L21.5115 4.34109V4.34109L20.7729 4.47175ZM20.5422 4L20.0139 3.46765L14.4717 8.96765L15 9.5L15.5283 10.0324L21.0705 4.53235L20.5422 4Z"
                    fill="white"
                  />
                </svg>
              </div>

              {/* Input field */}
              <input
                type="url"
                placeholder="Paste website URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full h-[60px] md:h-[50px] bg-transparent border border-gray-600 rounded-lg py-3 pl-12 pr-4 md:pr-48 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Analyze button (right side) */}
              <button
                onClick={handleAnalyze}
                className="absolute inset-y-0 right-0 hidden md:flex items-center justify-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 m-2  w-[130px] h-[35px] text-black font-normal cursor-pointer"
                style={{ background: "linear-gradient(to right, #00FF7F, #00C260)" }}
              >
                <span className="text-[20px]">Analyze</span>
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14.1666 14.6667L16.875 17.375"
                    stroke="#0D1117"
                    strokeWidth="2.16667"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.8027 19.5689C16.1769 18.9431 16.1769 17.9285 16.8027 17.3027C17.4285 16.6769 18.4432 16.6769 19.069 17.3027L22.364 20.5977C22.9898 21.2235 22.9898 22.2382 22.364 22.864C21.7382 23.4898 20.7236 23.4898 20.0978 22.864L16.8027 19.5689Z"
                    stroke="#0D1117"
                    strokeWidth="2.16667"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16.3333 9.25001C16.3333 5.06185 12.9381 1.66667 8.74996 1.66667C4.5618 1.66667 1.16663 5.06185 1.16663 9.25001C1.16663 13.4382 4.5618 16.8333 8.74996 16.8333C12.9381 16.8333 16.3333 13.4382 16.3333 9.25001Z"
                    stroke="#0D1117"
                    strokeWidth="2.16667"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Analyze Button */}
          <div className="mb-8 md:hidden">
            <button
              onClick={handleAnalyze}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 h-[55px] text-black font-normal"
              style={{ background: "linear-gradient(to right, #00FF7F, #00C260)" }}
            >
              <span className="text-[20px]">Analyze</span>
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14.1666 14.6667L16.875 17.375"
                  stroke="#0D1117"
                  strokeWidth="2.16667"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.8027 19.5689C16.1769 18.9431 16.1769 17.9285 16.8027 17.3027C17.4285 16.6769 18.4432 16.6769 19.069 17.3027L22.364 20.5977C22.9898 21.2235 22.9898 22.2382 22.364 22.864C21.7382 23.4898 20.7236 23.4898 20.0978 22.864L16.8027 19.5689Z"
                  stroke="#0D1117"
                  strokeWidth="2.16667"
                  strokeLinecap="round"
                />
                <path
                  d="M16.3333 9.25001C16.3333 5.06185 12.9381 1.66667 8.74996 1.66667C4.5618 1.66667 1.16663 5.06185 1.16663 9.25001C1.16663 13.4382 4.5618 16.8333 8.74996 16.8333C12.9381 16.8333 16.3333 13.4382 16.3333 9.25001Z"
                  stroke="#0D1117"
                  strokeWidth="2.16667"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Analysis Reports Section */}
          <div className="mb-8">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
              <h3 className="text-[#00FFFF] text-xl md:text-2xl font-medium">Analysis Reports</h3>
              <button className="flex items-center justify-center px-4 py-2 space-x-2 transition-colors rounded-lg md:justify-start bg-white/5 hover:text-white">
                <span className="text-lg text-[#00FFFF]">Download</span>
                <DownloadIcon />
              </button>
            </div>

            <p className="mb-6 text-sm text-gray-300 md:text-base">
              Clear, concise reports showing your website's SEO issues, performance metrics, and improvement tips.
            </p>

            {/* Tabs */}
            <div className="flex mb-6 space-x-4 overflow-x-auto border-b border-gray-700 md:space-x-8 md:mb-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 border-b-2 whitespace-nowrap ${activeTab === "overview" ? "border-[#00FFFF] text-[#00FFFF]" : "border-transparent text-gray-400 hover:text-white"}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("error")}
                className={`pb-3 border-b-2 whitespace-nowrap ${activeTab === "error" ? "border-[#00FFFF] text-[#00FFFF]" : "border-transparent text-gray-400 hover:text-white"}`}
              >
                Error (32)
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === "overview" ? (
              <div className="bg-[#161B22] rounded-lg p-4 md:p-6 mb-8">
                {/* Website Analysis Header */}
                <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-6">
                    {/* SEO Score Circle */}
                    <div className="flex flex-col justify-center text-center md:justify-start">
                      <div className="relative w-24 h-24 mx-auto mb-2 md:w-32 md:h-32">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="50" stroke="#374151" strokeWidth="10" fill="none" />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke="#00FF7F"
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray={`${83 * 3.14159} ${100 * 3.14159}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-white md:text-3xl">83</span>
                        </div>
                      </div>
                      <p className="text-white text-medium md:text-lg">SEO Score</p>
                    </div>

                    {/* Website Info */}
                    <div className="text-center md:text-left">
                      <h4 className="mb-2 text-xl font-medium text-white md:text-2xl">google.com</h4>
                      <p className="text-[#00FFFF] text-base md:text-lg mb-2">Analysis Reports</p>
                      <p className="text-sm leading-relaxed text-gray-300 md:text-base">
                        This is a mock meta description generated by AI for google.com
                      </p>
                    </div>
                  </div>

                  {/* Analysis Date */}
                  <div className="text-center lg:text-right">
                    <p className="text-sm text-gray-300 md:text-base">Analysis Date: 2025-06-28</p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <DashboardMetrics metrics={metricData} />


                {/* Bottom Section with Site Health and Chart */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Site Health */}
                  <div className="p-4 rounded-lg bg-white/5 lg:p-6">
                    <h4 className="mb-4 text-lg font-medium text-white">Site Health</h4>
                    <div className="flex flex-col md:flex-row">
                      <div className="mb-4">
                        <PieChart width={350} height={200}>
                          <Pie
                            dataKey="value"
                            startAngle={180}
                            endAngle={0}
                            data={chartData2}
                            cx={175}  // Adjusted center (X-axis)
                            cy={150}  // Adjusted center (Y-axis)
                            innerRadius={50}  // Adjusted inner radius
                            outerRadius={90}  // Adjusted outer radius
                            fill="#8884d8"
                            stroke="none"
                          >
                            {chartData2.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          {/* Custom Label for bottom-center */}
                          <Label
                            value="83"  // Static value, replace with dynamic data if needed
                            position="bottom"  // Position the label at the bottom
                            offset={-50}  // Slight adjustment to move it closer to the bottom
                            style={{
                              fontSize: "32px",
                              fontWeight: "bold",
                              fill: "#00FFFF",
                              textAnchor: "middle",  // Ensure it's centered horizontally
                            }}
                          />
                        </PieChart>
                      </div>
                      <div className="flex flex-row items-center justify-center gap-4 space-y-2 md:flex-col">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 bg-[#00FF7F] rounded-full"></div>
                          <span className="text-sm text-gray-400">Health</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-400">Issues</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="p-4 rounded-lg bg-white/5 lg:p-6 lg:col-span-2">
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9CA3AF", fontSize: 12 }}
                          />
                          <YAxis
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9CA3AF", fontSize: 12 }}
                          />
                          <Line type="monotone" dataKey="health" stroke="#00FF7F" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="issues" stroke="#EF4444" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center mt-4 space-x-6">
                      <div className="flex items-center space-x-2">
                      </div>
                      <div className="flex items-center space-x-2">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              renderErrorContent()
            )}
          </div>
        </div>
      </div>
      {currentIssue && (
        <IssueModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          issueType={currentIssue.type}
          issueData={currentIssue.data}
        />
      )}
    </div>
  )
}

export default MainContent;