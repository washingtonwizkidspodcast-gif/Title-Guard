const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for different properties
const mockProperties = {
  "123 Main St, Anytown, USA": {
    parcelNumber: "R12345-001-002",
    currentOwner: "John Doe and Jane Doe",
    legalDescription: "LOT 1, BLOCK 2, ANYTOWN ESTATES, ACCORDING TO THE PLAT THEREOF, AS RECORDED IN PLAT BOOK 15, PAGE 42, OF THE PUBLIC RECORDS OF ANYCOUNTY, USA.",
    propertySitus: "123 Main St, Anytown, USA",
    ownershipChain: [
      { owner: "John Doe and Jane Doe", from: "Robert Seller", deedType: "Warranty Deed", date: "2023-05-15", docNum: "2023-00456" },
      { owner: "Robert Seller", from: "Emily Investor", deedType: "Grant Deed", date: "2010-03-22", docNum: "2010-00123" },
      { owner: "Emily Investor", from: "Historic Holdings LLC", deedType: "Warranty Deed", date: "1995-08-10", docNum: "1995-00567" },
      { owner: "Historic Holdings LLC", from: "Margaret Johnson", deedType: "Quitclaim Deed", date: "1978-12-05", docNum: "1978-00890" },
      { owner: "Margaret Johnson", from: "William Johnson", deedType: "Warranty Deed", date: "1965-04-18", docNum: "1965-00234" }
    ],
    encumbrances: {
      "John Doe and Jane Doe": [
        { type: "Mortgage", parties: ["John Doe and Jane Doe", "Big Bank Inc."], date: "2023-05-15", docNum: "2023-00457", status: "Potentially Open" }
      ],
      "Robert Seller": [
        { type: "Mortgage", parties: ["Robert Seller", "Community Bank"], date: "2010-03-22", docNum: "2010-00124", status: "Satisfied", releaseDoc: "2015-06-10", releaseNum: "2015-00345" },
        { type: "Utility Easement", parties: ["Electric Company"], date: "2010-05-15", docNum: "2010-00189", status: "Active", description: "Grants access to the rear 10 feet of the property" }
      ],
      "Emily Investor": [
        { type: "Federal Tax Lien", parties: ["IRS", "Emily Investor"], date: "2012-08-01", docNum: "2012-00987", status: "Potentially Open", amount: "$15,200" }
      ]
    },
    taxStatus: "Paid",
    amountOwed: "0.00",
    taxLiens: "None"
  },
  "456 Oak Avenue, Springfield, IL": {
    parcelNumber: "R67890-003-001",
    currentOwner: "Sarah Williams",
    legalDescription: "LOT 3, BLOCK 1, OAK GROVE SUBDIVISION, ACCORDING TO THE PLAT THEREOF, AS RECORDED IN PLAT BOOK 8, PAGE 15, OF THE PUBLIC RECORDS OF SPRINGFIELD COUNTY, ILLINOIS.",
    propertySitus: "456 Oak Avenue, Springfield, IL",
    ownershipChain: [
      { owner: "Sarah Williams", from: "Michael Thompson", deedType: "Warranty Deed", date: "2021-09-12", docNum: "2021-00789" },
      { owner: "Michael Thompson", from: "Linda Davis", deedType: "Grant Deed", date: "2005-11-30", docNum: "2005-00456" },
      { owner: "Linda Davis", from: "James Davis", deedType: "Warranty Deed", date: "1988-07-14", docNum: "1988-00234" },
      { owner: "James Davis", from: "Estate of Robert Davis", deedType: "Personal Representative Deed", date: "1972-03-08", docNum: "1972-00112" }
    ],
    encumbrances: {
      "Sarah Williams": [
        { type: "Mortgage", parties: ["Sarah Williams", "First National Bank"], date: "2021-09-12", docNum: "2021-00790", status: "Potentially Open" },
        { type: "HOA Lien", parties: ["Oak Grove HOA", "Sarah Williams"], date: "2023-01-15", docNum: "2023-00045", status: "Potentially Open", amount: "$2,400" }
      ],
      "Michael Thompson": [
        { type: "Mortgage", parties: ["Michael Thompson", "Springfield Credit Union"], date: "2005-11-30", docNum: "2005-00457", status: "Satisfied", releaseDoc: "2018-04-22", releaseNum: "2018-00234" }
      ],
      "Linda Davis": [
        { type: "Mechanic's Lien", parties: ["ABC Construction", "Linda Davis"], date: "1990-05-20", docNum: "1990-00123", status: "Potentially Open", amount: "$8,500" }
      ]
    },
    taxStatus: "Delinquent",
    amountOwed: "3,247.50",
    taxLiens: "Tax lien filed 2023-03-01, Document #2023-00156"
  }
};

