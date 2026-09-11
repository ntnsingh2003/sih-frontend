-- ====================================================================
-- MediKiosk – AI-Powered Digital Clinical Intake Platform
-- Module 05: Database Architecture & PostgreSQL Schema
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
CREATE TYPE user_role AS ENUM ('PATIENT', 'DOCTOR', 'NURSE', 'TRIAGE_STAFF', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE triage_priority AS ENUM ('GREEN', 'YELLOW', 'RED');
CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE intake_mode AS ENUM ('ALLOPATHY', 'AYUSH');
CREATE TYPE consent_status AS ENUM ('GRANTED', 'REVOKED');
CREATE TYPE session_status AS ENUM ('IDENTIFIED', 'CONSENTED', 'CONVERSING', 'SCANNING', 'SUBMITTED', 'TRIAGED', 'COMPLETED');
CREATE TYPE ocr_status_type AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE summary_status_type AS ENUM ('PENDING_REVIEW', 'CONFIRMED', 'REJECTED', 'PUSHED_TO_EMR');

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role user_role NOT NULL DEFAULT 'PATIENT',
    password_hash VARCHAR(255),
    license_number VARCHAR(100),
    department VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Patients Table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_patient_id VARCHAR(100) UNIQUE NOT NULL,
    abha_reference VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender gender_type NOT NULL,
    phone VARCHAR(20),
    preferred_language VARCHAR(10) DEFAULT 'en',
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Patient Profiles
CREATE TABLE patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    blood_group VARCHAR(10),
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Consents Table
CREATE TABLE consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL,
    purpose TEXT NOT NULL,
    version VARCHAR(20) NOT NULL,
    status consent_status NOT NULL DEFAULT 'GRANTED',
    audio_explained BOOLEAN DEFAULT TRUE,
    signature_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMPTZ
);

-- 5. Sessions Table (Kiosk Intake Encounters)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    token_number VARCHAR(50) NOT NULL,
    mode intake_mode DEFAULT 'ALLOPATHY',
    status session_status DEFAULT 'IDENTIFIED',
    triage_priority triage_priority DEFAULT 'GREEN',
    priority_alert TEXT,
    kiosk_id VARCHAR(50) NOT NULL,
    start_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMPTZ
);

-- 6. Conversations Table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Conversation Messages Table
CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL, -- 'SYSTEM' or 'PATIENT'
    text TEXT NOT NULL,
    input_mode VARCHAR(20) DEFAULT 'VOICE', -- 'VOICE', 'TOUCH_TAP', 'TEXT'
    audio_url TEXT,
    structured_extraction JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Clinical Histories Table
CREATE TABLE clinical_histories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    chief_complaint TEXT NOT NULL,
    history_present_illness JSONB NOT NULL,
    past_medical_history TEXT[],
    past_surgical_history TEXT[],
    family_history TEXT[],
    personal_history JSONB,
    review_of_systems JSONB,
    ayush_assessment JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Symptoms Table
CREATE TABLE symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinical_history_id UUID REFERENCES clinical_histories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    severity INT CHECK (severity BETWEEN 1 AND 10),
    duration VARCHAR(100),
    body_location VARCHAR(100),
    radiation VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Medical Conditions Table
CREATE TABLE medical_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    condition_name VARCHAR(255) NOT NULL,
    icd10_code VARCHAR(50),
    diagnosed_year INT,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- 11. Allergies Table
CREATE TABLE allergies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    allergen VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    reaction TEXT,
    severity VARCHAR(50) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. Medications Table
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    source VARCHAR(50) DEFAULT 'PATIENT_REPORTED',
    source_document_id UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. Investigations Table
CREATE TABLE investigations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    investigation_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    ordering_doctor VARCHAR(255),
    facility_name VARCHAR(255),
    investigation_date DATE,
    findings TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. Lab Results Table
CREATE TABLE lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    value VARCHAR(100) NOT NULL,
    unit VARCHAR(50),
    reference_range VARCHAR(100),
    abnormal_flag BOOLEAN DEFAULT FALSE,
    test_date DATE,
    source_document_id UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 15. Documents Table (File metadata rule: binaries in object storage)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    doc_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    checksum_sha256 VARCHAR(64) NOT NULL,
    ocr_status ocr_status_type DEFAULT 'PENDING',
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 16. Document Pages Table
CREATE TABLE document_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    image_storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 17. OCR Results Table
CREATE TABLE ocr_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    extracted_text TEXT,
    confidence_score NUMERIC(4,3),
    processing_duration_ms INT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 18. Medical Entities Table (Extracted via NER)
CREATE TABLE medical_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    raw_text TEXT NOT NULL,
    normalized_text TEXT,
    confidence NUMERIC(4,3),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 19. Clinical Timeline Table
CREATE TABLE clinical_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source_doc_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 20. Red Flags Table
CREATE TABLE red_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    severity triage_priority NOT NULL DEFAULT 'RED',
    title VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    trigger_symptom TEXT NOT NULL,
    action_recommended TEXT NOT NULL,
    triggered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMPTZ
);

-- 21. Clinical Summaries Table
CREATE TABLE clinical_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    chief_complaint TEXT NOT NULL,
    hpi_narrative TEXT NOT NULL,
    past_medical_surgical TEXT,
    drug_and_allergy_history TEXT,
    family_personal_history TEXT,
    review_of_systems_summary TEXT,
    prior_investigations_summary TEXT,
    ayush_summary TEXT,
    suggested_differentials JSONB,
    status summary_status_type DEFAULT 'PENDING_REVIEW',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 22. Doctor Reviews Table
CREATE TABLE doctor_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    summary_id UUID NOT NULL REFERENCES clinical_summaries(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES users(id),
    consultation_notes TEXT NOT NULL,
    differential_diagnoses TEXT[],
    final_plan TEXT,
    prescriptions_added TEXT[],
    approved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    emr_sync_status VARCHAR(50) DEFAULT 'SYNCED',
    fhir_bundle_id VARCHAR(100)
);

-- 23. ABHA Links Table
CREATE TABLE abha_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    abha_number VARCHAR(50) UNIQUE NOT NULL,
    abha_address VARCHAR(100) UNIQUE NOT NULL,
    kyc_status VARCHAR(50) DEFAULT 'VERIFIED',
    linked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 24. Hospital Records Table
CREATE TABLE hospital_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    mrn_number VARCHAR(100) NOT NULL,
    hospital_name VARCHAR(255) NOT NULL,
    encounter_type VARCHAR(50),
    admitted_at TIMESTAMPTZ,
    discharged_at TIMESTAMPTZ
);

-- 25. Audit Logs Table (Module 08 Security)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_role user_role,
    patient_id UUID,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    device_ip VARCHAR(50),
    outcome VARCHAR(50) NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_sessions_patient ON sessions(patient_id);
CREATE INDEX idx_messages_conversation ON conversation_messages(conversation_id);
CREATE INDEX idx_documents_patient ON documents(patient_id);
CREATE INDEX idx_timeline_patient ON clinical_timeline(patient_id, event_date);
CREATE INDEX idx_audit_timestamp ON audit_logs(created_at);
CREATE INDEX idx_red_flags_session ON red_flags(session_id);
