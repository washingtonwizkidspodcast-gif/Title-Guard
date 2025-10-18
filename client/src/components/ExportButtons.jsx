import React from 'react';
import { PdfIcon, MarkdownIcon, CopyIcon, CheckIcon } from './icons';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

const ExportButtons = ({ reportData, address }) => {
  const [copied, setCopied] = React.useState(false);

  const generateMarkdown = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let markdown = `# Preliminary Title Report\n\n`;
    markdown += `**Prepared for:** Client\n`;
    markdown += `**Subject Property:** ${address}\n`;
    markdown += `**Generated on:** ${currentDate}\n\n`;
    
    markdown += `## CRITICAL DISCLAIMER\n\n`;
    markdown += `This is an informational, automated report based on a search of online public records. `;
    markdown += `It is NOT a substitute for a professional title examination or a policy of title insurance. `;
    markdown += `Data may be incomplete or inaccurate. All findings must be verified by a qualified `;
    markdown += `abstractor, attorney, or title company before any real estate transaction.\n\n`;

    markdown += `## Executive Summary\n\n`;
    markdown += `- **Current Owner:** ${reportData.assessorData.currentOwner}\n`;
    markdown += `- **Parcel ID (APN):** ${reportData.assessorData.parcelNumber}\n`;
    markdown += `- **Tax Status:** ${reportData.taxData.taxStatus === 'Paid' ? 'Current' : `DELINQUENT - $${reportData.taxData.amountOwed} Owed`}\n`;
    markdown += `- **Title Condition:** ${reportData.titleCondition}\n\n`;

    markdown += `## Property & Vesting Information\n\n`;
    markdown += `- **Property Address:** ${reportData.assessorData.propertySitus}\n`;
    markdown += `- **Current Vesting:** ${reportData.assessorData.currentOwner}\n`;
    markdown += `- **Vesting Deed:** ${reportData.chainOfTitle[0]?.deedType}, Document #${reportData.chainOfTitle[0]?.docNum}, Recorded ${reportData.chainOfTitle[0]?.date}\n`;
    markdown += `- **Legal Description:** ${reportData.assessorData.legalDescription}\n\n`;

    markdown += `## Chain of Title (50-Year History)\n\n`;
    reportData.chainOfTitle.forEach((entry, index) => {
      markdown += `${index + 1}. **${entry.owner}** from **${entry.from}** (${entry.deedType}, ${entry.date})\n`;
    });
    markdown += `\n**Chain Analysis:** ${reportData.chainAnalysis}\n\n`;

    markdown += `## Schedule B: Exceptions & Encumbrances\n\n`;
    if (reportData.encumbrances.length === 0) {
      markdown += `No significant encumbrances found.\n\n`;
    } else {
      reportData.encumbrances.forEach((encumbrance, index) => {
        markdown += `${index + 1}. **${encumbrance.type}**\n`;
        markdown += `   - **Parties:** ${encumbrance.parties.join(' and ')}\n`;
        markdown += `   - **Details:** Document #${encumbrance.documentNumber}, Recorded ${encumbrance.recordingDate}\n`;
        markdown += `   - **Status:** ${encumbrance.status}\n`;
        if (encumbrance.amount) {
          markdown += `   - **Amount:** ${encumbrance.amount}\n`;
        }
        if (encumbrance.description) {
          markdown += `   - **Description:** ${encumbrance.description}\n`;
        }
        markdown += `\n`;
      });
    }

    return markdown;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Preliminary Title Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Property info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Subject Property: ${address}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 20;

    // Disclaimer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CRITICAL DISCLAIMER:', 20, yPosition);
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    const disclaimerText = 'This is an informational, automated report based on a search of online public records. It is NOT a substitute for a professional title examination or a policy of title insurance. Data may be incomplete or inaccurate. All findings must be verified by a qualified abstractor, attorney, or title company before any real estate transaction.';
    const disclaimerLines = doc.splitTextToSize(disclaimerText, pageWidth - 40);
    doc.text(disclaimerLines, 20, yPosition);
    yPosition += disclaimerLines.length * 5 + 15;

    // Executive Summary
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', 20, yPosition);
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Current Owner: ${reportData.assessorData.currentOwner}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Parcel ID: ${reportData.assessorData.parcelNumber}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Tax Status: ${reportData.taxData.taxStatus === 'Paid' ? 'Current' : `DELINQUENT - $${reportData.taxData.amountOwed} Owed`}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Title Condition: ${reportData.titleCondition}`, 20, yPosition);
    yPosition += 15;

    // Chain of Title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Chain of Title', 20, yPosition);
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    reportData.chainOfTitle.forEach((entry, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${index + 1}. ${entry.owner} from ${entry.from} (${entry.deedType}, ${entry.date})`, 20, yPosition);
      yPosition += 6;
    });

    yPosition += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Chain Analysis:', 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    const analysisLines = doc.splitTextToSize(reportData.chainAnalysis, pageWidth - 40);
    doc.text(analysisLines, 20, yPosition);

    doc.save(`title-report-${address.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);
  };

  const exportToMarkdown = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    saveAs(blob, `title-report-${address.replace(/[^a-zA-Z0-9]/g, '-')}.md`);
  };

  const copyToClipboard = async () => {
    const markdown = generateMarkdown();
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={exportToPDF}
          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          <PdfIcon className="h-4 w-4 mr-2" />
          Export PDF
        </button>
        
        <button
          onClick={exportToMarkdown}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          <MarkdownIcon className="h-4 w-4 mr-2" />
          Export Markdown
        </button>
        
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon className="h-4 w-4 mr-2" />
              Copy Text
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExportButtons;


