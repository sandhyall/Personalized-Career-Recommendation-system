import React from "react";
import { Target, Cpu, TrendingUp, Users } from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: <Cpu className="w-8 h-8 text-blue-500" />,
      title: "Data-Driven Precision",
      description:
        "Our recommendation engine uses advanced data mining to match your unique profile with market demands.",
    },
    {
      icon: <Target className="w-8 h-8 text-indigo-500" />,
      title: "Personalized Mapping",
      description:
        "We don't just find jobs; we map out long-term career trajectories tailored to your specific skill set.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
      title: "Market Insights",
      description:
        "Stay ahead of the curve with real-time analysis of the evolving digital economy and emerging roles.",
    },
  ];

  return (
    <div className=" min-h-screen ">
      <section className="py-20  border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Bridging the Gap Between{" "}
            <span className="text-blue-600">Ambition</span> and{" "}
            <span className="text-indigo-600">Opportunity</span>
          </h1>
          <p className=" max-w-3xl mx-auto leading-relaxed">
            In an era of rapid digital transformation, choosing a career path
            shouldn't be a guessing game. We leverage modern web technologies to
            help the next generation navigate their professional journey with
            absolute confidence.
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
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-indigo-100 mb-4">
              We started with a simple question: How can we make career guidance
              accessible, objective, and deeply personal?
            </p>
            <p className="text-indigo-100">
              By integrating full-stack development with robust data
              warehousing, we've built a platform that serves as a virtual
              career consultant—available 24/7 to help students and
              professionals optimize their potential in the modern workforce.
            </p>
          </div>
          <div className="bg-indigo-800/50 p-8 rounded-3xl border border-indigo-700">
            <blockquote className="text-2xl italic font-light">
              "The best way to predict your future is to create it. We provide
              the data; you provide the drive."
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
