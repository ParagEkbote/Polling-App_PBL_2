import React from 'react';

const GoogleFormCard = () => {
  const handleClick = () => {
    window.open('https://forms.gle/93suNFnHXDemfuP3A', '_blank');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Google Form Access
        </label>
        <div className="text-gray-600">
          Please click the button below to access our form. You will be redirected to Google Forms in a new tab.
        </div>
        <button 
          onClick={handleClick}
          className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Report any Issue
        </button>
      </div>
    </div>
  );
};

export default GoogleFormCard;