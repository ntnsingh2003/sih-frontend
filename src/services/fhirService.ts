// MediKiosk FHIR R4 & ABDM / ABHA Interoperability Service (08. Security & Interoperability)
import { Patient, ClinicalSummary, LabResult, Medication, ScannedDocument } from '../types/clinical';

export interface FHIRResource {
  resourceType: string;
  id: string;
  [key: string]: any;
}

export interface FHIRBundle {
  resourceType: 'Bundle';
  id: string;
  type: 'document' | 'collection';
  timestamp: string;
  entry: Array<{
    fullUrl: string;
    resource: FHIRResource;
  }>;
}

export function buildFHIRBundle(
  patient: Patient,
  summary: ClinicalSummary,
  labs: LabResult[],
  medications: Medication[],
  documents: ScannedDocument[]
): FHIRBundle {
  const bundleId = `bundle-medikiosk-${summary.id}`;
  const timestamp = new Date().toISOString();

  const entries: Array<{ fullUrl: string; resource: FHIRResource }> = [];

  // 1. Patient Resource
  const patientResource: FHIRResource = {
    resourceType: 'Patient',
    id: patient.id,
    identifier: [
      {
        system: 'https://healthid.ndhm.gov.in/abha',
        value: patient.abhaReference || '91-4928-1102-4912'
      },
      {
        system: 'https://hospital.emr.org/mrn',
        value: patient.hospitalPatientId
      }
    ],
    name: [
      {
        use: 'official',
        text: patient.name
      }
    ],
    gender: patient.gender.toLowerCase(),
    birthDate: patient.dateOfBirth,
    telecom: [
      {
        system: 'phone',
        value: patient.phone
      }
    ]
  };
  entries.push({ fullUrl: `urn:uuid:${patient.id}`, resource: patientResource });

  // 2. Encounter Resource
  const encounterId = `enc-${summary.sessionId}`;
  const encounterResource: FHIRResource = {
    resourceType: 'Encounter',
    id: encounterId,
    status: 'in-progress',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'AMB',
      display: 'ambulatory'
    },
    subject: {
      reference: `Patient/${patient.id}`,
      display: patient.name
    },
    period: {
      start: summary.createdAt
    },
    reasonCode: [
      {
        text: summary.chiefComplaint
      }
    ],
    note: summary.consultationNotes ? [
      {
        text: `Attending Physician Notes: ${summary.consultationNotes}`
      }
    ] : undefined
  };
  entries.push({ fullUrl: `urn:uuid:${encounterId}`, resource: encounterResource });

  // 3. Condition Resource (Chief Complaint / HPI)
  const conditionId = `cond-${summary.id}`;
  const conditionResource: FHIRResource = {
    resourceType: 'Condition',
    id: conditionId,
    clinicalStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: 'active'
        }
      ]
    },
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-category',
            code: 'encounter-diagnosis'
          }
        ]
      }
    ],
    code: {
      text: summary.chiefComplaint
    },
    subject: {
      reference: `Patient/${patient.id}`
    },
    encounter: {
      reference: `Encounter/${encounterId}`
    },
    note: [
      {
        text: summary.hpiNarrative
      }
    ]
  };
  entries.push({ fullUrl: `urn:uuid:${conditionId}`, resource: conditionResource });

  // 4. MedicationStatement Resources
  medications.forEach((med, idx) => {
    const medId = `med-stmt-${idx}-${patient.id}`;
    entries.push({
      fullUrl: `urn:uuid:${medId}`,
      resource: {
        resourceType: 'MedicationStatement',
        id: medId,
        status: 'active',
        medicationCodeableConcept: {
          text: med.name
        },
        subject: {
          reference: `Patient/${patient.id}`
        },
        dosage: [
          {
            text: `${med.dosage}, ${med.frequency}`
          }
        ]
      }
    });
  });

  // 5. Observation Resources (Lab Results)
  labs.forEach((lab, idx) => {
    const obsId = `obs-lab-${idx}-${patient.id}`;
    entries.push({
      fullUrl: `urn:uuid:${obsId}`,
      resource: {
        resourceType: 'Observation',
        id: obsId,
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'laboratory'
              }
            ]
          }
        ],
        code: {
          text: lab.testName
        },
        subject: {
          reference: `Patient/${patient.id}`
        },
        effectiveDateTime: lab.testDate,
        valueQuantity: {
          value: parseFloat(lab.value) || 0,
          unit: lab.unit
        },
        interpretation: lab.abnormalFlag
          ? [
              {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                    code: 'A',
                    display: 'Abnormal'
                  }
                ]
              }
            ]
          : undefined
      }
    });
  });

  // 6. DocumentReference Resource
  documents.forEach((doc, idx) => {
    const docRefId = `docref-${idx}-${doc.id}`;
    entries.push({
      fullUrl: `urn:uuid:${docRefId}`,
      resource: {
        resourceType: 'DocumentReference',
        id: docRefId,
        status: 'current',
        type: {
          text: doc.docType
        },
        subject: {
          reference: `Patient/${patient.id}`
        },
        date: doc.uploadedAt,
        description: `Uploaded ${doc.docType}: ${doc.fileName} (${doc.fileSize})`,
        content: [
          {
            attachment: {
              contentType: 'application/pdf',
              title: doc.fileName
            }
          }
        ]
      }
    });
  });

  return {
    resourceType: 'Bundle',
    id: bundleId,
    type: 'collection',
    timestamp,
    entry: entries
  };
}

