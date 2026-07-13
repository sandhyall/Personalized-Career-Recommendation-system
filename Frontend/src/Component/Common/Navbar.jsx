import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/image.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name") || "User";
    setName(storedName);
  }, []);

  const initials = name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");

    window.location.href = "/login";
  };

  return (
    <header className="bg-white backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-3 px-6">
        <Link
          to="/"
          className="flex items-center transition-transform hover:scale-105"
        >
          <img src={logo} alt="logo" className="h-10 w-auto" />
         
        </Link>
        

        <div className="hidden md:flex items-center space-x-7">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
          >
            Contact
          </Link>

          <div className="flex items-center space-x-4 ml-4 border-l pl-6 border-gray-200">
            <Link
              to="/login"
              className="text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Login
            </Link>

            <Link
              to="/get-started"
              className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all shadow-sm active:scale-95"
            >
              Get Started
            </Link>

            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-center h-9 w-9 bg-indigo-100 text-indigo-700 font-bold rounded-full border border-indigo-200 hover:bg-indigo-200 transition-colors"
              >
                {initials}
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">
                      Account Settings
                    </p>

                    <p className="text-sm font-semibold text-gray-700 mt-1">
                      {name}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/history"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    History
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-red-50 text-red-500 transition-colors border-t border-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
