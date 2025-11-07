import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Footer({ onLogout }) {
  const [active, setActive] = useState("Home");
  const [navLinks, setNavLinks] = useState([
    { name: "Home", path: "/" },
    { name: "Feedback", path: "/feedback" },
  ]);
  const navigate = useNavigate();

  // fetch folders from API and append as nav links (keeps Home + Feedback at start)
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
    const url = `${baseUrl}/folders/public`;
    const controller = new AbortController();

    const fetchFolders = async () => {
      try {
        const res = await fetch(url, { signal: controller.signal, headers: { "Content-Type": "application/json" } });
        if (!res.ok) {
          console.warn("Failed to load folders for footer nav:", res.status, res.statusText);
          return;
        }
        const data = await res.json();
        if (!Array.isArray(data)) return;

        const folderLinks = data.map((f, i) => {
          const id = f._id || f.id || `folder-${i}`;
          const name = f.name || f.title || `Folder ${i + 1}`;
          return { name, path: `/folder/${id}` };
        });

        // keep Home & Feedback as first two links
        setNavLinks([{ name: "Home", path: "/" }, { name: "Feedback", path: "/feedback" }, ...folderLinks]);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching footer folders:", err);
      }
    };

    fetchFolders();
    return () => controller.abort();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("authenticated");
    if (typeof onLogout === "function") onLogout();
    navigate("/");
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-4 px-6 md:px-8 gap-3">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <h1 className="text-lg md:text-2xl font-semibold text-black">Koovappady kshemalayam</h1>
        </div>

        {/* Center: Nav Links (wrapped, no scrollbar) */}
        <nav className="flex flex-wrap items-center justify-center gap-2 md:gap-3 flex-1 md:flex-none mx-2">
          {navLinks.map((link) => (
            <Link
              key={link.path + link.name}
              to={link.path}
              onClick={() => setActive(link.name)}
              className={`text-xs sm:text-sm md:text-base font-semibold px-2 sm:px-3 py-1 rounded-md transition-all duration-150 ${
                active === link.name
                  ? "bg-black text-yellow-400"
                  : "text-black hover:bg-black hover:text-yellow-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Logout */}
        <div className="flex items-center justify-end w-full md:w-auto">
          <button
            onClick={handleLogout}
            className="ml-0 md:ml-8 px-3 py-1.5 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-all duration-150 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

// import { useState } from "react";
// import { Link } from "react-router-dom";

// function Footer() {
//   const [active, setActive] = useState("Home");

//   const navLinks = [
//     { name: "Home", path: "/" },
//     { name: "Feedback", path: "/feedback" },
//   ];

//   const handleLogout = () => {
//     sessionStorage.removeItem("authenticated");
//     if (onLogout) onLogout();
//     navigate("/"); 
//   };

//   return (
//     <footer className="w-full bg-white border-b border-gray-200">
//       <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-8">
//         {/* === Left: Logo Section === */}
//         <div className="flex items-center space-x-2">
//           <h1 className="text-2xl font-semibold text-black">Koovappady kshemalayam</h1>
//         </div>

//         {/* === Center: Nav Links === */}
//         <nav className="flex items-center space-x-8">
//           {navLinks.map((link) => (
//             <Link
//               key={link.name}
//               to={link.path}
//               onClick={() => setActive(link.name)}
//               className={`text-base font-semibold px-4 py-2 rounded-md transition-all duration-200 ${active === link.name
//                   ? "bg-black text-yellow-400"
//                   : "text-black hover:bg-black hover:text-yellow-400"
//                 }`}
//             >
//               {link.name}
//             </Link>
//           ))}
//         </nav>
//         <div className="flex items-end">
//           <button
//             onClick={handleLogout}
//             className="ml-8 px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-all duration-200"
//           >
//             Logout
//           </button>
//         </div>

//         {/* === Right: Empty for spacing symmetry === */}
//         <div className="w-16" />
//       </div>
//     </footer>
//   );
// }

// export default Footer;