// Helper function to find property by address
function findPropertyByAddress(address) {
  const normalizedAddress = address.toLowerCase().trim();
  for (const [key, value] of Object.entries(mockProperties)) {
    if (key.toLowerCase().includes(normalizedAddress.split(',')[0]) || 
        normalizedAddress.includes(key.toLowerCase().split(',')[0])) {
      return { address: key, data: value };
    }
  }
  return null;
}

// Helper function to find owner in chain
function findOwnerInChain(propertyData, ownerName) {
  return propertyData.ownershipChain.find(entry => 
    entry.owner.toLowerCase().includes(ownerName.toLowerCase()) ||
    ownerName.toLowerCase().includes(entry.owner.toLowerCase())
  );
}

// API Routes

// POST /api/assessor-lookup
app.post('/api/assessor-lookup', (req, res) => {
  const { address } = req.body;
  
  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  const property = findPropertyByAddress(address);
  
  if (!property) {
    return res.status(404).json({ error: 'Property not found in database' });
  }

  const { data } = property;
  
  res.json({
    parcelNumber: data.parcelNumber,
    currentOwner: data.currentOwner,
    legalDescription: data.legalDescription,
    propertySitus: data.propertySitus
  });
});

// POST /api/recorder-search
app.post('/api/recorder-search', (req, res) => {
  const { granteeName, searchType } = req.body;
  
  if (!granteeName || !searchType) {
    return res.status(400).json({ error: 'Grantee name and search type are required' });
  }

  // Find property that contains this owner
  let foundProperty = null;
  let ownerEntry = null;
  
  for (const [address, data] of Object.entries(mockProperties)) {
    ownerEntry = findOwnerInChain(data, granteeName);
    if (ownerEntry) {
      foundProperty = data;
      break;
    }
  }

  if (!foundProperty || !ownerEntry) {
    return res.status(404).json({ error: 'Owner not found in any property chain' });
  }

  if (searchType === 'deed_chain') {
    // Return the deed that transferred TO this owner
    const deedDocument = {
      documentType: ownerEntry.deedType,
      grantor: ownerEntry.from,
      grantee: ownerEntry.owner,
      recordingDate: ownerEntry.date,
      documentNumber: ownerEntry.docNum
    };
    
    res.json({ documents: [deedDocument] });
    
  } else if (searchType === 'encumbrance') {
    // Return encumbrances for this owner
    const encumbrances = foundProperty.encumbrances[ownerEntry.owner] || [];
    
    const documents = encumbrances.map(enc => ({
      documentType: enc.type,
      parties: enc.parties,
      recordingDate: enc.date,
      documentNumber: enc.docNum,
      status: enc.status,
      amount: enc.amount,
      description: enc.description,
      releaseDocument: enc.releaseDoc,
      releaseNumber: enc.releaseNum
    }));
    
    res.json({ documents });
    
  } else {
    res.status(400).json({ error: 'Invalid search type. Use "deed_chain" or "encumbrance"' });
  }
});

// POST /api/tax-status
app.post('/api/tax-status', (req, res) => {
  const { parcelNumber } = req.body;
  
  if (!parcelNumber) {
    return res.status(400).json({ error: 'Parcel number is required' });
  }

  // Find property by parcel number
  let foundProperty = null;
  for (const [address, data] of Object.entries(mockProperties)) {
    if (data.parcelNumber === parcelNumber) {
      foundProperty = data;
      break;
    }
  }

  if (!foundProperty) {
    return res.status(404).json({ error: 'Parcel number not found' });
  }

  res.json({
    taxStatus: foundProperty.taxStatus,
    amountOwed: foundProperty.amountOwed,
    taxLiens: foundProperty.taxLiens
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Title Search Assistant API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Title Search Assistant API running on port ${PORT}`);
  console.log(`Available properties for testing:`);
  Object.keys(mockProperties).forEach(address => {
    console.log(`  - ${address}`);
  });
});

