"use client"

import type React from "react"
import { useState } from "react"
import { Download } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const MainContent: React.FC = () => {
  const [url, setUrl] = useState("")

  const chartData = [
    { month: "JAN", health: 75, issues: 50 },
    { month: "FEB", health: 78, issues: 48 },
    { month: "MAR", health: 82, issues: 45 },
    { month: "APR", health: 85, issues: 42 },
    { month: "MAY", health: 88, issues: 40 },
    { month: "JUN", health: 90, issues: 38 },
    { month: "JUL", health: 92, issues: 35 },
    { month: "AUG", health: 95, issues: 32 },
    { month: "SEP", health: 98, issues: 30 },
    { month: "OCT", health: 100, issues: 28 },
  ]

  const handleAnalyze = () => {
    if (url.trim()) {
      console.log("Analyzing:", url)
      // Add your analysis logic here
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


  const cx = 150;
  const cy = 200;
  const iR = 50;
  const oR = 100;

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="flex-1 p-8">
        <div className="w-full">
          {/* Main Heading */}
          <h2 className="text-[32px] font-medium text-[#00FFFF] mb-4">Optimize Your Website for Maximum Reach</h2>

          {/* Description */}
          <p className="text-[#FFFFFF] text-[18px] font-normal mb-8 leading-relaxed">
            Unlock your website's full potential with SEO Insights. Identify issues, get actionable recommendations, and
            improve visibility across search engines to attract more visitors and grow your online presence.
          </p>

          {/* URL Input Section */}
          <div className="flex items-center w-full mb-12">
            <div className="relative flex-1">
              {/* Link icon (left side) */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                className="w-full h-[71px] bg-transparent border border-gray-600 rounded-lg py-3 pl-12 pr-48 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Analyze button (right side) */}
              <button
                onClick={handleAnalyze}
                className="absolute inset-y-0 right-0 flex items-center justify-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 m-2 w-[172px] h-[55px] text-black font-normal"
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

          {/* Analysis Reports Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#00FFFF] text-xl font-medium">Analysis Reports</h3>
              <button className="flex items-center space-x-2 bg-[#238636] hover:bg-[#2ea043] px-4 py-2 rounded-lg transition-colors">
                <Download size={16} />
                <span className="text-sm">Download</span>
                <span className="text-xs text-gray-300">File type: PDF, CSV</span>
              </button>
            </div>

            <p className="text-gray-300 mb-6">
              Clear, concise reports showing your website's SEO issues, performance metrics, and improvement tips.
            </p>

            {/* Tabs */}
            <div className="flex space-x-8 mb-8 border-b border-gray-700">
              <button className="pb-3 border-b-2 border-[#00FFFF] text-[#00FFFF]">Overview</button>
              <button className="pb-3 text-gray-400 hover:text-white">Error (32)</button>
            </div>

            <div className="bg-[#161B22] rounded-lg p-6 mb-8">
              {/* Website Analysis Card */}
              <div className="rounded-lg mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#161B22] rounded-lg p-6">
                      <div className="flex items-center justify-center">
                        <div className="relative w-32 h-32">
                          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
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
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">83</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center mt-4 space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-base text-white">SEO Score</span>
                        </div>

                      </div>
                    </div>
                    <div>
                      <h4 className="text-[24px] text-white font-medium">google.com</h4>
                      <p className="text-[#00FFFF] text-lg">Analysis Reports</p>
                      <p className="text-white text-lg">
                        This is a mock meta description generated by AI for google.com
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-base">Analysis Date: 2025-06-28</p>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-5 gap-4 mb-8">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white text-lg mb-2">Authority Score</p>
                  <div className="flex items-center justify-between space-x-2">
                    <span className="text-2xl font-bold text-[#00FFFF]">25</span>
                    <span className="text-red-500 text-sm">-20%</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white text-lg mb-2">Organic Traffic</p>
                  <div className="flex items-center justify-between space-x-2">
                    <span className="text-2xl font-bold text-white">857</span>
                    <span className="text-green-500 text-sm">+2.5%</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white text-lg mb-2">Organic Keywords</p>
                  <div className="flex items-center justify-between space-x-2">
                    <span className="text-2xl font-bold text-white">412</span>
                    <span className="text-red-500 text-sm">-8%</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white text-lg mb-2">Paid Keywords</p>
                  <div className="flex items-center justify-between space-x-2">
                    <span className="text-2xl font-bold text-white">75</span>
                    <span className="text-green-500 text-sm">+8.5%</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white text-lg mb-2">Backlinks</p>
                  <div className="flex items-center justify-between space-x-2">
                    <span className="text-2xl font-bold text-white">351</span>
                    <span className="text-red-500 text-sm">-8.5%</span>
                  </div>
                </div>
              </div>

              {/* Bottom Section with Site Health and Chart */}
              <div className="grid grid-cols-3 gap-8">
                {/* Site Health */}
                <div className="bg-white/5 rounded-lg flex items-center">
                  <div className="">
                    <h4 className="text-white text-lg font-medium p-8">Site Health</h4>
                    <div className="flex items-center justify-center mb-4">
                      <PieChart width={400} height={200}>
                        <Pie
                          dataKey="value"
                          startAngle={180}
                          endAngle={0}
                          data={chartData2}      // ✅ use chartData2 here
                          cx={cx}
                          cy={cy}
                          innerRadius={iR}
                          outerRadius={oR}
                          fill="#8884d8"
                          stroke="none"
                        >
                          {chartData2.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>

                    </div>
                  </div>
                  <div className="">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#00FF7F] rounded-full"></div>
                      <span className="text-sm text-gray-400">Health</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">Issue</span>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-[#161B22] rounded-lg p-6 col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-medium">Performance Trends</span>
                    <span className="text-gray-400 text-sm">100</span>
                  </div>
                  <div className="h-40">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainContent
