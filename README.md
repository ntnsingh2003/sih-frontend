# MediKiosk Frontend (`sih-frontend`)

Smart AI-Powered Multilingual Digital Clinical Intake & Triage Kiosk Platform built for Smart India Hackathon (SIH).

## 🚀 Key Capabilities

- **Digital Patient Intake & Triage Kiosk**:
  - Multilingual voice-guided intake (English, Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada).
  - DPDP Act 2023 privacy guard with automated inactivity purge countdown.
  - Emergency clinical red-flag detection (Chest pain, breathlessness, stroke markers).
  - Allopathic & AYUSH triage pathways.
- **Doctor OPD Workstation**:
  - Live patient queue categorized by triage priority (🔴 RED Emergency, 🟡 YELLOW Urgent, 🟢 GREEN Standard).
  - AI clinical summary generation and physician review editor.
  - Prescription & Lab Report OCR intake with drag-and-drop file upload.
- **Report Sharing & ABDM Interoperability**:
  - Download official OPD Clinical Summary (PDF).
  - Send direct report to patient via WhatsApp & SMS.
  - Interactive scannable QR Code for mobile access.
  - Export HL7 FHIR R4 Bundle JSON for ABDM integration.

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Vanilla CSS Design Tokens & Modern Glassmorphic UI
- **Icons**: Lucide React
- **Audio & Animations**: Web Speech API, canvas-confetti

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
