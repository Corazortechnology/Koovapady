import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=1400&h=1000&fit=crop&q=80";

export default function FolderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [folderName, setFolderName] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [media, setMedia] = useState([]); // unified list of images+videos with `type`
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null); // { item, index }

  useEffect(() => {
    if (!id) {
      setError("No folder id provided in route.");
      setLoading(false);
      return;
    }

    const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
    const uploadUrl = `${base}/upload/${id}/public`;
    const foldersUrl = `${base}/folders/public`;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchImagesAndName = async () => {
      setLoading(true);
      setError(null);

      try {
        const resp = await fetch(uploadUrl, { signal, headers: { "Content-Type": "application/json" } });
        if (!resp.ok) {
          throw new Error(`Failed to fetch media: ${resp.status} ${resp.statusText}`);
        }
        const data = await resp.json();

        const imgs = Array.isArray(data.images) ? data.images : [];
        const vids = Array.isArray(data.videos) ? data.videos : [];

        // tag each item with type and ensure createdAt exists
        const imgsTagged = imgs.map((it) => ({ ...it, type: "image" }));
        const vidsTagged = vids.map((it) => ({ ...it, type: "video" }));

        setImages(imgsTagged);
        setVideos(vidsTagged);

        // unify into single array (images first, then videos). If you want interleaving/preserve server order,
        // server should return a single ordered list — otherwise this approach is fine.
        const unified = [...imgsTagged, ...vidsTagged];
        setMedia(unified);

        const possibleName = data.name || data.folderName || data.title || data.folder?.name || "";
        if (possibleName) {
          setFolderName(possibleName);
          setLoading(false);
          return;
        }

        const respFolders = await fetch(foldersUrl, { signal, headers: { "Content-Type": "application/json" } });
        if (!respFolders.ok) {
          console.warn("Failed to fetch public folders to read name", respFolders.status);
        } else {
          const foldersData = await respFolders.json();
          if (Array.isArray(foldersData)) {
            const found = foldersData.find((f) => (f._id || f.id) === id);
            if (found && (found.name || found.title)) {
              setFolderName(found.name || found.title);
            } else {
              setFolderName(found?.label || "");
            }
          }
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Unknown error while fetching media");
      } finally {
        setLoading(false);
      }
    };

    fetchImagesAndName();

    return () => controller.abort();
  }, [id]);

  const handleMediaClick = (item, index) => {
    setSelectedMedia({ item, index });
  };

  const handleNext = () => {
    if (!selectedMedia || media.length === 0) return;
    const nextIndex = (selectedMedia.index + 1) % media.length;
    setSelectedMedia({ item: media[nextIndex], index: nextIndex });
  };

  const handlePrev = () => {
    if (!selectedMedia || media.length === 0) return;
    const prevIndex = (selectedMedia.index - 1 + media.length) % media.length;
    setSelectedMedia({ item: media[prevIndex], index: prevIndex });
  };

  // counts
  const totalCount = media.length;
  const imagesCount = images.length;
  const videosCount = videos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transform transition-transform group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-gray-700 group-hover:text-gray-900 font-medium hidden sm:block">Back to Gallery</span>
              </button>

              <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 capitalize">
                  {folderName || "Family Memories"}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-gray-600 font-medium">
                      {totalCount} {totalCount === 1 ? "memory" : "memories"} ({imagesCount} photos, {videosCount} videos)
                    </p>
                  </div>
                  <span className="text-gray-400">•</span>
                </div>
              </div>
            </div>

            {/* Placeholder for potential actions */}
            <div></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Memories</h3>
            <p className="text-gray-500 text-center max-w-md">We're gathering your precious family moments...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load</h3>
            <p className="text-gray-600 max-w-md mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && media.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Memories Yet</h3>
            <p className="text-gray-600 max-w-md mb-6">This album is waiting to be filled with beautiful family moments. Check back soon for updates!</p>
            <button onClick={() => navigate(-1)} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold">
              Explore Other Albums
            </button>
          </div>
        )}

        {/* Media Grid */}
        {!loading && !error && media.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{imagesCount}</div>
                  <div className="text-sm text-gray-600">Photos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{videosCount}</div>
                  <div className="text-sm text-gray-600">Videos</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {media.map((m, idx) => {
                const src = m?.url || m;
                const alt = m?.public_id || `memory-${idx + 1}`;
                const createdAt = m?.createdAt ? new Date(m.createdAt) : new Date();

                return (
                  <div
                    key={m._id || m.public_id || `${idx}-${alt}`}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                    onClick={() => handleMediaClick(m, idx)}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      {m.type === "image" ? (
                        <img src={src || PLACEHOLDER} alt={alt} loading="lazy" className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <video
                          src={src}
                          preload="metadata"
                          muted
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                          playsInline
                        />
                      )}

                      {/* Download + Label overlays */}
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <a
                          href={src || PLACEHOLDER}
                          download={m?.label ? `${folderName || "media"}-${m.label}` : `${folderName || "media"}-${idx + 1}`}
                          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2 text-white hover:bg-white/30 transition-all duration-200"
                          onClick={(e) => e.stopPropagation()}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={m?.label || "Download"}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                          </svg>
                        </a>
                      </div>

                      {m?.label && (
                        <div className="absolute left-3 bottom-3 z-20 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          <span className="truncate max-w-[8rem] block">{m.label}</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-white text-sm font-medium">
                            {createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      <div className="absolute top-3 right-3 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={m.type === "video" ? "M14.752 11.168l-6.518-3.76A1 1 0 007 8.34v7.32a1 1 0 001.234.97l6.518-1.88A1 1 0 0016 13.76v-2.584a1 1 0 00-1.248-.008z" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
                          {m.type === "image" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                        </svg>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          {m?.label && <div className="text-sm text-gray-600 truncate">{m.label}</div>}
                        </div>
                        <div className="text-xs text-gray-400">{createdAt.toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center py-8">
              <p className="text-gray-500 font-medium">You've reached the end of this beautiful collection</p>
              <p className="text-gray-400 text-sm mt-1">{totalCount} precious moments captured forever</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal for selected media */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4">
          <div className="relative max-w-6xl max-h-full w-full">
            {/* Close */}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-16 right-0 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Download in modal */}
            <a
              href={selectedMedia.item.url || PLACEHOLDER}
              download={selectedMedia.item?.label ? `${folderName || 'media'}-${selectedMedia.item.label}` : `${folderName || 'media'}-${selectedMedia.index + 1}`}
              className="absolute -top-16 left-0 z-10 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2 text-white hover:bg-white/30 transition-all duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
              <span className="text-white text-sm">Download</span>
            </a>

            {/* Prev / Next */}
            {media.length > 1 && (
              <>
                <button onClick={handlePrev} className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={handleNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Media content */}
            <div className="flex items-center justify-center h-full">
              {selectedMedia.item.type === "image" ? (
                <img src={selectedMedia.item.url || PLACEHOLDER} alt={selectedMedia.item.public_id || `memory-${selectedMedia.index + 1}`} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
              ) : (
                <video controls src={selectedMedia.item.url} className="max-w-full max-h-[80vh] rounded-lg" />
              )}
            </div>

            {/* Info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-white text-center">
              <p className="font-medium">Memory {selectedMedia.index + 1} of {media.length}</p>
              <p className="text-sm opacity-90">{selectedMedia.item.createdAt ? new Date(selectedMedia.item.createdAt).toLocaleDateString() : 'Unknown date'}</p>
              {selectedMedia.item.label && <p className="text-sm opacity-90 mt-1 italic">Label: {selectedMedia.item.label}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const PLACEHOLDER =
//   "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=1400&h=1000&fit=crop&q=80";

// export default function FolderPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [folderName, setFolderName] = useState("");
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);

//   useEffect(() => {
//     if (!id) {
//       setError("No folder id provided in route.");
//       setLoading(false);
//       return;
//     }

//     const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
//     const uploadUrl = `${base}/upload/${id}/public`;
//     const foldersUrl = `${base}/folders/public`;

//     const controller = new AbortController();
//     const signal = controller.signal;

//     const fetchImagesAndName = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const resp = await fetch(uploadUrl, { signal, headers: { "Content-Type": "application/json" } });
//         if (!resp.ok) {
//           throw new Error(`Failed to fetch images: ${resp.status} ${resp.statusText}`);
//         }
//         const data = await resp.json();

//         const imgs = Array.isArray(data.images) ? data.images : [];
//         setImages(imgs);

//         const possibleName = data.name || data.folderName || data.title || data.folder?.name || "";
//         if (possibleName) {
//           setFolderName(possibleName);
//           setLoading(false);
//           return;
//         }

//         const respFolders = await fetch(foldersUrl, { signal, headers: { "Content-Type": "application/json" } });
//         if (!respFolders.ok) {
//           console.warn("Failed to fetch public folders to read name", respFolders.status);
//         } else {
//           const foldersData = await respFolders.json();
//           if (Array.isArray(foldersData)) {
//             const found = foldersData.find((f) => (f._id || f.id) === id);
//             if (found && (found.name || found.title)) {
//               setFolderName(found.name || found.title);
//             } else {
//               setFolderName(found?.label || "");
//             }
//           }
//         }
//       } catch (err) {
//         if (err.name === "AbortError") return;
//         setError(err.message || "Unknown error while fetching folder");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchImagesAndName();

//     return () => controller.abort();
//   }, [id]);

//   const handleImageClick = (img, index) => {
//     setSelectedImage({ ...img, index });
//   };

//   const handleNextImage = () => {
//     if (selectedImage) {
//       const nextIndex = (selectedImage.index + 1) % images.length;
//       setSelectedImage({ ...images[nextIndex], index: nextIndex });
//     }
//   };

//   const handlePrevImage = () => {
//     if (selectedImage) {
//       const prevIndex = (selectedImage.index - 1 + images.length) % images.length;
//       setSelectedImage({ ...images[prevIndex], index: prevIndex });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
//       {/* Enhanced Header */}
//       <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/60">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
//               >
//                 <svg 
//                   className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transform transition-transform group-hover:-translate-x-1" 
//                   fill="none" 
//                   stroke="currentColor" 
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//                 <span className="text-gray-700 group-hover:text-gray-900 font-medium hidden sm:block">
//                   Back to Gallery
//                 </span>
//               </button>

//               <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>

//               <div>
//                 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 capitalize">
//                   {folderName || "Family Memories"}
//                 </h1>
//                 <div className="flex items-center gap-3 mt-1">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                     <p className="text-sm text-gray-600 font-medium">
//   {images.length} {images.length === 1 ? "memory" : "memories"}
// </p>

//                   </div>
//                   <span className="text-gray-400">•</span>
//                   {/* <p className="text-sm text-gray-500">
//                     Created {new Date().toLocaleDateString()}
//                   </p> */}
//                 </div>
//               </div>
//             </div>

//             {/* Share Button */}
//             {/* <button className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
//               </svg>
//               <span>Share</span>
//             </button> */}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Enhanced Loading State */}
//         {loading && (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="relative mb-8">
//               <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Memories</h3>
//             <p className="text-gray-500 text-center max-w-md">
//               We're gathering your precious family moments...
//             </p>
//           </div>
//         )}

//         {/* Enhanced Error State */}
//         {error && (
//           <div className="flex flex-col items-center justify-center py-20 text-center">
//             <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
//               <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load</h3>
//             <p className="text-gray-600 max-w-md mb-6">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-300"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {/* Enhanced Empty State */}
//         {!loading && !error && images.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-20 text-center">
//             <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//               <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-3">No Memories Yet</h3>
//             <p className="text-gray-600 max-w-md mb-6">
//               This album is waiting to be filled with beautiful family moments. Check back soon for updates!
//             </p>
//             <button
//               onClick={() => navigate(-1)}
//               className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
//             >
//               Explore Other Albums
//             </button>
//           </div>
//         )}

//         {/* Enhanced Image Grid */}
//         {!loading && !error && images.length > 0 && (
//           <div className="space-y-8">
//             {/* Grid Stats */}
//             <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60">
//               <div className="flex items-center gap-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-gray-900">{images.length}</div>
//                   <div className="text-sm text-gray-600">Photos</div>
//                 </div>
//                 <div className="h-8 w-px bg-gray-300"></div>
//                 {/* <div className="text-center">
//                   <div className="text-2xl font-bold text-gray-900">
//                     {new Date().getFullYear()}
//                   </div>
//                   <div className="text-sm text-gray-600">Year</div>
//                 </div> */}
//               </div>
//             </div>

//             {/* Image Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//               {images.map((img, idx) => {
//                 const src = img?.url || img;
//                 const alt = img?.public_id || `memory-${idx + 1}`;
//                 const createdAt = img?.createdAt ? new Date(img.createdAt) : new Date();

//                 return (
//                   <div
//                     key={img._id || img.public_id || `${idx}-${alt}`}
//                     className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
//                     onClick={() => handleImageClick(img, idx)}
//                   >
//                     {/* Image Container */}
//                     <div className="relative aspect-square overflow-hidden">
//                       <img
//                         src={src}
//                         alt={alt}
//                         loading="lazy"
//                         className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
//                       />

//                       {/* Download button (thumbnail) + Label overlay */}
//                       <div className="absolute top-3 left-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                         <a
//                           href={src}
//                           download={img?.label ? `${folderName || 'image'}-${img.label}` : `${folderName || 'image'}-${idx + 1}`}
//                           className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2 text-white hover:bg-white/30 transition-all duration-200"
//                           onClick={(e) => e.stopPropagation()} // prevent opening modal when clicking download
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           title={img?.label || "Download image"}
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
//                           </svg>
//                           <span className="sr-only">Download</span>
//                         </a>
//                       </div>

//                       {/* Label overlay (bottom-left) */}
//                       {img?.label && (
//                         <div className="absolute left-3 bottom-3 z-20 bg-black/60 text-white text-xs px-2 py-1 rounded">
//                           <span className="truncate max-w-[8rem] block">{img.label}</span>
//                         </div>
//                       )}

//                       {/* Overlay */}
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
//                           <p className="text-white text-sm font-medium">
//                             {createdAt.toLocaleDateString('en-US', { 
//                               month: 'long', 
//                               day: 'numeric', 
//                               year: 'numeric' 
//                             })}
//                           </p>
//                         </div>
//                       </div>

//                       {/* View Icon */}
//                       <div className="absolute top-3 right-3 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
//                         <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                         </svg>
//                       </div>
//                     </div>

//                     {/* Image Info */}
//                     <div className="p-4">
//                       <div className="flex items-center justify-between">
//                         <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                           {/* Show label below info (if present) — minimal addition */}
//                       {img?.label && (
//                         <div className="text-sm text-gray-600 truncate">
//                           {img.label}
//                         </div>
//                       )}
//                         </span>
//                         <span className="text-xs text-gray-400">
//                           {createdAt.toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Footer Stats */}
//             <div className="text-center py-8">
//               <p className="text-gray-500 font-medium">
//                 You've reached the end of this beautiful collection
//               </p>
//               <p className="text-gray-400 text-sm mt-1">
//                 {images.length} precious moments captured forever
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Image Modal */}
//       {selectedImage && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4">
//           <div className="relative max-w-6xl max-h-full w-full">
//             {/* Close Button */}
//             <button
//               onClick={() => setSelectedImage(null)}
//               className="absolute -top-16 right-0 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
//             >
//               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>

//             {/* Download button in modal */}
//             <a
//               href={selectedImage.url || selectedImage}
//               download={selectedImage?.label ? `${folderName || 'image'}-${selectedImage.label}` : `${folderName || 'image'}-${selectedImage.index + 1}`}
//               className="absolute -top-16 left-0 z-10 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2 text-white hover:bg-white/30 transition-all duration-200"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
//               </svg>
//               <span className="text-white text-sm">Download</span>
//             </a>

//             {/* Navigation Buttons */}
//             {images.length > 1 && (
//               <>
//                 <button
//                   onClick={handlePrevImage}
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
//                 >
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                 </button>
//                 <button
//                   onClick={handleNextImage}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
//                 >
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </>
//             )}

//             {/* Image */}
//             <div className="flex items-center justify-center h-full">
//               <img
//                 src={selectedImage.url || selectedImage}
//                 alt={selectedImage.public_id || `memory-${selectedImage.index + 1}`}
//                 className="max-w-full max-h-[80vh] object-contain rounded-lg"
//               />
//             </div>

//             {/* Image Info */}
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-white text-center">
//               <p className="font-medium">
//                 Memory {selectedImage.index + 1} of {images.length}
//               </p>
//               <p className="text-sm opacity-90">
//                 {selectedImage.createdAt ? new Date(selectedImage.createdAt).toLocaleDateString() : 'Unknown date'}
//               </p>
//               {/* show label in modal if available */}
//               {selectedImage.label && (
//                 <p className="text-sm opacity-90 mt-1 italic">Label: {selectedImage.label}</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const PLACEHOLDER =
//   "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=1400&h=1000&fit=crop&q=80";

// export default function FolderPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [folderName, setFolderName] = useState("");
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);

//   useEffect(() => {
//     if (!id) {
//       setError("No folder id provided in route.");
//       setLoading(false);
//       return;
//     }

//     const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
//     const uploadUrl = `${base}/upload/${id}/public`;
//     const foldersUrl = `${base}/folders/public`;

//     const controller = new AbortController();
//     const signal = controller.signal;

//     const fetchImagesAndName = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const resp = await fetch(uploadUrl, { signal, headers: { "Content-Type": "application/json" } });
//         if (!resp.ok) {
//           throw new Error(`Failed to fetch images: ${resp.status} ${resp.statusText}`);
//         }
//         const data = await resp.json();

//         const imgs = Array.isArray(data.images) ? data.images : [];
//         setImages(imgs);

//         const possibleName = data.name || data.folderName || data.title || data.folder?.name || "";
//         if (possibleName) {
//           setFolderName(possibleName);
//           setLoading(false);
//           return;
//         }

//         const respFolders = await fetch(foldersUrl, { signal, headers: { "Content-Type": "application/json" } });
//         if (!respFolders.ok) {
//           console.warn("Failed to fetch public folders to read name", respFolders.status);
//         } else {
//           const foldersData = await respFolders.json();
//           if (Array.isArray(foldersData)) {
//             const found = foldersData.find((f) => (f._id || f.id) === id);
//             if (found && (found.name || found.title)) {
//               setFolderName(found.name || found.title);
//             } else {
//               setFolderName(found?.label || "");
//             }
//           }
//         }
//       } catch (err) {
//         if (err.name === "AbortError") return;
//         setError(err.message || "Unknown error while fetching folder");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchImagesAndName();

//     return () => controller.abort();
//   }, [id]);

//   const handleImageClick = (img, index) => {
//     setSelectedImage({ ...img, index });
//   };

//   const handleNextImage = () => {
//     if (selectedImage) {
//       const nextIndex = (selectedImage.index + 1) % images.length;
//       setSelectedImage({ ...images[nextIndex], index: nextIndex });
//     }
//   };

//   const handlePrevImage = () => {
//     if (selectedImage) {
//       const prevIndex = (selectedImage.index - 1 + images.length) % images.length;
//       setSelectedImage({ ...images[prevIndex], index: prevIndex });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
//       {/* Enhanced Header */}
//       <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/60">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
//               >
//                 <svg 
//                   className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transform transition-transform group-hover:-translate-x-1" 
//                   fill="none" 
//                   stroke="currentColor" 
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//                 <span className="text-gray-700 group-hover:text-gray-900 font-medium hidden sm:block">
//                   Back to Gallery
//                 </span>
//               </button>

//               <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>

//               <div>
//                 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 capitalize">
//                   {folderName || "Family Memories"}
//                 </h1>
//                 <div className="flex items-center gap-3 mt-1">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                     <p className="text-sm text-gray-600 font-medium">
//                       {images.length} memory{images.length === 1 ? "" : "ies"}
//                     </p>
//                   </div>
//                   <span className="text-gray-400">•</span>
//                   <p className="text-sm text-gray-500">
//                     Created {new Date().toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Share Button */}
//             {/* <button className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
//               </svg>
//               <span>Share</span>
//             </button> */}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Enhanced Loading State */}
//         {loading && (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="relative mb-8">
//               <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Memories</h3>
//             <p className="text-gray-500 text-center max-w-md">
//               We're gathering your precious family moments...
//             </p>
//           </div>
//         )}

//         {/* Enhanced Error State */}
//         {error && (
//           <div className="flex flex-col items-center justify-center py-20 text-center">
//             <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
//               <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load</h3>
//             <p className="text-gray-600 max-w-md mb-6">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-300"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {/* Enhanced Empty State */}
//         {!loading && !error && images.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-20 text-center">
//             <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//               <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-3">No Memories Yet</h3>
//             <p className="text-gray-600 max-w-md mb-6">
//               This album is waiting to be filled with beautiful family moments. Check back soon for updates!
//             </p>
//             <button
//               onClick={() => navigate(-1)}
//               className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
//             >
//               Explore Other Albums
//             </button>
//           </div>
//         )}

//         {/* Enhanced Image Grid */}
//         {!loading && !error && images.length > 0 && (
//           <div className="space-y-8">
//             {/* Grid Stats */}
//             <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60">
//               <div className="flex items-center gap-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-gray-900">{images.length}</div>
//                   <div className="text-sm text-gray-600">Photos</div>
//                 </div>
//                 <div className="h-8 w-px bg-gray-300"></div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-gray-900">
//                     {new Date().getFullYear()}
//                   </div>
//                   <div className="text-sm text-gray-600">Year</div>
//                 </div>
//               </div>
//               {/* <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium transition-colors duration-300">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
//                 </svg>
//                 <span>Sort by Date</span>
//               </button> */}
//             </div>

//             {/* Image Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//               {images.map((img, idx) => {
//                 const src = img?.url || img;
//                 const alt = img?.public_id || `memory-${idx + 1}`;
//                 const createdAt = img?.createdAt ? new Date(img.createdAt) : new Date();

//                 return (
//                   <div
//                     key={img._id || img.public_id || `${idx}-${alt}`}
//                     className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
//                     onClick={() => handleImageClick(img, idx)}
//                   >
//                     {/* Image Container */}
//                     <div className="relative aspect-square overflow-hidden">
//                       <img
//                         src={src}
//                         alt={alt}
//                         loading="lazy"
//                         className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
//                       />
                      
//                       {/* Overlay */}
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
//                           <p className="text-white text-sm font-medium">
//                             {createdAt.toLocaleDateString('en-US', { 
//                               month: 'long', 
//                               day: 'numeric', 
//                               year: 'numeric' 
//                             })}
//                           </p>
//                         </div>
//                       </div>

//                       {/* View Icon */}
//                       <div className="absolute top-3 right-3 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
//                         <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                         </svg>
//                       </div>
//                     </div>

//                     {/* Image Info */}
//                     <div className="p-4">
//                       <div className="flex items-center justify-between">
//                         <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                           Memory {idx + 1}
//                         </span>
//                         <span className="text-xs text-gray-400">
//                           {createdAt.toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Footer Stats */}
//             <div className="text-center py-8">
//               <p className="text-gray-500 font-medium">
//                 You've reached the end of this beautiful collection
//               </p>
//               <p className="text-gray-400 text-sm mt-1">
//                 {images.length} precious moments captured forever
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Image Modal */}
//       {selectedImage && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4">
//           <div className="relative max-w-6xl max-h-full w-full">
//             {/* Close Button */}
//             <button
//               onClick={() => setSelectedImage(null)}
//               className="absolute -top-16 right-0 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
//             >
//               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>

//             {/* Navigation Buttons */}
//             {images.length > 1 && (
//               <>
//                 <button
//                   onClick={handlePrevImage}
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
//                 >
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                 </button>
//                 <button
//                   onClick={handleNextImage}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
//                 >
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </>
//             )}

//             {/* Image */}
//             <div className="flex items-center justify-center h-full">
//               <img
//                 src={selectedImage.url || selectedImage}
//                 alt={selectedImage.public_id || `memory-${selectedImage.index + 1}`}
//                 className="max-w-full max-h-[80vh] object-contain rounded-lg"
//               />
//             </div>

//             {/* Image Info */}
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-white text-center">
//               <p className="font-medium">
//                 Memory {selectedImage.index + 1} of {images.length}
//               </p>
//               <p className="text-sm opacity-90">
//                 {selectedImage.createdAt ? new Date(selectedImage.createdAt).toLocaleDateString() : 'Unknown date'}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const PLACEHOLDER =
//   "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=1400&h=1000&fit=crop&q=80";

// export default function FolderPage() {
//   const { id } = useParams(); // route: /folder/:id
//   const navigate = useNavigate();

//   const [folderName, setFolderName] = useState("");
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // helper to fetch images for the folder id
//   useEffect(() => {
//     if (!id) {
//       setError("No folder id provided in route.");
//       setLoading(false);
//       return;
//     }

//     const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
//     const uploadUrl = `${base}/upload/${id}/public`;
//     const foldersUrl = `${base}/folders/public`;

//     const controller = new AbortController();
//     const signal = controller.signal;

//     const fetchImagesAndName = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         // 1) Fetch images from upload endpoint
//         const resp = await fetch(uploadUrl, { signal, headers: { "Content-Type": "application/json" } });
//         if (!resp.ok) {
//           throw new Error(`Failed to fetch images: ${resp.status} ${resp.statusText}`);
//         }
//         const data = await resp.json();

//         // data expected shape: { images: [ { url, public_id, ... }, ... ], maybe other fields }
//         const imgs = Array.isArray(data.images) ? data.images : [];
//         setImages(imgs);

//         // try to read folder name from the same response (if present)
//         const possibleName = data.name || data.folderName || data.title || data.folder?.name || "";
//         if (possibleName) {
//           setFolderName(possibleName);
//           setLoading(false);
//           return;
//         }

//         // 2) If name wasn't provided, fallback: fetch public folders list and match by id
//         const respFolders = await fetch(foldersUrl, { signal, headers: { "Content-Type": "application/json" } });
//         if (!respFolders.ok) {
//           // We can still show images even if folder name lookup fails.
//           console.warn("Failed to fetch public folders to read name", respFolders.status);
//         } else {
//           const foldersData = await respFolders.json();
//           if (Array.isArray(foldersData)) {
//             const found = foldersData.find((f) => (f._id || f.id) === id);
//             if (found && (found.name || found.title)) {
//               setFolderName(found.name || found.title);
//             } else {
//               // sometimes the API returns pretty folder labels in other fields
//               setFolderName(found?.label || "");
//             }
//           }
//         }
//       } catch (err) {
//         if (err.name === "AbortError") return;
//         setError(err.message || "Unknown error while fetching folder");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchImagesAndName();

//     return () => controller.abort();
//   }, [id]);

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-extrabold">
//               {folderName ? folderName : "Folder"}
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               {images.length} image{images.length === 1 ? "" : "s"}
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
//             >
//               Back
//             </button>
//           </div>
//         </div>

//         {loading && <p className="text-center text-gray-500">Loading images…</p>}
//         {error && <p className="text-center text-red-500">Error: {error}</p>}

//         {!loading && !error && images.length === 0 && (
//           <div className="text-center text-gray-500 py-20">
//             No images found for this folder.
//           </div>
//         )}

//         {!loading && !error && images.length > 0 && (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//             {images.map((img, idx) => {
//               const src = img?.url || img;
//               const alt = img?.public_id || `image-${idx + 1}`;
//               return (
//                 <figure
//                   key={img._id || img.public_id || `${idx}-${alt}`}
//                   className="relative rounded-lg overflow-hidden bg-gray-100"
//                 >
//                   <img
//                     src={src}
//                     alt={alt}
//                     loading="lazy"
//                     className="w-full h-56 object-cover transform transition-transform duration-400 hover:scale-105"
//                   />
//                   <figcaption className="p-2 text-xs text-gray-600">{new Date(img.createdAt || Date.now()).toLocaleDateString()}</figcaption>
//                 </figure>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
