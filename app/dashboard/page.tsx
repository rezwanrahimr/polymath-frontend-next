"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";
import IssueModal from "@/components/IssueModal";
import { MetricCard } from "@/types";
import DashboardMetrics from "@/components/DashboardMetrics";
import DownloadIcon from "@/components/icons/Download";
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import DashboardLoadingScreen from "@/components/DashboardLoadingScreen";
import jsPDF from "jspdf";

// Cache key for localStorage
const CACHE_KEY = "seoAnalysisCache";

// Enhanced fetcher with caching
const fetcher = async (url: string) => {
  // First check if we have cached data
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(`${CACHE_KEY}:${url}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Cache valid for 1 hour (3600000 ms)
      if (Date.now() - timestamp < 3600000) {
        return data;
      }
    }
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  // Cache the response
  if (typeof window !== "undefined") {
    localStorage.setItem(
      `${CACHE_KEY}:${url}`,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  }

  return data;
};

// POST API call function with caching
const postData = async (url: string) => {
  const cacheKey = `${CACHE_KEY}:post:${url}`;

  // Check cache first
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Cache valid for 30 minutes (1800000 ms)
      if (Date.now() - timestamp < 1800000) {
        return data;
      }
    }
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_DEV}/crawler/start?url=${encodeURIComponent(
      url
    )}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to post data");
  }
  const data = await response.json();

  // Cache the response
  if (typeof window !== "undefined") {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  }

  return data;
};

const MainContent: React.FC = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState('Initializing analysis...');
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<{
    type: "image" | "content" | "keyword";
    data: {
      imageIssues?: any[];
      contentIssues?: any[];
      keywordIssues?: any[];
    };
  } | null>(null);
  const [cachedData, setCachedData] = useState<{
    analysisData?: any;
    errorData?: any;
  }>({});
  const [showingCachedData, setShowingCachedData] = useState(false);
  const previousUrlRef = useRef<string | null>(null);

  // Load cached data on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CACHE_KEY);
      if (saved) {
        try {
          setCachedData(JSON.parse(saved));
        } catch (e) {
          localStorage.removeItem(CACHE_KEY);
        }
      }
    }
  }, []);

  // Reset everything when URL input is cleared
  useEffect(() => {
    if (!url.trim()) {
      setSubmittedUrl(null);
      setCachedData({});
      setShowingCachedData(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem(CACHE_KEY);
      }
    }
  }, [url]);

  // API call using SWR with enhanced caching
  const {
    data: analysisData,
    error,
    isLoading,
  } = useSWR(
    submittedUrl
      ? `${process.env.NEXT_PUBLIC_API_URL_DEV}/analyze/website?url=${encodeURIComponent(
        submittedUrl
      )}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 60000,
      onSuccess: (data) => {
        // Update localStorage cache when new data arrives
        setCachedData((prev) => {
          const newCache = { ...prev, analysisData: data };
          localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
          return newCache;
        });
      },
    }
  );

  const {
    data: errorData,
    error: seoError,
    isLoading: isErrorLoading,
  } = useSWR(
    submittedUrl
      ? `${process.env.NEXT_PUBLIC_API_URL_DEV}/seo-analyzer/analyze?url=${encodeURIComponent(
        submittedUrl
      )}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 60000,
      onSuccess: (data) => {
        // Update localStorage cache when new data arrives
        setCachedData((prev) => {
          const newCache = { ...prev, errorData: data };
          localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
          return newCache;
        });
      },
    }
  );

  // Use cached data if available while loading
  const data = analysisData?.data || cachedData.analysisData?.data;
  const effectiveErrorData = errorData || cachedData.errorData;

  // Update your handleAnalyze function
  const handleAnalyze = async () => {
    if (!url.trim()) return;

    // Reset progress
    setLoadingProgress(0);
    setLoadingStep('Initializing analysis...');

    // Check if this is a different URL than before
    const isNewUrl = url.trim() !== previousUrlRef.current;
    previousUrlRef.current = url.trim();

    if (isNewUrl) {
      // Clear cached data for new URL
      setCachedData({});
      setShowingCachedData(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    setLoading(true);

    try {
      // Simulate progress during POST
      setLoadingStep('Starting crawler...');
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 0.1, 0.3));
      }, 300);

      const result = await postData(url.trim());
      clearInterval(progressInterval);

      if (result.status) {
        setSubmittedUrl(url.trim());
        setActiveTab("overview");

        // Simulate analysis progress
        setLoadingStep('Analyzing website structure...');
        const analysisInterval = setInterval(() => {
          setLoadingProgress(prev => {
            const newProgress = Math.min(prev + 0.05, 0.9);
            if (newProgress >= 0.6) {
              setLoadingStep('Identifying SEO issues...');
            } else if (newProgress >= 0.3) {
              setLoadingStep('Analyzing content...');
            }
            return newProgress;
          });
        }, 300);

        // When analysis completes
        setTimeout(() => {
          clearInterval(analysisInterval);
          setLoadingProgress(1);
          setLoadingStep('Finalizing results...');
        }, 3000);
      }
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze();
    }
  };

  // Implement download functionality
const handleDownloadPDF = () => {
  if (!data) return;

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(`SEO Analysis Report - ${data.url}`, 10, 20);
  
  // Add basic info
  doc.setFontSize(12);
  doc.text(`Analysis Date: ${data.analysisDate}`, 10, 30);
  doc.text(`SEO Score: ${data.seoScore}`, 10, 40);
  doc.text(`Site Health: ${data.siteHealth}`, 10, 50);
  
  // Add more sections as needed...
  
  doc.save(`seo-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

  // Update showingCachedData state when we fall back to cache
  useEffect(() => {
    if ((isLoading || isErrorLoading) && cachedData.analysisData) {
      setShowingCachedData(true);
    } else if (!isLoading && !isErrorLoading) {
      setShowingCachedData(false);
    }
  }, [isLoading, isErrorLoading, cachedData]);

  // Prepare chart data from API response
  const getChartData = () => {
    if (!data) return [];
    return data?.trends?.map(
      (item: { month: string; health: number; issues: number }) => ({
        month: item.month.toUpperCase().slice(0, 3),
        health: item?.health,
        issues: item.issues,
      })
    );
  };

  // Prepare pie chart data from API response
  const getPieChartData = () => {
    if (!data) return [];
    return [
      { name: "Health", value: data.siteHealth, color: "#00ff00" },
      { name: "Issues", value: 100 - data.siteHealth || 0, color: "#ff0000" },
    ];
  };

  const renderIssueGroup = (title: string, issues: any[]) => (
    <div className="mb-8">
      <h3 className="mb-8 text-lg font-medium text-white">{title}</h3>
      <div className="space-y-4 w-full">
        {issues?.map((item, index) => (
          <div
            key={index}
            className="w-full pb-4 border-b border-gray-600 md:flex md:justify-between"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center space-x-2 w-full">
                <svg
                  width="22"
                  height="23"
                  viewBox="0 0 22 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="11"
                    cy="11.5"
                    r="10"
                    stroke="#C8081B"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10.992 14.5H11.001"
                    stroke="#C8081B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 11.5L11 7.5"
                    stroke="#C8081B"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <Link
                  href={item}
                  target="_blank"
                  className="text-base text-white underline cursor-pointer hover:text-blue-300"
                >
                  {item}
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap justify-end w-full gap-6">
              <button
                onClick={() => handleOpenModal("image")}
                className={`px-4 py-2 rounded-xl cursor-pointer text-normal font-normal border border-[#00FF7F] text-[#00FF7F] bg-[#00FF7F]/8`}
              >
                Solution
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const totalIssues =
    (effectiveErrorData?.brokenLinks?.length || 0) +
    (effectiveErrorData?.oversizedImages?.length || 0) +
    (effectiveErrorData?.blurryImages?.length || 0);

  const renderErrorContent = () => {
    if (!effectiveErrorData) return null;

    return (
      <div className="p-4 md:p-6 max-w-full">
        <div className="p-8 mb-6 rounded-lg bg-white/5">
          {effectiveErrorData?.brokenLinks
            ? renderIssueGroup("Broken Links", effectiveErrorData?.brokenLinks)
            : ""}
        </div>
        <div className="p-8 mb-6 rounded-lg bg-white/5">
          {renderIssueGroup(
            "OversizedImages",
            effectiveErrorData?.oversizedImages
          )}
        </div>
        <div className="p-8 mb-6 rounded-lg bg-white/5">
          {renderIssueGroup("Blurry Images", effectiveErrorData?.blurryImages)}
        </div>
      </div>
    );
  };

  const handleOpenModal = (issueType: "image" | "content" | "keyword") => {
    if (!data) return;

    setCurrentIssue({
      type: issueType,
      data: data.issues,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentIssue(null);
  };

  if ((isLoading || isErrorLoading || loading) && !showingCachedData) {
    return (
      <DashboardLoadingScreen
        progress={loadingProgress}
        currentStep={loadingStep}
      />
    );
  }

  // Error state - only show if we don't have cached data
  if (error && !showingCachedData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1117]">
        <div className="p-6 text-center bg-[#161B22] rounded-lg">
          <h3 className="mb-4 text-xl font-medium text-[#DC091E]">
            Analysis Failed
          </h3>
          <p className="text-gray-300">{error.message}</p>
          <button
            onClick={() => setSubmittedUrl(null)}
            className="px-4 py-2 mt-4 text-white bg-[#00FFFF] rounded-lg hover:bg-[#00C260]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Don't show any results if there's no URL submitted and no cached data
  if (!submittedUrl && !cachedData.analysisData) {
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
              Unlock your website's full potential with SEO Insights. Identify
              issues, get actionable recommendations, and improve visibility
              across search engines to attract more visitors and grow your online
              presence.
            </p>

            {/* URL Input Section */}
            <div className="flex items-center w-full mb-8 md:mb-12">
              <div className="relative flex-1">
                {/* Link icon (left side) */}
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                  disabled={!url.trim()}
                  className={`absolute inset-y-0 right-0 hidden md:flex items-center justify-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 m-2 w-[130px] h-[35px] text-black font-normal cursor-pointer ${!url.trim() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  style={{
                    background: "linear-gradient(to right, #00FF7F, #00C260)",
                  }}
                >
                  <span className="text-[20px]">Analyze</span>
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                disabled={!url.trim()}
                className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 h-[55px] text-black font-normal ${!url.trim() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                style={{
                  background: "linear-gradient(to right, #00FF7F, #00C260)",
                }}
              >
                <span className="text-[20px]">Analyze</span>
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.1666 14.6667L16.875 17.375"
                    stroke="#0D1117"
                    strokeWidth="2.16667"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.8027 19.5689C16.1769 18.9431 16.1769 17.9285 16.8027 17.3027C17.4285 16.6769 18.4432 16.6769 19.069 17.3027L22.364 20.5977C22.9898 21.2235 22.9898 22.2382 22.364 22.864C21.7382 23.4898 20.7236 23.4898 20.0978 22.864/L16.8027 19.5689Z"
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
        </div>
      </div>
    );
  }

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
            Unlock your website's full potential with SEO Insights. Identify
            issues, get actionable recommendations, and improve visibility
            across search engines to attract more visitors and grow your online
            presence.
          </p>

          {/* URL Input Section */}
          <div className="flex items-center w-full mb-8 md:mb-12">
            <div className="relative flex-1">
              {/* Link icon (left side) */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
                disabled={!url.trim()}
                className={`absolute inset-y-0 right-0 hidden md:flex items-center justify-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 m-2 w-[130px] h-[35px] text-black font-normal cursor-pointer ${!url.trim() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                style={{
                  background: "linear-gradient(to right, #00FF7F, #00C260)",
                }}
              >
                <span className="text-[20px]">Analyze</span>
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.1666 14.6667L16.875 17.375"
                    stroke="#0D1117"
                    strokeWidth="2.16667"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.8027 19.5689C16.1769 18.9431 16.1769 17.9285 16.8027 17.3027C17.4285 16.6769 18.4432 16.6769 19.069 17.3027L22.364 20.5977C22.9898 21.2235 22.9898 22.2382 22.364 22.864C21.7382 23.4898 20.7236 23.4898 20.0978 22.864/L16.8027 19.5689Z"
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
              disabled={!url.trim()}
              className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 h-[55px] text-black font-normal ${!url.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              style={{
                background: "linear-gradient(to right, #00FF7F, #00C260)",
              }}
            >
              <span className="text-[20px]">Analyze</span>
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.1666 14.6667L16.875 17.375"
                  stroke="#0D1117"
                  strokeWidth="2.16667"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.8027 19.5689C16.1769 18.9431 16.1769 17.9285 16.8027 17.3027C17.4285 16.6769 18.4432 16.6769 19.069 17.3027L22.364 20.5977C22.9898 21.2235 22.9898 22.2382 22.364 22.864C21.7382 23.4898 20.7236 23.4898 20.0978 22.864/L16.8027 19.5689Z"
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

          {/* Show Analysis Reports only when we have data */}
          {(data || cachedData.analysisData) && submittedUrl && (
            <div className="mb-8">
              {/* Header */}
              <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                <h3 className="text-[#00FFFF] text-xl md:text-2xl font-medium">
                  Analysis Reports
                </h3>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center justify-center px-4 py-2 space-x-2 transition-colors rounded-lg md:justify-start bg-white/5 hover:bg-white/10"
                  disabled={!data}
                >
                  <span className="text-lg text-[#00FFFF]">Download Report</span>
                  <DownloadIcon />
                </button>
              </div>

              <p className="mb-6 text-sm text-gray-300 md:text-base">
                Clear, concise reports showing your website's SEO issues,
                performance metrics, and improvement tips.
              </p>

              {/* Tabs */}
              <div className="flex mb-6 space-x-4 overflow-x-auto border-b border-gray-700 md:space-x-8 md:mb-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-3 border-b-2 whitespace-nowrap ${activeTab === "overview"
                    ? "border-[#00FFFF] text-[#00FFFF]"
                    : "border-transparent text-gray-400 hover:text-white"
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("error")}
                  className={`pb-3 border-b-2 whitespace-nowrap ${activeTab === "error"
                    ? "border-[#00FFFF] text-[#00FFFF]"
                    : "border-transparent text-gray-400 hover:text-white"
                    }`}
                >
                  Error (
                  {totalIssues})
                </button>
              </div>

              {/* Content based on active tab */}
              {activeTab === "overview" ? (
                <div className="bg-[#161B22] rounded-lg p-4 md:p-6 mb-8">
                  {/* Website Analysis Header */}
                  <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-1 flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-6">
                      {/* SEO Score Circle */}
                      <div className="flex flex-col justify-center text-center md:justify-start">
                        <div className="relative w-24 h-24 mx-auto mb-2 md:w-32 md:h-32">
                          <svg
                            className="w-full h-full transform -rotate-90"
                            viewBox="0 0 120 120"
                          >
                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              stroke="#374151"
                              strokeWidth="10"
                              fill="none"
                            />
                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              stroke="#00FF7F"
                              strokeWidth="10"
                              fill="none"
                              strokeDasharray={`${data?.seoScore * 3.14159
                                } ${100 * 3.14159}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-white md:text-3xl">
                              {data?.seoScore}
                            </span>
                          </div>
                        </div>
                        <p className="text-white text-medium md:text-lg">
                          SEO Score
                        </p>
                      </div>

                      {/* Website Info */}
                      <div className="text-center md:text-left">
                        <h4 className="mb-2 text-xl font-medium text-white md:text-2xl">
                          {data?.url}
                        </h4>
                        <p className="text-[#00FFFF] text-base md:text-lg mb-2">
                          Analysis Reports
                        </p>
                        <p className="text-sm leading-relaxed text-gray-300 md:text-base w-full word-wrap">
                          {data?.metaDescription}
                        </p>
                      </div>
                    </div>

                    {/* Analysis Date */}
                    <div className="text-center lg:text-right w-content flex-1">
                      <p className="text-sm text-gray-300 md:text-base">
                        Analysis Date: {data?.analysisDate}
                      </p>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <DashboardMetrics metrics={data} />

                  {/* Bottom Section with Site Health and Chart */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Site Health */}
                    <div className="p-4 rounded-lg bg-white/5 lg:p-6">
                      <h4 className="mb-4 text-lg font-medium text-white">
                        Site Health
                      </h4>
                      <div className="flex flex-col md:flex-row">
                        <div className="mb-4">
                          <PieChart width={350} height={200}>
                            <Pie
                              dataKey="value"
                              startAngle={180}
                              endAngle={0}
                              data={getPieChartData()}
                              cx={175}
                              cy={150}
                              innerRadius={50}
                              outerRadius={90}
                              fill="#8884d8"
                              stroke="none"
                            >
                              {getPieChartData()?.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Label
                              value={data?.siteHealth?.toString()}
                              position="bottom"
                              offset={-50}
                              style={{
                                fontSize: "32px",
                                fontWeight: "bold",
                                fill: "#00FFFF",
                                textAnchor: "middle",
                              }}
                            />
                          </PieChart>
                        </div>
                        <div className="flex flex-row items-center justify-center gap-4 space-y-2 md:flex-col">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-3 h-3 bg-[#00FF7F] rounded-full"></div>
                            <span className="text-sm text-gray-400">
                              Health
                            </span>
                          </div>
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-gray-400">
                              Issues
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="p-4 rounded-lg bg-white/5 lg:p-6 lg:col-span-2">
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={getChartData()}>
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
                            <Line
                              type="monotone"
                              dataKey="health"
                              stroke="#00FF7F"
                              strokeWidth={2}
                              dot={false}
                            />
                            <Line
                              type="monotone"
                              dataKey="issues"
                              stroke="#EF4444"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                renderErrorContent()
              )}
            </div>
          )}
        </div>
      </div>
      {currentIssue && (
        <IssueModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          issueType={effectiveErrorData}
          issueData={effectiveErrorData}
        />
      )}
    </div>
  );
};

export default MainContent;

/*********************************
            Latest Backup
*********************************/

// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Label,
// } from "recharts";
// import IssueModal from "@/components/IssueModal";
// import { MetricCard } from "@/types";
// import DashboardMetrics from "@/components/DashboardMetrics";
// import DownloadIcon from "@/components/icons/Download";
// import useSWR from "swr";
// import axios from "axios";
// import Link from "next/link";


// // Fetcher function for SWR
// const fetcher = async (url: string) => {
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error("Failed to fetch data");
//   }
//   return response.json();
// };


// // POST API call function
// const postData = async (url: string) => {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_DEV}/crawler/start?url=${encodeURIComponent(url)}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   if (!response.ok) {
//     throw new Error("Failed to post data");
//   }
//   return response.json();
// };


// const MainContent: React.FC = () => {
//   const [url, setUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentIssue, setCurrentIssue] = useState<{
//     type: "image" | "content" | "keyword";
//     data: {
//       imageIssues?: any[];
//       contentIssues?: any[];
//       keywordIssues?: any[];
//     };
//   } | null>(null);

//   // API call using SWR
//   const { data: analysisData, error, isLoading } = useSWR(
//     submittedUrl
//       ? `${process.env.NEXT_PUBLIC_API_URL_DEV}/analyze/website?url=${encodeURIComponent(submittedUrl)}`
//       : null,
//     fetcher
//   );

//   const data = analysisData?.data;

//   const { data: errorData, error: seoError, isLoading: isErrorLoading } = useSWR(
//     submittedUrl
//       ? `${process.env.NEXT_PUBLIC_API_URL_DEV}/seo-analyzer/analyze?url=${encodeURIComponent(submittedUrl)}`
//       : null,
//     fetcher
//   );


//   // Reset submitted URL if input is cleared
//   useEffect(() => {
//     if (!url.trim()) {
//       setSubmittedUrl(null);
//     }
//   }, [url]);

//   const handleAnalyze = async () => {
//     if (url.trim()) {
//       setLoading(true);
//       const result = await postData(url.trim());

//       if (result.status) {
//         setSubmittedUrl(url.trim());
//         setActiveTab("overview");
//       }
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleAnalyze();
//     }
//   };

//   // Prepare chart data from API response
//   const getChartData = () => {
//     if (!data) return [];
//     return data?.trends?.map((item: { month: string; health: number; issues: number }) => ({
//       month: item.month.toUpperCase().slice(0, 3),
//       health: item?.health,
//       issues: item.issues,
//     }));
//   };

//   // Prepare pie chart data from API response
//   const getPieChartData = () => {
//     if (!data) return [];
//     return [
//       { name: "Health", value: data.siteHealth, color: "#00ff00" },
//       { name: "Issues", value: 100 - data.siteHealth || 0, color: "#ff0000" },
//     ];
//   };

//   const renderIssueGroup = (title: string, issues: any[]) => (
//     <div className="mb-8">
//       <h3 className="mb-8 text-lg font-medium text-white">{title}</h3>
//       <div className="space-y-4 w-full">
//         {issues?.map((item, index) => (
//           <div
//             key={index}
//             className="w-full pb-4 border-b border-gray-600 md:flex md:justify-between"
//           >
//             <div className="flex items-center justify-between w-full mb-3">
//               <div className="flex items-center space-x-2 w-full">
//                 <svg
//                   width="22"
//                   height="23"
//                   viewBox="0 0 22 23"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <circle
//                     cx="11"
//                     cy="11.5"
//                     r="10"
//                     stroke="#C8081B"
//                     strokeWidth="1.5"
//                   />
//                   <path
//                     d="M10.992 14.5H11.001"
//                     stroke="#C8081B"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <path
//                     d="M11 11.5L11 7.5"
//                     stroke="#C8081B"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>

//                 <Link href={item} target="_blank" className="text-base text-white underline cursor-pointer hover:text-blue-300">
//                   {item}
//                 </Link>
//               </div>
//             </div>
//             <div className="flex flex-wrap justify-end w-full gap-6">
//               <button
//                 onClick={() => handleOpenModal("image")}
//                 className={`px-4 py-2 rounded-xl cursor-pointer text-normal font-normal border border-[#00FF7F] text-[#00FF7F] bg-[#00FF7F]/8`}
//               >
//                 Solution
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const totalIssues =
//     errorData?.brokenLinks?.length + errorData?.oversizedImages?.length;
//   errorData?.blurryImages?.length;

//   const renderErrorContent = () => {
//     if (!errorData) return null;



//     return (
//       <div className="p-4 md:p-6 max-w-full">
//         <div className="p-8 mb-6 rounded-lg bg-white/5">
//           {errorData?.brokenLinks
//             ? renderIssueGroup("Broken Links", errorData?.brokenLinks)
//             : ""}
//         </div>
//         <div className="p-8 mb-6 rounded-lg bg-white/5">
//           {renderIssueGroup("OversizedImages", errorData?.oversizedImages)}
//         </div>
//         <div className="p-8 mb-6 rounded-lg bg-white/5">
//           {renderIssueGroup("Blurry Images", errorData?.blurryImages)}
//         </div>
//       </div>
//     );
//   };

//   // function for error section modal handling
//   const handleOpenModal = (issueType: "image" | "content" | "keyword") => {
//     if (!data) return;

//     setCurrentIssue({
//       type: issueType,
//       data: data.issues,
//     });
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setCurrentIssue(null);
//   };

//   // Loading state
//   if (isLoading || isErrorLoading || loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#0D1117]">
//         <div className="text-center">
//           <div className="w-16 h-16 mx-auto border-4 border-[#00FFFF] border-t-transparent rounded-full animate-spin"></div>
//           <p className="mt-4 text-lg text-[#00FFFF]">Analyzing website...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#0D1117]">
//         <div className="p-6 text-center bg-[#161B22] rounded-lg">
//           <h3 className="mb-4 text-xl font-medium text-[#DC091E]">
//             Analysis Failed
//           </h3>
//           <p className="text-gray-300">{error.message}</p>
//           <button
//             onClick={() => setSubmittedUrl(null)}
//             className="px-4 py-2 mt-4 text-white bg-[#00FFFF] rounded-lg hover:bg-[#00C260]"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }



//   return (
//     <div className="min-h-screen bg-[#0D1117] text-white">
//       <div className="flex-1 p-4 md:p-6 lg:p-8">
//         <div className="max-w-full">
//           {/* Main Heading */}
//           <h2 className="text-2xl md:text-3xl lg:text-[32px] font-medium text-[#00FFFF] mb-4">
//             Optimize Your Website for Maximum Reach
//           </h2>

//           {/* Description */}
//           <p className="text-[#FFFFFF] text-base md:text-lg font-normal mb-6 md:mb-8 leading-relaxed">
//             Unlock your website's full potential with SEO Insights. Identify
//             issues, get actionable recommendations, and improve visibility
//             across search engines to attract more visitors and grow your online
//             presence.
//           </p>

//           {/* URL Input Section */}
//           <div className="flex items-center w-full mb-8 md:mb-12">
//             <div className="relative flex-1">
//               {/* Link icon (left side) */}
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <svg
//                   width="24"
//                   height="25"
//                   viewBox="0 0 24 25"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M11.1002 3.5C7.45057 3.50657 5.53942 3.59617 4.31806 4.81754C3 6.13559 3 8.25698 3 12.4997C3 16.7425 3 18.8639 4.31806 20.1819C5.63611 21.5 7.7575 21.5 12.0003 21.5C16.243 21.5 18.3644 21.5 19.6825 20.1819C20.9038 18.9606 20.9934 17.0494 21 13.3998"
//                     stroke="white"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <path
//                     d="M21.0705 4.53235C21.3645 4.24058 21.3663 3.76571 21.0745 3.4717C20.7827 3.17769 20.3079 3.17588 20.0139 3.46765L21.0705 4.53235ZM14.4717 8.96765C14.1777 9.25942 14.1759 9.73429 14.4676 10.0283C14.7594 10.3223 15.2343 10.3241 15.5283 10.0324L14.4717 8.96765ZM20.0285 3.72706L19.8977 4.46557L20.0285 3.72706ZM15.9999 2.75C15.5857 2.75004 15.25 3.08585 15.25 3.50007C15.25 3.91428 15.5859 4.25004 16.0001 4.25L15.9999 2.75ZM20.25 8.5C20.25 8.91421 20.5858 9.25 21 9.25C21.4142 9.25 21.75 8.91421 21.75 8.5H20.25ZM20.7729 4.47175L21.5115 4.34109V4.34109L20.7729 4.47175ZM20.5422 4L20.0139 3.46765L14.4717 8.96765L15 9.5L15.5283 10.0324L21.0705 4.53235L20.5422 4Z"
//                     fill="white"
//                   />
//                 </svg>
//               </div>

//               {/* Input field */}
//               <input
//                 type="url"
//                 placeholder="Paste website URL here..."
//                 value={url}
//                 onChange={(e) => setUrl(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 className="w-full h-[60px] md:h-[50px] bg-transparent border border-gray-600 rounded-lg py-3 pl-12 pr-4 md:pr-48 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />

//               {/* Analyze button (right side) */}
//               <button
//                 onClick={handleAnalyze}
//                 disabled={!url.trim()}
//                 className={`absolute inset-y-0 right-0 hidden md:flex items-center justify-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 m-2 w-[130px] h-[35px] text-black font-normal cursor-pointer ${!url.trim() ? "opacity-50 cursor-not-allowed" : ""
//                   }`}
//                 style={{
//                   background: "linear-gradient(to right, #00FF7F, #00C260)",
//                 }}
//               >
//                 <span className="text-[20px]">Analyze</span>
//                 <svg
//                   width="24"
//                   height="25"
//                   viewBox="0 0 24 25"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M14.1666 14.6667L16.875 17.375"
//                     stroke="#0D1117"
//                     strokeWidth="2.16667"
//                     strokeLinejoin="round"
//                   />
//                   <path
//                     d="M16.8027 19.5689C16.1769 18.9431 16.1769 17.9285 16.8027 17.3027C17.4285 16.6769 18.4432 16.6769 19.069 17.3027L22.364 20.5977C22.9898 21.2235 22.9898 22.2382 22.364 22.864C21.7382 23.4898 20.7236 23.4898 20.0978 22.864L16.8027 19.5689Z"
//                     stroke="#0D1117"
//                     strokeWidth="2.16667"
//                     strokeLinecap="round"
//                   />
//                   <path
//                     d="M16.3333 9.25001C16.3333 5.06185 12.9381 1.66667 8.74996 1.66667C4.5618 1.66667 1.16663 5.06185 1.16663 9.25001C1.16663 13.4382 4.5618 16.8333 8.74996 16.8333C12.9381 16.8333 16.3333 13.4382 16.3333 9.25001Z"
//                     stroke="#0D1117"
//                     strokeWidth="2.16667"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Mobile Analyze Button */}
//           <div className="mb-8 md:hidden">
//             <button
//               onClick={handleAnalyze}
//               disabled={!url.trim()}
//               className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 h-[55px] text-black font-normal ${!url.trim() ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               style={{
//                 background: "linear-gradient(to right, #00FF7F, #00C260)",
//               }}
//             >
//               <span className="text-[20px]">Analyze</span>
//               <svg
//                 width="24"
//                 height="25"
//                 viewBox="0 0 24 25"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M14.1666 14.6667L16.875 17.375"
//                   stroke="#0D1117"
//                   strokeWidth="2.16667"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M16.8027 19.5689C16.1769 18.9431 16.1769 17.9285 16.8027 17.3027C17.4285 16.6769 18.4432 16.6769 19.069 17.3027L22.364 20.5977C22.9898 21.2235 22.9898 22.2382 22.364 22.864C21.7382 23.4898 20.7236 23.4898 20.0978 22.864L16.8027 19.5689Z"
//                   stroke="#0D1117"
//                   strokeWidth="2.16667"
//                   strokeLinecap="round"
//                 />
//                 <path
//                   d="M16.3333 9.25001C16.3333 5.06185 12.9381 1.66667 8.74996 1.66667C4.5618 1.66667 1.16663 5.06185 1.16663 9.25001C1.16663 13.4382 4.5618 16.8333 8.74996 16.8333C12.9381 16.8333 16.3333 13.4382 16.3333 9.25001Z"
//                   stroke="#0D1117"
//                   strokeWidth="2.16667"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </button>
//           </div>

//           {/* Show Analysis Reports only when we have data */}
//           {data && (
//             <div className="mb-8">
//               {/* Header */}
//               <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
//                 <h3 className="text-[#00FFFF] text-xl md:text-2xl font-medium">
//                   Analysis Reports
//                 </h3>
//                 <button className="flex items-center justify-center px-4 py-2 space-x-2 transition-colors rounded-lg md:justify-start bg-white/5 hover:text-white">
//                   <span className="text-lg text-[#00FFFF]">Download</span>
//                   <DownloadIcon />
//                 </button>
//               </div>

//               <p className="mb-6 text-sm text-gray-300 md:text-base">
//                 Clear, concise reports showing your website's SEO issues,
//                 performance metrics, and improvement tips.
//               </p>

//               {/* Tabs */}
//               <div className="flex mb-6 space-x-4 overflow-x-auto border-b border-gray-700 md:space-x-8 md:mb-8">
//                 <button
//                   onClick={() => setActiveTab("overview")}
//                   className={`pb-3 border-b-2 whitespace-nowrap ${activeTab === "overview"
//                     ? "border-[#00FFFF] text-[#00FFFF]"
//                     : "border-transparent text-gray-400 hover:text-white"
//                     }`}
//                 >
//                   Overview
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("error")}
//                   className={`pb-3 border-b-2 whitespace-nowrap ${activeTab === "error"
//                     ? "border-[#00FFFF] text-[#00FFFF]"
//                     : "border-transparent text-gray-400 hover:text-white"
//                     }`}
//                 >
//                   Error (
//                   {totalIssues}
//                   )
//                 </button>
//               </div>

//               {/* Content based on active tab */}
//               {activeTab === "overview" ? (
//                 <div className="bg-[#161B22] rounded-lg p-4 md:p-6 mb-8">
//                   {/* Website Analysis Header */}
//                   <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
//                     <div className="flex flex-1 flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-6">
//                       {/* SEO Score Circle */}
//                       <div className="flex flex-col justify-center text-center md:justify-start">
//                         <div className="relative w-24 h-24 mx-auto mb-2 md:w-32 md:h-32">
//                           <svg
//                             className="w-full h-full transform -rotate-90"
//                             viewBox="0 0 120 120"
//                           >
//                             <circle
//                               cx="60"
//                               cy="60"
//                               r="50"
//                               stroke="#374151"
//                               strokeWidth="10"
//                               fill="none"
//                             />
//                             <circle
//                               cx="60"
//                               cy="60"
//                               r="50"
//                               stroke="#00FF7F"
//                               strokeWidth="10"
//                               fill="none"
//                               strokeDasharray={`${data?.seoScore * 3.14159} ${100 * 3.14159
//                                 }`}
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                           <div className="absolute inset-0 flex flex-col items-center justify-center">
//                             <span className="text-2xl font-bold text-white md:text-3xl">
//                               {data?.seoScore}
//                             </span>
//                           </div>
//                         </div>
//                         <p className="text-white text-medium md:text-lg">
//                           SEO Score
//                         </p>
//                       </div>

//                       {/* Website Info */}
//                       <div className="text-center md:text-left">
//                         <h4 className="mb-2 text-xl font-medium text-white md:text-2xl">
//                           {data?.url}
//                         </h4>
//                         <p className="text-[#00FFFF] text-base md:text-lg mb-2">
//                           Analysis Reports
//                         </p>
//                         <p className="text-sm leading-relaxed text-gray-300 md:text-base w-full word-wrap">
//                           {data?.metaDescription}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Analysis Date */}
//                     <div className="text-center lg:text-right w-content flex-1">
//                       <p className="text-sm text-gray-300 md:text-base">
//                         Analysis Date: {data?.analysisDate}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Metrics Grid */}
//                   <DashboardMetrics metrics={data} />

//                   {/* Bottom Section with Site Health and Chart */}
//                   <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//                     {/* Site Health */}
//                     <div className="p-4 rounded-lg bg-white/5 lg:p-6">
//                       <h4 className="mb-4 text-lg font-medium text-white">
//                         Site Health
//                       </h4>
//                       <div className="flex flex-col md:flex-row">
//                         <div className="mb-4">
//                           <PieChart width={350} height={200}>
//                             <Pie
//                               dataKey="value"
//                               startAngle={180}
//                               endAngle={0}
//                               data={getPieChartData()}
//                               cx={175}
//                               cy={150}
//                               innerRadius={50}
//                               outerRadius={90}
//                               fill="#8884d8"
//                               stroke="none"
//                             >
//                               {getPieChartData()?.map((entry, index) => (
//                                 <Cell
//                                   key={`cell-${index}`}
//                                   fill={entry.color}
//                                 />
//                               ))}
//                             </Pie>
//                             <Label
//                               value={data?.siteHealth?.toString()}
//                               position="bottom"
//                               offset={-50}
//                               style={{
//                                 fontSize: "32px",
//                                 fontWeight: "bold",
//                                 fill: "#00FFFF",
//                                 textAnchor: "middle",
//                               }}
//                             />
//                           </PieChart>
//                         </div>
//                         <div className="flex flex-row items-center justify-center gap-4 space-y-2 md:flex-col">
//                           <div className="flex items-center justify-center space-x-2">
//                             <div className="w-3 h-3 bg-[#00FF7F] rounded-full"></div>
//                             <span className="text-sm text-gray-400">
//                               Health
//                             </span>
//                           </div>
//                           <div className="flex items-center justify-center space-x-2">
//                             <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                             <span className="text-sm text-gray-400">
//                               Issues
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Chart */}
//                     <div className="p-4 rounded-lg bg-white/5 lg:p-6 lg:col-span-2">
//                       <div className="h-60">
//                         <ResponsiveContainer width="100%" height="100%">
//                           <LineChart data={getChartData()}>
//                             <XAxis
//                               dataKey="month"
//                               axisLine={false}
//                               tickLine={false}
//                               tick={{ fill: "#9CA3AF", fontSize: 12 }}
//                             />
//                             <YAxis
//                               domain={[0, 100]}
//                               axisLine={false}
//                               tickLine={false}
//                               tick={{ fill: "#9CA3AF", fontSize: 12 }}
//                             />
//                             <Line
//                               type="monotone"
//                               dataKey="health"
//                               stroke="#00FF7F"
//                               strokeWidth={2}
//                               dot={false}
//                             />
//                             <Line
//                               type="monotone"
//                               dataKey="issues"
//                               stroke="#EF4444"
//                               strokeWidth={2}
//                               dot={false}
//                             />
//                           </LineChart>
//                         </ResponsiveContainer>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 renderErrorContent()
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//       {currentIssue && (
//         <IssueModal
//           isOpen={isModalOpen}
//           onClose={handleCloseModal}
//           issueType={errorData}
//           issueData={errorData}
//         />
//       )}
//     </div>
//   );
// };

// export default MainContent;
