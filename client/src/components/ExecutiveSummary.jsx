import React from 'react';
import { CheckIcon, AlertTriangleIcon, WarningIcon } from './icons';

const ExecutiveSummary = ({ reportData }) => {
  const { assessorData, taxData, titleCondition } = reportData;
  
  const getTitleConditionColor = (condition) => {
    switch (condition) {
      case 'Appears Clear':
        return 'text-green-600 bg-green-50';
      case 'Exceptions Found':
        return 'text-yellow-600 bg-yellow-50';
      case 'Significant Clouds Detected - Professional Review Required':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTaxStatusColor = (status) => {
    return status === 'Paid' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <CheckIcon className="h-6 w-6 mr-2 text-blue-600" />
        Executive Summary
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Current Owner</label>
            <p className="text-lg font-semibold text-gray-900">{assessorData.currentOwner}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Parcel ID (APN)</label>
            <p className="text-lg font-mono text-gray-900">{assessorData.parcelNumber}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Tax Status</label>
            <p className={`text-lg font-semibold ${getTaxStatusColor(taxData.taxStatus)}`}>
              {taxData.taxStatus === 'Paid' ? 'Current' : `DELINQUENT - $${taxData.amountOwed} Owed`}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Title Condition</label>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTitleConditionColor(titleCondition)}`}>
              {titleCondition === 'Significant Clouds Detected - Professional Review Required' && (
                <AlertTriangleIcon className="h-4 w-4 mr-1" />
              )}
              {titleCondition === 'Exceptions Found' && (
                <WarningIcon className="h-4 w-4 mr-1" />
              )}
              {titleCondition === 'Appears Clear' && (
                <CheckIcon className="h-4 w-4 mr-1" />
              )}
              {titleCondition}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;


