import React from "react";
import { Target, Cpu, TrendingUp } from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: <Cpu className="w-8 h-8 text-blue-500" />,
      title: "Skill-based matching",
      description:
        "The system compares your skills and interests with career profiles in our dataset.",
    },
    {
      icon: <Target className="w-8 h-8 text-indigo-500" />,
      title: "Personalized suggestions",
      description:
        "You get the top three career options that best fit your input, with a match score.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
      title: "Learning path",
      description:
        "Each recommended career includes resources, practice tasks, and a sample project.",
    },
  ];

  return (
    <div className=" min-h-screen ">
      <section className="py-20  border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Personalized Career Recommendation System
          </h1>
          <p className=" max-w-3xl mx-auto leading-relaxed">
            This project helps students explore IT career options based on their
            skills, interests, and academic background. It is built as a
            full-stack web application with a Python recommendation engine.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-indigo-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">About the project</h2>
            <p className="text-indigo-100 mb-4">
              Many students find it hard to choose a career when there are so
              many technical roles available. Generic advice often ignores the
              skills a person already has.
            </p>
            <p className="text-indigo-100">
              Our system uses content-based filtering and heuristic scoring to
              recommend suitable IT careers and show a possible next step on a
              career path.
            </p>
          </div>
          <div className="bg-indigo-800/50 p-8 rounded-3xl border border-indigo-700">
            <blockquote className="text-2xl italic font-light">
              "Enter your skills and interests, get ranked career suggestions,
              then follow learning and practice steps for the role you choose."
            </blockquote>
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Ready to find your path?
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-blue-200">
          Get Started Now
        </button>
      </section>
    </div>
  );
};

export default AboutUs;
