import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=1400&h=1000&fit=crop&q=80";

const FamilySection = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleClick = (link) => {
    if (!link) return;
    navigate(link);
  };

  const getFirstImageUrl = (folder) => {
    if (!folder) return null;
    if (Array.isArray(folder.images) && folder.images.length > 0) {
      const first = folder.images[0];
      if (first && typeof first.url === "string" && first.url.trim()) return first.url;
    }
    return null;
  };

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
    const url = `${baseUrl}/folders/public`;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchFolders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, { signal, headers: { "Content-Type": "application/json" } });
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        const mapped = (Array.isArray(data) ? data : []).map((f, i) => {
          const id = f._id || f.id || `folder-${i}`;
          const title = f.name || `Folder ${i + 1}`;
          const subtitle = f.name || "Folder";
          const year = f.createdAt ? new Date(f.createdAt).getFullYear() : "";
          const firstImage = getFirstImageUrl(f);
          const image = firstImage || PLACEHOLDER_IMAGE;
          const align = i % 2 === 0 ? "left" : "right";
          const link = `/folder/${id}`;

          return { id, title, subtitle, year, image, align, link };
        });

        setSections(mapped);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unknown error");
          setSections([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();

    return () => controller.abort();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700 uppercase tracking-wider">
              Welcome to Our Family
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Hi, this is{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              thekkemadom
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              kshemalayam
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Discover our family's cherished moments and memories. Scroll down to explore our journey.
          </p>

          {/* Animated Scroll Indicator */}
          <div className="mt-12 flex justify-center">
            <div className="animate-bounce w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        <div className="text-center mb-12">
          {loading && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>
              <p className="text-lg text-gray-600 font-medium">Loading family memories...</p>
            </div>
          )}
          
          {error && (
            <div className="inline-flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <p className="text-red-700 font-medium">
                Error loading memories: {error}
              </p>
            </div>
          )}
          
          {!loading && !error && sections.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">No memories found yet</p>
              <p className="text-gray-400 mt-2">Check back later for updates</p>
            </div>
          )}
        </div>

        {/* Enhanced Sections Grid */}
        <div className="space-y-8 lg:space-y-16">
          {sections.map((section, index) => {
            const isLeft = section.align === "left";
            
            return (
              <article
                key={section.id}
                className={`group relative flex flex-col lg:flex-row lg:h-[85vh] w-full overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-2 ${
                  isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                
                {/* Image Section */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleClick(section.link)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleClick(section.link);
                  }}
                  className="relative lg:w-1/2 w-full h-80 lg:h-full cursor-pointer overflow-hidden"
                >
                  {/* Background Image with Enhanced Effects */}
                  <div
                    className="absolute inset-0 bg-center bg-cover transform transition-all duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: `url(${section.image})` }}
                  />
                  
                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-100 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Floating Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12">
                    {/* Year Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4 w-fit border border-white/30">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white text-sm font-semibold tracking-wide">
                        {section.year}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-4xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6 capitalize tracking-tight">
                      {section.title}
                    </h2>
                    
                    {/* Enhanced CTA Button */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleClick(section.link)}
                        className="group/btn inline-flex items-center gap-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold transform transition-all duration-300 hover:scale-105 border border-white/30 hover:border-white/50 shadow-2xl"
                        aria-label={`Explore ${section.title}`}
                      >
                        <span className="uppercase tracking-widest text-sm">
                          Explore Memories
                        </span>
                        <svg
                          className="w-5 h-5 transform transition-transform duration-300 group-hover/btn:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Hover Effect Indicator */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleClick(section.link)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleClick(section.link);
                  }}
                  className="group/info relative lg:w-1/2 w-full h-80 lg:h-full bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-8 lg:p-16 cursor-pointer transition-all duration-500 hover:bg-gradient-to-br hover:from-gray-900 hover:to-black border-l-0 lg:border-l border-t lg:border-t-0 border-gray-100 hover:border-gray-800"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover/info:opacity-10 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500" />
                  </div>
                  
                  <div className="text-center max-w-md relative z-10">
                    {/* Section Number */}
                    <div className="text-8xl font-black text-gray-100 group-hover/info:text-gray-800 absolute -top-8 -left-8 -z-10 transition-colors duration-500">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 group-hover/info:text-white mb-6 transition-colors duration-500 capitalize">
                      {section.subtitle}
                    </h3>

                    <p className="text-xl text-gray-500 group-hover/info:text-gray-300 transition-colors duration-500 font-light">
                      Family Memories Collection
                    </p>

                    {/* Enhanced Animated Separator */}
                    <div className="mt-8 flex justify-center">
                      <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover/info:scale-x-100 transition-transform duration-700 origin-center rounded-full" />
                    </div>

                    {/* Interactive Hint */}
                    <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400 group-hover/info:text-gray-500 transition-colors duration-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>Click to explore collection</span>
                    </div>
                  </div>
                  
                  {/* Corner Accents */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gray-200 group-hover/info:border-white transition-colors duration-500 opacity-0 group-hover/info:opacity-100" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gray-200 group-hover/info:border-white transition-colors duration-500 opacity-0 group-hover/info:opacity-100" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gray-200 group-hover/info:border-white transition-colors duration-500 opacity-0 group-hover/info:opacity-100" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gray-200 group-hover/info:border-white transition-colors duration-500 opacity-0 group-hover/info:opacity-100" />
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer CTA */}
        {sections.length > 0 && (
          <div className="text-center mt-20 lg:mt-28">
            <div className="inline-flex flex-col items-center gap-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12 max-w-2xl mx-auto border border-blue-100">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Discover More Family Stories
              </h3>
              <p className="text-gray-600 text-lg">
                Continue exploring our family's journey through generations
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transform transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span>Back to Top</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FamilySection;

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const FamilySection = () => {
//     const [activeSection, setActiveSection] = useState(null);

//     const sections = [
//         {
//             id: 1,
//             title: 'the house',
//             subtitle: 'ENTER',
//             year: '2020',
//             image: 'https://plus.unsplash.com/premium_photo-1661475916373-5aaaeb4a5393?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5fGVufDB8fDB8fHww',
//             align: 'left',
//             link: '/house',
//         },
//         {
//             id: 2,
//             title: 'the grand parents',
//             subtitle: 'GOLDIES',
//             year: '2020',
//             image: 'https://plus.unsplash.com/premium_photo-1661475916373-5aaaeb4a5393?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5fGVufDB8fDB8fHww',
//             align: 'right',
//             link: "/grandparents"
//         },
//         {
//             id: 3,
//             title: 'the cousins',
//             subtitle: 'WE & US',
//             year: '2020',
//             image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
//             align: 'left',
//             link: "/cousins"
//         },
//         {
//             id: 4,
//             title: 'the memories',
//             subtitle: 'RELIVE',
//             year: '2020',
//             image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
//             align: 'right',
//             link: "/memories"
//         },
//         {
//             id: 5,
//             title: 'the happiness',
//             subtitle: 'Know',
//             year: '2020',
//             image: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800&h=600&fit=crop',
//             align: 'left',
//             link: "/happiness"
//         },
//         {
//             id: 6,
//             title: 'the events',
//             subtitle: 'KEY DATES',
//             year: '2020',
//             image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop',
//             align: 'right',
//             link: "/events"
//         },
//         {
//             id: 7,
//             title: 'the fun & fast',
//             subtitle: 'ENJOY',
//             year: '2022',
//             image: 'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=800&h=600&fit=crop',
//             align: 'left',
//             link: "/fun"
//         }
//     ];
//     const navigate = useNavigate();
//     const handleClick = (link) => {
//         console.log('Navigating to:', link);
//         navigate(link)
//     };

//     return (
//         <div className="min-h-screen mt-30 md:px-30 px-6">
//             <h1 className="text-center md:text-4xl font-bold text-2xl text-black">Hi, this is thekkemadom <br></br>kshemalayam's official site!
//             </h1>
//             <p className="text-center text-2xl text-gray-400 mb-30 mt-8">Scroll down to see more</p>

//             {sections.map((section) => (
//                 <div
//                     key={section.id}
//                     className={`flex flex-col h-120 ${section.align === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
//                         } w-full`}
//                 >
//                     <div
//                         onClick={() => handleClick(section.link)}
//                         className="relative w-full md:w-1/2 h-96 md:h-screen overflow-hidden group cursor-pointer"
//                     >
//                         <div
//                             className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 h-120 group-hover:scale-110"
//                             style={{
//                                 backgroundImage: `url(${section.image})`
//                             }}
//                         />

//                         <div className="absolute inset-0 bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300" />

//                         <div className="relative z-10 h-96 flex flex-col justify-center items-start p-8">
//                             <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
//                                 {section.title}
//                             </h2>

//                             <button className="group/btn bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full flex items-center gap-3 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
//                                 {section.subtitle}
//                                 <svg
//                                     className="w-5 h-5 transform group-hover/btn:translate-x-2 transition-transform duration-300"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M13 7l5 5m0 0l-5 5m5-5H6"
//                                     />
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>

//                     <div
//                         onClick={() => handleClick(section.link)}
//                         className="relative w-full md:w-1/2 bg-gray-200 flex flex-col justify-center items-center p-8 md:p-16 cursor-pointer group hover:bg-black transition-colors duration-300"
//                     >
//                         <div className="text-center max-w-md">
//                             <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 group-hover:text-white transition-colors duration-300">
//                                 {section.subtitle}
//                             </h3>

//                             <p className="text-gray-500 text-lg mb-8">{section.year}</p>


//                             <div className="mt-8 w-20 h-1 bg-pink-500 mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );

// };

// export default FamilySection;