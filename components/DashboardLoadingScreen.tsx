// import { useState, useEffect } from 'react';

// const DashboardLoadingScreen<{process:number,message:string}> = ({progress,message}) => {

//     // useEffect(() => {
//     //     const interval = setInterval(() => {
//     //         setProgress(prev => {
//     //             if (prev >= 0.99) {
//     //                 clearInterval(interval);
//     //                 return 0.99;
//     //             }
//     //             return prev + 0.01 + Math.random() * 0.05;
//     //         });
//     //     }, 300);

//     //     return () => clearInterval(interval);
//     // }, []);

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0D1117] to-[#1A2639] p-4">
//             <div className="relative w-32 h-32 mb-8">
//                 {/* Outer ring with gradient */}
//                 <div className="absolute inset-0 border-4 border-transparent rounded-full animate-spin"
//                     style={{
//                         background: 'conic-gradient(from 0deg, transparent, #00FFFF, transparent)',
//                         WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
//                         mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
//                         WebkitMaskComposite: 'xor',
//                         maskComposite: 'exclude'
//                     }}></div>

//                 {/* Inner circle */}
//                 <div className="absolute inset-4 rounded-full bg-[#0D1117] flex items-center justify-center">
//                     <div className="text-2xl font-bold text-[#00FFFF] animate-pulse">
//                         {Math.min(99, Math.floor(progress * 100))}%
//                     </div>
//                 </div>
//             </div>

//             <h2 className="text-2xl font-bold text-[#00FFFF] mb-2">Analyzing Website</h2>

//             <p className="text-[#8B949E] max-w-md text-center mb-6">
//                 {getLoadingMessage(progress)}
//             </p>

//             {/* Animated dots */}
//             <div className="flex space-x-2">
//                 {[...Array(3)].map((_, i) => (
//                     <div
//                         key={i}
//                         className="w-3 h-3 bg-[#00FFFF] rounded-full"
//                         style={{
//                             animation: `bounce 1.4s infinite`,
//                             animationDelay: `${i * 0.2}s`
//                         }}
//                     ></div>
//                 ))}
//             </div>

//             {/* Progress bar */}
//             <div className="w-full max-w-xs h-2 bg-[#30363D] rounded-full mt-8">
//                 <div
//                     className="h-full bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] rounded-full transition-all duration-300"
//                     style={{ width: `${Math.min(99, progress * 100)}%` }}
//                 ></div>
//             </div>

//             {/* Fun tip */}
//             <p className="text-[#6E7681] text-sm mt-4 italic">
//                 Did you know? {funFacts[Math.floor(progress * funFacts.length) % funFacts.length]}
//             </p>
//         </div>
//     );
// };

// // Dynamic loading messages based on progress
// const getLoadingMessage = (progress: number) => {
//     if (progress < 0.3) return "Initializing analysis engine...";
//     if (progress < 0.6) return "Scanning website structure...";
//     if (progress < 0.8) return "Identifying key elements...";
//     return "Finalizing results...";
// };

// const funFacts = [
//     "The average website has over 50 accessibility issues.",
//     "Google indexes over 130 trillion web pages.",
//     "The first website went live in 1991.",
//     "Optimized sites can increase conversions by 20%.",
//     "Mobile users abandon sites that take over 3 seconds to load."
// ];

// export default DashboardLoadingScreen;