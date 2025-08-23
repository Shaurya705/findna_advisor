import React from 'react';

const TestComponent = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col justify-center items-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">FinDNA Advisor</h1>
        <p className="text-gray-700 text-lg mb-6">
          Welcome to the FinDNA Advisor platform. This is a test component to verify that the React application is rendering correctly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Financial Dashboard</h2>
            <p className="text-gray-600">Access your personalized financial dashboard to track your investments and expenses.</p>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-green-700 mb-2">AI Advisor</h2>
            <p className="text-gray-600">Get tailored financial advice from our advanced AI system that understands your needs.</p>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default TestComponent;
