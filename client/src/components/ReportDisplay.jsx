import React from 'react';
import ExecutiveSummary from './ExecutiveSummary';
import ChainOfTitle from './ChainOfTitle';
import ScheduleB from './ScheduleB';
import ExportButtons from './ExportButtons';
import { LockIcon } from './icons';

const ReportDisplay = ({ reportData, address }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Report Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <LockIcon className="h-8 w-8 mr-3 text-blue-600" />
            Preliminary Title Report
          </h1>
          <p className="text-gray-600 mb-4">Prepared for: Client</p>
          <p className="text-gray-600 mb-4">Subject Property: {address}</p>
          <p className="text-sm text-gray-500">Generated on: {currentDate}</p>
        </div>
        
        {/* Critical Disclaimer */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <LockIcon className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">CRITICAL DISCLAIMER</h3>
              <p className="text-sm text-red-700 mt-1">
                This is an informational, automated report based on a search of online public records. 
                It is NOT a substitute for a professional title examination or a policy of title insurance. 
                Data may be incomplete or inaccurate. All findings must be verified by a qualified 
                abstractor, attorney, or title company before any real estate transaction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <ExportButtons reportData={reportData} address={address} />

      {/* Report Sections */}
      <ExecutiveSummary reportData={reportData} />
      
      {/* Property & Vesting Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Property & Vesting Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Property Address</label>
              <p className="text-gray-900">{reportData.assessorData.propertySitus}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Current Vesting</label>
              <p className="text-gray-900">{reportData.assessorData.currentOwner}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Vesting Deed</label>
              <p className="text-gray-900">
                {reportData.chainOfTitle[0]?.deedType}, Document #{reportData.chainOfTitle[0]?.docNum}, 
                Recorded {reportData.chainOfTitle[0]?.date}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Legal Description</label>
              <p className="text-sm text-gray-600">{reportData.assessorData.legalDescription}</p>
            </div>
          </div>
        </div>
      </div>

      <ChainOfTitle 
        chainOfTitle={reportData.chainOfTitle} 
        chainAnalysis={reportData.chainAnalysis} 
      />
      
      <ScheduleB encumbrances={reportData.encumbrances} />
    </div>
  );
};

export default ReportDisplay;

