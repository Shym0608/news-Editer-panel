"use client";
import { useState } from "react";
import News from "./News";

const MainNews = () => {
  const [newsType, setNewsType] = useState("story");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">News Dashboard</h1>

      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setNewsType("story")}
          className={`px-4 py-2 rounded-lg cursor-pointer ${
            newsType === "story" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Story News
        </button>

        <button
          onClick={() => setNewsType("digital")}
          className={`px-4 py-2 rounded-lg cursor-pointer ${
            newsType === "digital" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Digital News
        </button>
      </div>

      {/* Form Section */}
      <News type={newsType} />
    </div>
  );
};

export default MainNews;
