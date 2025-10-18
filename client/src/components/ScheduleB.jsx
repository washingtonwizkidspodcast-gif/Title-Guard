import React from 'react';
import { AlertTriangleIcon, WarningIcon, LockIcon, CheckIcon } from './icons';

const ScheduleB = ({ encumbrances }) => {
  if (!encumbrances || encumbrances.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangleIcon className="h-6 w-6 mr-2 text-blue-600" />
          Schedule B: Exceptions & Encumbrances
        </h2>
        <div className="text-center py-8">
          <CheckIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">No significant encumbrances found.</p>
          <p className="text-sm text-gray-600 mt-2">This property appears to have a clear title.</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Potentially Open':
        return <AlertTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'Satisfied':
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      case 'Active':
        return <LockIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <WarningIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Potentially Open':
        return 'text-red-600 bg-red-50';
      case 'Satisfied':
        return 'text-green-600 bg-green-50';
      case 'Active':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <AlertTriangleIcon className="h-6 w-6 mr-2 text-blue-600" />
        Schedule B: Exceptions & Encumbrances
      </h2>
      
      <div className="space-y-4">
        {encumbrances.map((encumbrance, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{encumbrance.type}</h3>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(encumbrance.status)}`}>
                {getStatusIcon(encumbrance.status)}
                <span className="ml-1">{encumbrance.status}</span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Parties:</span>
                <span className="ml-2 text-gray-600">{encumbrance.parties.join(' and ')}</span>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Details:</span>
                <span className="ml-2 text-gray-600">
                  Document #{encumbrance.documentNumber}, Recorded {encumbrance.recordingDate}
                </span>
              </div>
              
              {encumbrance.amount && (
                <div>
                  <span className="font-medium text-gray-700">Amount:</span>
                  <span className="ml-2 text-gray-600">{encumbrance.amount}</span>
                </div>
              )}
              
              {encumbrance.description && (
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <span className="ml-2 text-gray-600">{encumbrance.description}</span>
                </div>
              )}
              
              {encumbrance.releaseDocument && (
                <div>
                  <span className="font-medium text-gray-700">Release:</span>
                  <span className="ml-2 text-gray-600">
                    Document #{encumbrance.releaseNumber}, Recorded {encumbrance.releaseDocument}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleB;
