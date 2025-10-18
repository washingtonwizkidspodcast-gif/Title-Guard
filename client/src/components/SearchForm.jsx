import React, { useState } from 'react';
import { SearchIcon, LoaderIcon } from './icons';

const SearchForm = ({ onSearch, isLoading }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (address.trim()) {
      onSearch(address.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Property Address
          </label>
          <div className="relative">
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter property address (e.g., 123 Main St, Anytown, USA)"
              className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              disabled={isLoading}
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !address.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="h-5 w-5 animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <SearchIcon className="h-5 w-5" />
              <span>Search Title</span>
            </>
          )}
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Available test addresses:</p>
        <ul className="space-y-1 text-xs">
          <li>• 123 Main St, Anytown, USA</li>
          <li>• 456 Oak Avenue, Springfield, IL</li>
        </ul>
      </div>
    </div>
  );
};

export default SearchForm;


