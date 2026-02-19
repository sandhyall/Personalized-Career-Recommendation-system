import React from "react";
import { Link } from "react-router-dom";
import Hero from "../../assets/Hero.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden ">
      <div className="absolute top-0 right-0 -z-10 h-full w-1/3 bg-slate-50/50 hidden lg:block" />

      <div className="container mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 max-w-2xl text-center lg:text-left space-y-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/10">
            Smart Skill Gap Analysis
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            Build your Carrer path Step by Step
          </h1>

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            A Skill-driven recommendation system that guides you from learning
            to job readiness using intelligent matching and structured
            progression.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              to="/get-started"
              className="w-full sm:w-auto px-8 py-4 bg-slate-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-[#2563EB] hover:-translate-y-0.5 transition-all duration-200"
            >
              Find My Career Path
            </Link>
            <Link
              to="/how-it-works"
              className="w-full sm:w-auto px-8 py-4 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              View Case Studies
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500 font-medium">
              Trusted by 10,000+ students and professionals
            </p>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
          <div className="relative z-10 w-full  md:max-w-md lg:max-w-lg mx-auto overflow-hidden rounded-3xl shadow-2xl transition-transform duration-500">
            <img
              src={Hero}
              alt="Career Guidance Professional"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
