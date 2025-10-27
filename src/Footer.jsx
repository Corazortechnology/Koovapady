function Footer() {
  return (
    <footer className="bg-[#2f2926] text-gray-300">
      {/* === Top section === */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Column 1: Logo & Description */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center border-2 border-white rounded-full">
              <span className="text-white text-lg font-bold">T</span>
            </div>
            <span className="text-2xl font-semibold text-white">
              Koovappady
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
            A family tree takes you back <br className="hidden md:block" />{" "}
            generations
          </h2>

          <p className="text-gray-400 text-base leading-relaxed">
            The world’s largest collection of online family history
            records makes it possible.
          </p>
        </div>

        {/* Column 2: Information Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Information</h3>
          <ul className="space-y-3 text-gray-400 text-base">
            <li className="hover:text-white transition-colors cursor-pointer">
              About Us
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              Contact Us
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              Mearsley History
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              Our Blog
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              Our Galleries
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Quick Link</h3>
          <ul className="space-y-3 text-gray-400 text-base">
            <li className="hover:text-white transition-colors cursor-pointer">
              Family
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              Member
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              Submit Member
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              Family Tree
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              Shop
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Newsletter</h3>
          <p className="text-gray-400 text-base mb-6">
            Give your inbox some love with new products, tips, & more.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center bg-white rounded-full overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-yellow-400"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-5 py-3 text-gray-700 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-3 transition-all duration-300"
            >
              →
            </button>
          </form>
        </div>
      </div>

      {/* === Bottom section === */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Koovappady Kshemalayam. All rights
            reserved.
          </p>
          <p className="mt-3 md:mt-0">
            Powered by{" "}
            <span className="text-white font-medium">
              Hema Ravishankar
            </span>{" "}
            with Adobe Portfolio
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

// function Footer() {
//     return (
//         <div className="text-gray-400 text-xl text-center md:py-40 py-20">
//             <p>Powered by Hema Ravishankar with Adobe Portfolio</p>
//         </div>
//     )
// }

// export default Footer;