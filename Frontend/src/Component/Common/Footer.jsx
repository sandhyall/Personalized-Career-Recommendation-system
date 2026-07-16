import React from "react";
import { Link } from "react-router-dom";
import { Mail, Linkedin, Twitter } from "lucide-react";
import logo from "../../assets/image.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <img src={logo} alt="" className="h-14 w-auto" />
          </div>
          <p className="text-sm leading-relaxed">
            Personalized career roadmaps powered by your skills and interests.
            Navigate your professional future with confidence.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/register" className="hover:text-blue-400 transition">
                Get Started
              </Link>
            </li>
            <li>
              <Link to="/get-started" className="hover:text-blue-400 transition">
                Career Assessment
              </Link>
            </li>
            <li>
              <Link to="/my-careers" className="hover:text-blue-400 transition">
                My Careers
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-blue-400 transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-400 transition">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-blue-400 transition">
                Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Grow with us</h4>
          <p className="text-sm text-slate-400 mb-3">
            Create a free account to save recommendations and return anytime.
          </p>
          <Link
            to="/register"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm transition"
          >
            Create free account
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs">
          © {currentYear} CareerLogic AI. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="mailto:hello@careerlogic.ai" aria-label="Email">
            <Mail className="w-4 h-4 hover:text-white" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin className="w-4 h-4 hover:text-white" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
            <Twitter className="w-4 h-4 hover:text-white" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