export function downloadFHIRJSON(bundle: FHIRBundle): void {
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = url;
  downloadAnchor.download = `${bundle.id}.json`;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
  URL.revokeObjectURL(url);
}

export function exportClinicalSummaryPDF(
  patient: Patient,
  summary: ClinicalSummary,
  labs: LabResult[],
  medications: Medication[]
): void {
  const printWindow = window.open('', '_blank', 'width=900,height=750');
  if (!printWindow) {
    alert('Please allow popups to print/export the clinical summary.');
    return;
  }

  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>OPD Summary - ${patient.name} (${patient.hospitalPatientId})</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; color: #1e293b; max-width: 800px; margin: auto; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
          .brand { font-size: 22px; font-weight: bold; color: #065f46; }
          .subbrand { font-size: 11px; color: #64748b; }
          .patient-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 13px; }
          .section-title { font-size: 14px; font-weight: bold; color: #047857; margin-top: 14px; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
          .content-box { background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; font-size: 13px; line-height: 1.5; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 6px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
          th { background: #f1f5f9; }
          .abnormal { color: #dc2626; font-weight: bold; }
          .footer { margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 12px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
          .btn-print { background: #059669; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; }
          @media print { .no-print { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 16px; text-align: right;">
          <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
        </div>
        <div class="header">
          <div>
            <div class="brand">MediKiosk Clinical OPD Summary</div>
            <div class="subbrand">AIIMS OPD • Integrated Clinical Triage & ABDM Gateway</div>
          </div>
          <div style="text-align: right; font-size: 12px;">
            <div><strong>Date:</strong> ${dateStr}</div>
            <div><strong>Status:</strong> ${summary.status}</div>
          </div>
        </div>

        <div class="patient-box">
          <div><strong>Name:</strong> ${patient.name}</div>
          <div><strong>Age / Gender:</strong> ${age} Yrs / ${patient.gender}</div>
          <div><strong>MRN:</strong> ${patient.hospitalPatientId}</div>
          <div><strong>ABHA ID:</strong> ${patient.abhaReference || 'Unlinked'}</div>
          <div><strong>Phone:</strong> ${patient.phone}</div>
          <div><strong>Token:</strong> TK-${patient.id.slice(-3)}</div>
        </div>

        <div class="section-title">1. Chief Complaint & History of Present Illness (HPI)</div>
        <div class="content-box">
          <strong>${summary.chiefComplaint}</strong><br/>
          ${summary.hpiNarrative}
        </div>

        <div class="section-title">2. Past Medical & Surgical History</div>
        <div class="content-box">${summary.pastMedicalSurgical || 'None reported.'}</div>

        <div class="section-title">3. Active Medications & Regimen</div>
        <div class="content-box">
          ${medications.length > 0 ? `
            <table>
              <thead><tr><th>Medication</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr></thead>
              <tbody>
                ${medications.map(m => `<tr><td><strong>${m.name}</strong></td><td>${m.dosage}</td><td>${m.frequency}</td><td>${m.duration || '-'}</td></tr>`).join('')}
              </tbody>
            </table>
          ` : 'No active medications on record.'}
        </div>

        ${labs.length > 0 ? `
          <div class="section-title">4. Diagnostic Laboratory Results</div>
          <div class="content-box">
            <table>
              <thead><tr><th>Test Name</th><th>Result Value</th><th>Reference Range</th><th>Status</th></tr></thead>
              <tbody>
                ${labs.map(l => `<tr><td>${l.testName}</td><td class="${l.abnormalFlag ? 'abnormal' : ''}">${l.value} ${l.unit}</td><td>${l.referenceRange}</td><td class="${l.abnormalFlag ? 'abnormal' : ''}">${l.abnormalFlag ? 'ABNORMAL' : 'NORMAL'}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        ${summary.consultationNotes ? `
          <div class="section-title">5. Attending Physician Consultation Notes & Diagnosis</div>
          <div class="content-box">${summary.consultationNotes}</div>
        ` : ''}

        <div class="footer">
          <div>Generated by MediKiosk • ABDM Interoperable FHIR R4 Bundle</div>
          <div>Physician Signature: _______________________</div>
        </div>

        <script>
          setTimeout(() => { window.print(); }, 400);
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

export function exportQueueCSV(patients: any[]): void {
  const headers = ['Token', 'Patient Name', 'Age', 'Gender', 'Phone', 'ABHA ID', 'Priority', 'Chief Complaint', 'Mode', 'Status'];
  const rows = patients.map(p => {
    const age = new Date().getFullYear() - new Date(p.patient.dateOfBirth).getFullYear();
    return [
      p.session.tokenNumber,
      `"${p.patient.name}"`,
      age,
      p.patient.gender,
      p.patient.phone,
      p.patient.abhaReference || 'Unlinked',
      p.session.triagePriority,
      `"${(p.summary.chiefComplaint || '').replace(/"/g, '""')}"`,
      p.session.mode,
      p.summary.status
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `medikiosk_opd_queue_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
