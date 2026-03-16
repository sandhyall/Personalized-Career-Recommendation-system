import React from "react";
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
            Personalized career roadmaps powered by AI. Navigate your
            professional future with confidence.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/assessments" className="hover:text-blue-400 transition">
                Career Quiz
              </a>
            </li>
            <li>
              <a href="/jobs" className="hover:text-blue-400 transition">
                Job Matches
              </a>
            </li>
            <li>
              <a href="/skills" className="hover:text-blue-400 transition">
                Skill Tracking
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/blog" className="hover:text-blue-400 transition">
                Career Advice
              </a>
            </li>
            <li>
              <a href="/help" className="hover:text-blue-400 transition">
                Support Center
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-blue-400 transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Get Career Tips</h4>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="bg-slate-800 border-none rounded px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm transition">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs">
          © {currentYear} CareerLogic AI. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">
            <Twitter size={18} />
          </a>
          <a href="#" className="hover:text-white">
            <Linkedin size={18} />
          </a>
          <a href="#" className="hover:text-white">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
