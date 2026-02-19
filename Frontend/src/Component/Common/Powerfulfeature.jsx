import React from "react";
import { 
  Target, 
  TrendingUp, 
  Map, 
  Zap, 
  Lock, 
  RefreshCw, 
  BarChart3 
} from "lucide-react";

const PowerfulFeature = () => {
  const features = [
    {
      title: "Skill-Based Career Recommendation",
      description: "Analyzes your current skills and matches them with suitable job roles using structured recommendation logic.",
      icon: <Target className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Skill Gap Analysis",
      description: "Identifies missing prerequisite skills and suggests what to learn next using DAG-based progression.",
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Job Market Insights",
      description: "Provides information about trending roles and high-growth opportunities.",
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Structured Career Roadmap",
      description: "Generates a step-by-step learning and career progression path.",
      icon: <Map className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Intelligent Job Matching",
      description: "Uses content-based filtering to recommend jobs aligned with your profile.",
      icon: <Zap className="w-6 h-6 text-blue-600" />,
    },
    
    {
      title: "Real-Time Profile Updates",
      description: "Your career path updates automatically as you learn new skills.",
      icon: <RefreshCw className="w-6 h-6 text-blue-600" />,
    },
  ];

  return (
    <section className="py-16 px-4 ">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Powerful Features for your Career Success
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="mb-4 p-3 bg-blue-50 w-fit rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PowerfulFeature;