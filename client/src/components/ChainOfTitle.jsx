import React from 'react';
import { FileTextIcon } from './icons';

const ChainOfTitle = ({ chainOfTitle, chainAnalysis }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <FileTextIcon className="h-6 w-6 mr-2 text-blue-600" />
        Chain of Title (50-Year History)
      </h2>
      
      <div className="space-y-4">
        {chainOfTitle.map((entry, index) => (
          <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{entry.owner}</p>
                <p className="text-sm text-gray-600">
                  from <span className="font-medium">{entry.from}</span>
                </p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p className="font-medium">{entry.deedType}</p>
                <p>{entry.date}</p>
                <p className="font-mono text-xs">Doc #{entry.docNum}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Chain Analysis</h3>
        <p className="text-sm text-gray-700">{chainAnalysis}</p>
      </div>
    </div>
  );
};

export default ChainOfTitle;

