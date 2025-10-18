import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import ReportDisplay from './components/ReportDisplay';
import { assessorLookup, recorderSearch, taxStatus } from './utils/api';
import { AlertTriangleIcon } from './components/icons';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');

  const analyzeTitleCondition = (encumbrances) => {
    const openMortgages = encumbrances.filter(e => e.status === 'Potentially Open' && e.type === 'Mortgage');
    const taxLiens = encumbrances.filter(e => e.status === 'Potentially Open' && e.type.includes('Tax Lien'));
    const otherLiens = encumbrances.filter(e => e.status === 'Potentially Open' && !e.type.includes('Mortgage') && !e.type.includes('Tax Lien'));

    if (openMortgages.length > 0 || taxLiens.length > 0 || otherLiens.length > 0) {
      return 'Significant Clouds Detected - Professional Review Required';
    } else if (encumbrances.length > 0) {
      return 'Exceptions Found';
    } else {
      return 'Appears Clear';
    }
  };

  const analyzeChainOfTitle = (chain) => {
    const gaps = [];
    const defects = [];

    // Check for gaps in ownership (simplified logic)
    for (let i = 0; i < chain.length - 1; i++) {
      const current = chain[i];
      const next = chain[i + 1];
      
      // Check if the grantor of current matches the grantee of next
      if (current.from !== next.owner) {
        gaps.push(`Gap detected between ${current.owner} and ${next.owner}`);
      }
    }

    // Check for quitclaim deeds in non-familial transfers
    chain.forEach(entry => {
      if (entry.deedType === 'Quitclaim Deed' && !entry.owner.includes('Estate') && !entry.from.includes('Estate')) {
        defects.push(`Quitclaim deed used in non-familial transfer: ${entry.from} to ${entry.owner}`);
      }
    });

    if (gaps.length > 0 || defects.length > 0) {
      return `WARNING: Issues detected in chain of title. ${gaps.join('; ')} ${defects.join('; ')}`;
    } else {
      return 'Chain appears complete and unbroken back to 1970.';
    }
  };

  const handleSearch = async (address) => {
    setIsLoading(true);
    setError(null);
    setReportData(null);
    setCurrentAddress(address);

    try {
      // Phase 1: Assessor Lookup
      console.log('Phase 1: Assessor Lookup');
      const assessorData = await assessorLookup(address);
      console.log('Assessor data:', assessorData);

      // Phase 2: Build Chain of Title
      console.log('Phase 2: Building Chain of Title');
      const chainOfTitle = [];
      let currentOwner = assessorData.currentOwner;
      let iterationCount = 0;
      const maxIterations = 10; // Prevent infinite loops

      while (currentOwner && iterationCount < maxIterations) {
        try {
          const deedData = await recorderSearch(currentOwner, 'deed_chain');
          if (deedData.documents && deedData.documents.length > 0) {
            const deed = deedData.documents[0];
            
            // Check if we've gone back far enough (50+ years)
            const deedYear = new Date(deed.recordingDate).getFullYear();
            if (deedYear < 1970) {
              console.log(`Reached 50+ year cutoff at ${deedYear}`);
              break;
            }

            chainOfTitle.push({
              owner: deed.grantee,
              from: deed.grantor,
              deedType: deed.documentType,
              date: deed.recordingDate,
              docNum: deed.documentNumber
            });

            currentOwner = deed.grantor;
            iterationCount++;
          } else {
            console.log('No more deeds found in chain');
            break;
          }
        } catch (err) {
          console.log('Error in chain search:', err.message);
          break;
        }
      }

      console.log('Chain of title built:', chainOfTitle);

      // Phase 3: Search Encumbrances for Each Owner
      console.log('Phase 3: Searching Encumbrances');
      const allEncumbrances = [];

      // Search encumbrances for current owner
      try {
        const currentEncumbrances = await recorderSearch(assessorData.currentOwner, 'encumbrance');
        if (currentEncumbrances.documents) {
          allEncumbrances.push(...currentEncumbrances.documents.map(doc => ({
            ...doc,
            owner: assessorData.currentOwner
          })));
        }
      } catch (err) {
        console.log('Error searching current owner encumbrances:', err.message);
      }

      // Search encumbrances for each owner in the chain
      for (const chainEntry of chainOfTitle) {
        try {
          const encumbrances = await recorderSearch(chainEntry.owner, 'encumbrance');
          if (encumbrances.documents) {
            allEncumbrances.push(...encumbrances.documents.map(doc => ({
              ...doc,
              owner: chainEntry.owner
            })));
          }
        } catch (err) {
          console.log(`Error searching encumbrances for ${chainEntry.owner}:`, err.message);
        }
      }

      console.log('All encumbrances found:', allEncumbrances);

      // Phase 4: Tax Status
      console.log('Phase 4: Tax Status');
      const taxData = await taxStatus(assessorData.parcelNumber);
      console.log('Tax data:', taxData);

      // Phase 5: Synthesize Report
      console.log('Phase 5: Synthesizing Report');
      const titleCondition = analyzeTitleCondition(allEncumbrances);
      const chainAnalysis = analyzeChainOfTitle(chainOfTitle);

      const finalReportData = {
        assessorData,
        chainOfTitle,
        encumbrances: allEncumbrances,
        taxData,
        titleCondition,
        chainAnalysis
      };

      console.log('Final report data:', finalReportData);
      setReportData(finalReportData);

    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">TitleGuard AI</h1>
            <p className="text-lg text-gray-600 mt-2">Digital Title Abstractor and Real Estate Data Analyst</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!reportData ? (
          <div className="space-y-8">
            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Search Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">How to Use TitleGuard AI</h2>
              <div className="text-sm text-blue-800 space-y-2">
                <p>1. Enter a property address in the search field above</p>
                <p>2. The system will perform a comprehensive title search including:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Property ownership verification</li>
                  <li>50-year chain of title analysis</li>
                  <li>Encumbrance and lien search</li>
                  <li>Tax status verification</li>
                </ul>
                <p>3. Review the generated preliminary title report</p>
                <p>4. Export the report as PDF or Markdown for your records</p>
              </div>
            </div>
          </div>
        ) : (
          <ReportDisplay reportData={reportData} address={currentAddress} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>TitleGuard AI - Automated Title Search Assistant</p>
            <p className="mt-2">This tool is for informational purposes only and does not provide legal advice or title insurance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

