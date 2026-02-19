import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-amber-50 shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link
          to="/"
          className="text-2xl font-extrabold text-gray-700  hover:text-indigo-800 transition-colors"
        >
          Sandhya.
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-700 font-medium hover:text-indigo-600 transition"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-700 font-medium hover:text-indigo-600 transition"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 font-medium hover:text-indigo-600 transition"
          >
            Contact
          </Link>

          <div className="flex items-center space-x-3 ml-4">
            <Link
              to="/login"
              className="px-5 py-2 border hover:bg-indigo-700 border-black font-bold text-black rounded-lg hover:bg-black-50 transition"
            >
              Login
            </Link>
            <Link
              to="/start"
              className="px-5 py-2 bg--600 text-white bg-black rounded-lg hover:bg-indigo-700 shadow-md transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
