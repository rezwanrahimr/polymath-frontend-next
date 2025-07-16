"use client"

import type React from "react"
import { useState } from "react"
import { Search, TrendingUp, TrendingDown } from "lucide-react"

interface KeywordData {
  id: number
  keyword: string
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational'
  value: number
  trend: 'up' | 'down' | 'stable'
  kd: number
  result: string
  lastUpdate: string
}

const KeywordAnalysisPage: React.FC = () => {
  const [url, setUrl] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock keyword data
  const keywordData: KeywordData[] = [
    {
      id: 1,
      keyword: "google",
      intent: "navigational",
      value: 98110,
      trend: "stable",
      kd: 98,
      result: "99M",
      lastUpdate: "Last hour"
    },
    {
      id: 2,
      keyword: "google.com",
      intent: "navigational",
      value: 98110,
      trend: "down",
      kd: 97,
      result: "89M",
      lastUpdate: "Last hour"
    },
    {
      id: 3,
      keyword: "www.google.com",
      intent: "navigational",
      value: 96110,
      trend: "down",
      kd: 93,
      result: "42M",
      lastUpdate: "Last hour"
    },
    {
      id: 4,
      keyword: "google image",
      intent: "informational",
      value: 96110,
      trend: "down",
      kd: 92,
      result: "44M",
      lastUpdate: "Last hour"
    },
    {
      id: 5,
      keyword: "google key",
      intent: "informational",
      value: 96110,
      trend: "down",
      kd: 90,
      result: "33M",
      lastUpdate: "Last hour"
    },
    {
      id: 6,
      keyword: "google keyword",
      intent: "informational",
      value: 96110,
      trend: "down",
      kd: 89,
      result: "22",
      lastUpdate: "Last hour"
    },
    {
      id: 7,
      keyword: "keyword google",
      intent: "informational",
      value: 96110,
      trend: "down",
      kd: 80,
      result: "20",
      lastUpdate: "Last hour"
    }
  ]

  const handleSearch = async () => {
    if (!url.trim()) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSearchPerformed(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'navigational':
        return 'bg-blue-500'
      case 'informational':
        return 'bg-yellow-500'
      case 'commercial':
        return 'bg-green-500'
      case 'transactional':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
    }
  }

  const getKDColor = (kd: number) => {
    if (kd >= 80) return 'text-red-500'
    if (kd >= 60) return 'text-yellow-500'
    return 'text-green-500'
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-full">
          {/* Header */}
          <h2 className="text-2xl md:text-3xl lg:text-[32px] font-medium text-[#00FFFF] mb-4">
            Search Keyword
          </h2>

          {/* Search Input */}
          <div className="flex items-center w-full mb-8 md:mb-12">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.1002 3.5C7.45057 3.50657 5.53942 3.59617 4.31806 4.81754C3 6.13559 3 8.25698 3 12.4997C3 16.7425 3 18.8639 4.31806 20.1819C5.63611 21.5 7.7575 21.5 12.0003 21.5C16.243 21.5 18.3644 21.5 19.6825 20.1819C20.9038 18.9606 20.9934 17.0494 21 13.3998" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M21.0705 4.53235C21.3645 4.24058 21.3663 3.76571 21.0745 3.4717C20.7827 3.17769 20.3079 3.17588 20.0139 3.46765L21.0705 4.53235ZM14.4717 8.96765C14.1777 9.25942 14.1759 9.73429 14.4676 10.0283C14.7594 10.3223 15.2343 10.3241 15.5283 10.0324L14.4717 8.96765ZM20.0285 3.72706L19.8977 4.46557L20.0285 3.72706ZM15.9999 2.75C15.5857 2.75004 15.25 3.08585 15.25 3.50007C15.25 3.91428 15.5859 4.25004 16.0001 4.25L15.9999 2.75ZM20.25 8.5C20.25 8.91421 20.5858 9.25 21 9.25C21.4142 9.25 21.75 8.91421 21.75 8.5H20.25ZM20.7729 4.47175L21.5115 4.34109V4.34109L20.7729 4.47175ZM20.5422 4L20.0139 3.46765L14.4717 8.96765L15 9.5L15.5283 10.0324L21.0705 4.53235L20.5422 4ZM20.0285 3.72706L20.1593 2.98855C19.4584 2.86443 18.4015 2.80696 17.558 2.77871C17.1282 2.76432 16.7396 2.75715 16.4585 2.75357C16.3178 2.75179 16.2038 2.75089 16.1247 2.75045C16.0851 2.75022 16.0542 2.75011 16.0331 2.75006C16.0225 2.75003 16.0144 2.75001 16.0088 2.75001C16.0061 2.75 16.0039 2.75 16.0024 2.75C16.0017 2.75 16.0011 2.75 16.0007 2.75C16.0005 2.75 16.0003 2.75 16.0002 2.75C16.0001 2.75 16.0001 2.75 16 2.75C16 2.75 15.9999 2.75 16 3.5C16.0001 4.25 16 4.25 16 4.25C16 4.25 16 4.25 16.0001 4.25C16.0001 4.25 16.0002 4.25 16.0003 4.25C16.0006 4.25 16.001 4.25 16.0016 4.25C16.0027 4.25 16.0045 4.25 16.007 4.25001C16.0119 4.25001 16.0193 4.25002 16.0292 4.25005C16.0489 4.2501 16.0782 4.25021 16.1162 4.25042C16.1922 4.25085 16.3027 4.25171 16.4394 4.25345C16.7131 4.25694 17.091 4.26391 17.5078 4.27787C18.3577 4.30633 19.3151 4.36239 19.8977 4.46557L20.0285 3.72706ZM21 8.5C21.75 8.5 21.75 8.49996 21.75 8.49991C21.75 8.49988 21.75 8.49981 21.75 8.49975C21.75 8.49963 21.75 8.49946 21.75 8.49926C21.75 8.49884 21.75 8.49826 21.75 8.49752C21.75 8.49603 21.75 8.49388 21.75 8.49109C21.75 8.48552 21.75 8.47739 21.7499 8.46682C21.7499 8.4457 21.7498 8.41483 21.7495 8.37526C21.7491 8.29614 21.7482 8.18213 21.7464 8.04148C21.7428 7.7604 21.7356 7.37182 21.7212 6.94203C21.6929 6.09857 21.6355 5.04186 21.5115 4.34109L20.7729 4.47175L20.0344 4.6024C20.1375 5.18506 20.1936 6.14247 20.222 6.99229C20.236 7.40913 20.243 7.78697 20.2465 8.06066C20.2483 8.19739 20.2491 8.30784 20.2496 8.38384C20.2498 8.42183 20.2499 8.45119 20.2499 8.4709C20.25 8.48075 20.25 8.48819 20.25 8.49308C20.25 8.49553 20.25 8.49734 20.25 8.4985C20.25 8.49908 20.25 8.49949 20.25 8.49974C20.25 8.49987 20.25 8.49995 20.25 8.5C20.25 8.50002 20.25 8.50002 20.25 8.50003C20.25 8.50002 20.25 8.5 21 8.5ZM20.0285 3.72706L19.8977 4.46557C19.9482 4.47451 19.9756 4.49342 19.9911 4.50886C20.0065 4.52432 20.0255 4.55182 20.0344 4.6024L20.7729 4.47175L21.5115 4.34109C21.3874 3.63972 20.8609 3.1128 20.1593 2.98855L20.0285 3.72706Z" fill="white" />
                </svg>
              </div>

              <input
                type="url"
                placeholder="Enter website URL to analyze keywords..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full h-[60px] md:h-[71px] bg-transparent border border-gray-600 rounded-lg py-3 pl-12 pr-4 md:pr-48 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 hidden md:flex items-center justify-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 m-2 mt-3 w-[160px] h-[45px] text-black font-normal disabled:opacity-50"
                style={{ background: "linear-gradient(to right, #00FF7F, #00C260)" }}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                ) : (
                  <>
                    <span className="text-[20px]">Search</span>
                    <svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.167 15.6667L17.8753 18.375" stroke="#0D1117" stroke-width="2.16667" stroke-linejoin="round" />
                      <path d="M17.8024 20.5689C17.1766 19.9431 17.1766 18.9285 17.8024 18.3027C18.4282 17.6769 19.4428 17.6769 20.0686 18.3027L23.3637 21.5977C23.9895 22.2235 23.9895 23.2381 23.3637 23.864C22.7378 24.4898 21.7232 24.4898 21.0974 23.864L17.8024 20.5689Z" stroke="#0D1117" stroke-width="2.16667" stroke-linecap="round" />
                      <path d="M17.3337 10.25C17.3337 6.06183 13.9385 2.66666 9.75033 2.66666C5.56217 2.66666 2.16699 6.06183 2.16699 10.25C2.16699 14.4381 5.56217 17.8333 9.75033 17.8333C13.9385 17.8333 17.3337 14.4381 17.3337 10.25Z" stroke="#0D1117" stroke-width="2.16667" stroke-linejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Button */}
          <div className="md:hidden mb-8">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 h-[55px] text-black font-normal disabled:opacity-50"
              style={{ background: "linear-gradient(to right, #00FF7F, #00C260)" }}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
              ) : (
                <>
                  <span className="text-[20px]">Search</span>
                  <Search className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          {searchPerformed && (
            <div className="mb-8">
              {/* Keyword Table */}
              <div className="rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#21262D] border-b border-gray-700">
                      <tr>
                        <th className="text-left py-4 px-6 text-gray-300 font-medium">Keyword</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-medium">Intent</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-medium">Value</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-medium">Trend</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-medium">KD%</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-medium">Result</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-medium">Last Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywordData.map((keyword) => (
                        <tr key={keyword.id} className="">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="19" height="19" rx="5.5" fill="#009DE8" />
                                <rect x="0.5" y="0.5" width="19" height="19" rx="5.5" stroke="#009DE8" />
                                <path d="M14.7503 6.5L8.33366 12.9167L5.41699 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                              <span className="text-white font-medium">{keyword.keyword}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="24" height="24" rx="12" fill="#E8BB20" />
                              <path d="M12.2884 16.668C11.3364 16.668 10.5104 16.458 9.81042 16.038C9.11976 15.6087 8.58776 15.016 8.21442 14.26C7.84109 13.4947 7.65442 12.608 7.65442 11.6C7.65442 10.592 7.84109 9.71 8.21442 8.954C8.58776 8.18867 9.11976 7.596 9.81042 7.176C10.5104 6.74667 11.3364 6.532 12.2884 6.532C13.4084 6.532 14.3184 6.798 15.0184 7.33C15.7184 7.862 16.1664 8.61333 16.3624 9.584H15.0604C14.9111 8.97733 14.6078 8.492 14.1504 8.128C13.6931 7.75467 13.0724 7.568 12.2884 7.568C11.5884 7.568 10.9818 7.73133 10.4684 8.058C9.95509 8.37533 9.55842 8.83733 9.27842 9.444C8.99842 10.0413 8.85842 10.76 8.85842 11.6C8.85842 12.44 8.99842 13.1633 9.27842 13.77C9.55842 14.3673 9.95509 14.8293 10.4684 15.156C10.9818 15.4733 11.5884 15.632 12.2884 15.632C13.0724 15.632 13.6931 15.4547 14.1504 15.1C14.6078 14.736 14.9111 14.2553 15.0604 13.658H16.3624C16.1664 14.6007 15.7184 15.338 15.0184 15.87C14.3184 16.402 13.4084 16.668 12.2884 16.668Z" fill="white" />
                            </svg>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-white">{keyword.value.toLocaleString()}</span>
                          </td>
                          <td className="py-4 px-6">
                            <svg width="44" height="26" viewBox="0 0 44 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13.0588 8.79743C7.16077 3.88242 3.22875 9.20702 2 12.4837V26H42.5489V3.88243C41.7297 4.29201 39.1084 4.61967 35.1764 2.65366C30.2613 0.196156 29.0326 5.11117 24.1176 10.0262C19.2026 14.9412 20.4313 14.9412 13.0588 8.79743Z" fill="url(#paint0_linear_6183_901)" fill-opacity="0.25" />
                              <path d="M2 12.4837C3.22875 9.20702 7.16077 3.88242 13.0588 8.79743C20.4313 14.9412 19.2026 14.9412 24.1176 10.0262C29.0326 5.11117 30.2613 0.196156 35.1764 2.65366C39.1084 4.61967 41.7297 4.29201 42.5489 3.88243" stroke="#00FFFF" stroke-width="2.45751" />
                              <defs>
                                <linearGradient id="paint0_linear_6183_901" x1="22.2744" y1="2" x2="22.2744" y2="26" gradientUnits="userSpaceOnUse">
                                  <stop offset="0.495192" stop-color="#00FFFF" />
                                  <stop offset="1" stop-color="#009999" stop-opacity="0" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`font-medium ${getKDColor(keyword.kd)} flex items-center gap-1`}>
                              {keyword.kd} 
                              <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="5.5" cy="6" r="5.5" fill="#E60000" />
                              </svg>
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-white">{keyword.result}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-white text-sm">{keyword.lastUpdate}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KeywordAnalysisPage