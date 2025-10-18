# TitleGuard AI - Title Search Assistant

A sophisticated web application that performs comprehensive preliminary title searches based on property addresses. This application simulates the workflow of a Digital Title Abstractor and Real Estate Data Analyst.

## 🚀 Live Demo

**Deployed on Netlify**: [https://title-guard.netlify.app](https://title-guard.netlify.app)

## Features

- **Comprehensive Title Search**: Performs 50-year chain of title analysis
- **Encumbrance Detection**: Identifies mortgages, liens, easements, and other encumbrances
- **Tax Status Verification**: Checks property tax payment status
- **Professional Reports**: Generates structured preliminary title reports
- **Export Functionality**: Export reports as PDF
- **Standalone Application**: Runs entirely in the browser - no installation required
- **Mock Data**: Simulates county-level database queries with realistic data

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS (CDN)
- **PDF Export**: jsPDF
- **Deployment**: Netlify
- **Version Control**: GitHub

## Project Structure

```
Title-Guard/
├── index.html                   # Main application file
├── standalone.html              # Alternative standalone version
├── netlify.toml                 # Netlify deployment configuration
├── .gitignore                   # Git ignore file
├── README.md                    # Project documentation
├── package.json                 # Root package configuration
├── server/                      # Express API server (optional)
│   ├── package.json
│   └── index.js                 # Mock API endpoints
└── client/                      # React frontend (optional)
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        └── utils/
```

## Quick Start (No Installation Required)

1. **Open the Application**:
   - Simply open `index.html` in your web browser
   - Or visit the live demo: [https://title-guard.netlify.app](https://title-guard.netlify.app)

2. **Start Searching**:
   - Enter a property address
   - Click "Search Title"
   - View the comprehensive report
   - Export as PDF if needed

## Usage

### Test Addresses

The application includes mock data for these test addresses:

1. **123 Main St, Anytown, USA**
   - Current Owner: John Doe and Jane Doe
   - Contains: Open mortgage, utility easement, federal tax lien
   - Tax Status: Paid

2. **456 Oak Avenue, Springfield, IL**
   - Current Owner: Sarah Williams
   - Contains: Open mortgage, HOA lien, mechanic's lien
   - Tax Status: Delinquent ($3,247.50 owed)

### Search Process

1. Enter a property address in the search field
2. The system performs a comprehensive search:
   - **Phase 1**: Assessor lookup for parcel information
   - **Phase 2**: Build 50-year chain of title
   - **Phase 3**: Search encumbrances for each owner
   - **Phase 4**: Verify tax status
   - **Phase 5**: Generate final report

3. Review the generated preliminary title report
4. Export as PDF or Markdown for your records

## API Endpoints

### POST /api/assessor-lookup
Returns property information from county assessor database.

**Request**:
```json
{
  "address": "123 Main St, Anytown, USA"
}
```

**Response**:
```json
{
  "parcelNumber": "R12345-001-002",
  "currentOwner": "John Doe and Jane Doe",
  "legalDescription": "LOT 1, BLOCK 2, ANYTOWN ESTATES...",
  "propertySitus": "123 Main St, Anytown, USA"
}
```

### POST /api/recorder-search
Searches county recorder database for deeds and encumbrances.

**Request**:
```json
{
  "granteeName": "John Doe and Jane Doe",
  "searchType": "deed_chain" | "encumbrance"
}
```

### POST /api/tax-status
Returns property tax payment status.

**Request**:
```json
{
  "parcelNumber": "R12345-001-002"
}
```

## Report Structure

The generated reports follow the specification exactly:

1. **Executive Summary**: Current owner, parcel ID, tax status, title condition
2. **Property & Vesting Information**: Address, legal description, vesting details
3. **Chain of Title**: 50-year ownership history with analysis
4. **Schedule B**: Exceptions and encumbrances

## Deployment

### GitHub Setup
1. **Initialize Git Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: TitleGuard AI application"
   ```

2. **Connect to GitHub**:
   ```bash
   git remote add origin https://github.com/washingtonwizkidspodcast-gif/Title-Guard.git
   git branch -M main
   git push -u origin main
   ```

### Netlify Deployment
1. **Connect Repository**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Deploy Settings**:
   - Build command: Leave empty (static site)
   - Publish directory: `/` (root directory)
   - The `netlify.toml` file handles all configuration

3. **Custom Domain** (Optional):
   - Set up a custom domain in Netlify dashboard
   - Update the live demo URL in README

## Disclaimer

This application is for demonstration purposes only. It simulates title search processes but does not provide actual legal advice or title insurance. All data is mock data and should not be used for real estate transactions.

## License

This project is for educational and demonstration purposes.

