"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import axios from "axios"
import Cookies from 'js-cookie'

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

interface ApiKeywordData {
  keyword: string
  intent: string
  value: number
  trend: string
  kdPercentage: number
  result: number
  lastUpdate: string
}

interface ApiResponse {
  status: string
  message: string
  data: {
    url: string
    totalKeywords: number
    keywords: ApiKeywordData[]
    page: number
    limit: number
    totalPages: number
  }
}

const KeywordAnalysisPage: React.FC = () => {
  const [url, setUrl] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [keywordData, setKeywordData] = useState<KeywordData[]>([])
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const handleSearch = async (page: number = 1, requestedLimit?: number) => {
    if (!url.trim()) return

    setIsLoading(true)
    try {
      const limit = requestedLimit || itemsPerPage
      const api = `${process.env.NEXT_PUBLIC_API_URL_DEV}/analyze/keywords`
      const response = await axios.get<ApiResponse>(
        `${api}?url=${encodeURIComponent(url)}&page=${page}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('auth_token')}`
          }
        }
      )

      // Always use the API's returned limit to stay in sync
      const apiLimit = response.data.data.limit
      if (apiLimit !== limit) {
        console.warn(`API override: Requested ${limit} items, got ${apiLimit}`)
        setItemsPerPage(apiLimit)
      }

      setApiData(response.data)
      setCurrentPage(response.data.data.page)

      const transformedData = response.data.data.keywords.map((keyword, index) => ({
        id: index + 1,
        keyword: keyword.keyword,
        intent: keyword.intent as KeywordData['intent'],
        value: keyword.value,
        trend: mapTrend(keyword.trend),
        kd: keyword.kdPercentage,
        result: keyword.result.toString(),
        lastUpdate: formatLastUpdate(keyword.lastUpdate)
      }))

      setKeywordData(transformedData)
      setSearchPerformed(true)
    } catch (error) {
      console.error("Error fetching keyword data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const mapTrend = (trend: string): 'up' | 'down' | 'stable' => {
    switch (trend.toLowerCase()) {
      case 'upward': return 'up'
      case 'downward': return 'down'
      default: return 'stable'
    }
  }

  const formatLastUpdate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return `Last ${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''}`
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > (apiData?.data.totalPages || 1)) return
    handleSearch(newPage)
  }

  const handleItemsPerPageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value)
    setItemsPerPage(newLimit)
    setCurrentPage(1)
    await handleSearch(1, newLimit)
  }

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'navigational': return 'bg-blue-500'
      case 'informational': return 'bg-yellow-500'
      case 'commercial': return 'bg-green-500'
      case 'transactional': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getIntentText = (intent: string) => {
    switch (intent) {
      case 'navigational': return 'N'
      case 'informational': return 'I'
      case 'commercial': return 'C'
      case 'transactional': return 'T'
      default: return 'Unknown'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />
      default: return <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
    }
  }

  const renderPagination = () => {
    if (!apiData || apiData.data.totalPages <= 1) return null

    const actualLimit = apiData.data.limit
    const totalPages = apiData.data.totalPages
    const startItem = ((currentPage - 1) * actualLimit) + 1
    const endItem = Math.min(currentPage * actualLimit, apiData.data.totalKeywords)

    return (
      <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Showing {startItem}-{endItem} of {apiData.data.totalKeywords} keywords
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-400 whitespace-nowrap">
              Show:
            </label>
            <select
              id="itemsPerPage"
              value={apiData.data.limit}
              onChange={handleItemsPerPageChange}
              className="bg-[#161B22] border border-gray-700 text-white text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#00FFFF]"
              disabled={isLoading}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || isLoading}
            className="p-2 rounded-md border border-gray-700 bg-[#161B22] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#21262D] transition-colors"
            aria-label="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="p-2 rounded-md border border-gray-700 bg-[#161B22] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#21262D] transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex space-x-1">
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-3 py-1 rounded-md border border-gray-700 bg-[#161B22] hover:bg-[#21262D] transition-colors hidden sm:block"
                  disabled={isLoading}
                >
                  1
                </button>
                <span className="px-2 hidden sm:flex items-center">...</span>
              </>
            )}

            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(currentPage - 1, totalPages - 2)) + i
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md border ${page === currentPage ? 'border-[#00FFFF] bg-[#00FFFF]/10' : 'border-gray-700 bg-[#161B22] hover:bg-[#21262D]'} transition-colors`}
                  disabled={isLoading}
                >
                  {page}
                </button>
              )
            })}

            {currentPage < totalPages - 2 && (
              <>
                <span className="px-2 hidden sm:flex items-center">...</span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-1 rounded-md border border-gray-700 bg-[#161B22] hover:bg-[#21262D] transition-colors hidden sm:block"
                  disabled={isLoading}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="p-2 rounded-md border border-gray-700 bg-[#161B22] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#21262D] transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || isLoading}
            className="p-2 rounded-md border border-gray-700 bg-[#161B22] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#21262D] transition-colors"
            aria-label="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-full">
          <h2 className="text-2xl md:text-3xl lg:text-[32px] font-medium text-[#00FFFF] mb-4">
            Search Keyword
          </h2>

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
                onClick={() => handleSearch(1)}
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

          <div className="md:hidden mb-8">
            <button
              onClick={() => handleSearch(1)}
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

          {searchPerformed && apiData && (
            <div className="mb-8">
              <div className="bg-[#161B22] border border-gray-700 rounded-lg p-6 mb-6 shadow-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[#21262D]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 14.5L4 19V5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V19L14.5 14.5M9.5 14.5L12 12M9.5 14.5L12 17" stroke="#00FFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-300">Total Keywords Found</h3>
                      <p className="text-sm text-gray-400">Analyzed for {apiData.data.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#00FF7F] bg-clip-text text-transparent">
                      {formatNumber(apiData.data.totalKeywords)}
                    </span>
                    <span className="text-gray-400">keywords</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#21262D] border-b border-gray-700">
                      <tr>
                        <th className="text-left py-4 px-4 sm:px-6 text-gray-300 font-medium">Keyword</th>
                        <th className="text-left py-4 px-4 sm:px-6 text-gray-300 font-medium">Intent</th>
                        <th className="text-left py-4 px-4 sm:px-6 text-gray-300 font-medium">Value</th>
                        <th className="text-left py-4 px-4 sm:px-6 text-gray-300 font-medium">Trend</th>
                        <th className="text-left py-4 px-4 sm:px-6 text-gray-300 font-medium">KD%</th>
                        <th className="text-left py-4 px-4 sm:px-6 text-gray-300 font-medium">Result</th>
                        <th className="text-left py-4 px-4 sm:px-6 text-gray-300 font-medium">Last Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywordData.map((keyword) => (
                        <tr key={keyword.id} className="hover:bg-[#21262D] transition-colors">
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center space-x-3">
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="19" height="19" rx="5.5" fill="#009DE8" />
                                <rect x="0.5" y="0.5" width="19" height="19" rx="5.5" stroke="#009DE8" />
                                <path d="M14.7503 6.5L8.33366 12.9167L5.41699 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                              <span className="text-white font-medium">{keyword.keyword}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 sm:px-6">
                            <div className={`w-6 h-6 rounded-full text-center ${getIntentColor(keyword.intent)}`}>{getIntentText(keyword.intent)}</div>
                          </td>
                          <td className="py-4 px-4 sm:px-6">
                            <span className="text-white">{keyword.value.toLocaleString()}</span>
                          </td>
                          <td className="py-4 px-4 sm:px-6">
                            {getTrendIcon(keyword.trend)}
                          </td>
                          <td className="py-4 px-4 sm:px-6">
                            <span className={`font-medium flex items-center gap-1`}>
                              {keyword.kd}
                              <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="5.5" cy="6" r="5.5" fill="#E60000" />
                              </svg>
                            </span>
                          </td>
                          <td className="py-4 px-4 sm:px-6">
                            <span className="text-white">{keyword.result}</span>
                          </td>
                          <td className="py-4 px-4 sm:px-6">
                            <span className="text-white text-sm">{keyword.lastUpdate}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {renderPagination()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KeywordAnalysisPage