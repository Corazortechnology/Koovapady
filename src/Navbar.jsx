import { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [active, setActive] = useState("Home");

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Feedback", path: "/feedback" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("authenticated");
    if (onLogout) onLogout();
    navigate("/"); 
  };

  return (
    <footer className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-8">
        {/* === Left: Logo Section === */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 flex items-center justify-center border-2 border-black rounded-full">
            <span className="text-black font-bold text-lg">T</span>
          </div>
          <h1 className="text-2xl font-semibold text-black">Koovappady kshemalayam</h1>
        </div>

        {/* === Center: Nav Links === */}
        <nav className="flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setActive(link.name)}
              className={`text-base font-semibold px-4 py-2 rounded-md transition-all duration-200 ${active === link.name
                  ? "bg-black text-yellow-400"
                  : "text-black hover:bg-black hover:text-yellow-400"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-end">
          <button
            onClick={handleLogout}
            className="ml-8 px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-all duration-200"
          >
            Logout
          </button>
        </div>

        {/* === Right: Empty for spacing symmetry === */}
        <div className="w-16" />
      </div>
    </footer>
  );
}

export default Footer;
