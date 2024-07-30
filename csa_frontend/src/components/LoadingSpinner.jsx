import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center mt-8">
    <div className="w-64 bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
        <span className="ml-4 text-gray-900">Please wait...</span>
      </div>
    </div>
  </div>
  );
};

export default LoadingSpinner;
