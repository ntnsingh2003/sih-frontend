import React, { useState } from 'react';
import { useClinical, DEMO_STAFF_ACCOUNTS, StaffUser } from '../../context/ClinicalContext';
import { UserRole } from '../../types/clinical';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Stethoscope,
  User,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  UserPlus,
  Activity,
  HeartPulse,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginStaff, setActiveView, currentUser, logoutStaff } = useClinical();

  // Mode: Sign In vs Create Account
  const [authAction, setAuthAction] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');

  // ---------------- Sign In Form State ---------------- //
  const [email, setEmail] = useState('dr.arun@aiims.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // ---------------- Create Account Form State ---------------- //
  // Staff Registration
  const [regStaffName, setRegStaffName] = useState('');
  const [regStaffEmail, setRegStaffEmail] = useState('');
  const [regStaffRole, setRegStaffRole] = useState<UserRole>('DOCTOR');
  const [regStaffDept, setRegStaffDept] = useState('General Medicine & Acute Care');
  const [regStaffLicense, setRegStaffLicense] = useState('');
  const [regStaffPassword, setRegStaffPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick preset autofill helper
  const handleSelectStaffPreset = (preset: StaffUser) => {
    setEmail(preset.email);
    setPassword('password123');
  };

  // Handle Staff Sign In
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const matched = DEMO_STAFF_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
      const userToLogin: StaffUser = matched || {
        id: `usr-${Date.now()}`,
        name: email.includes('dr') ? 'Dr. Staff Physician' : 'Clinical Staff Nurse',
        email: email,
        role: email.includes('nurse') ? 'NURSE' : email.includes('admin') ? 'ADMIN' : 'DOCTOR',
        licenseNumber: 'NMC/2024/99182',
        department: 'Cardiology & Emergency Triage'
      };

      loginStaff(userToLogin);
    }, 400);
  };

  // Handle Staff Registration / Create Account
  const handleStaffRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newStaff: StaffUser = {
        id: `usr-${Date.now()}`,
        name: regStaffName || (regStaffRole === 'DOCTOR' ? 'Dr. Clinical Physician' : 'Staff Clinical Officer'),
        email: regStaffEmail,
        role: regStaffRole,
        licenseNumber: regStaffLicense || 'NMC/2026/NEW',
        department: regStaffDept
      };

      setSuccessMessage(`Account created for ${newStaff.name}! Signing in...`);
      setTimeout(() => {
        loginStaff(newStaff);
      }, 500);
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.86) 0%, rgba(240, 253, 250, 0.82) 50%, rgba(241, 245, 249, 0.88) 100%), url('/hospital_bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#0f172a',
      overflow: 'hidden'
    }}>
      
      {/* Animated Subtle Floating Background Elements */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '8%',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        animation: 'floatSlow 8s ease-in-out infinite alternate'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.16) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        animation: 'floatSlow 10s ease-in-out infinite alternate-reverse'
      }} />

      {/* Centered White Glassmorphic Card Container */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem', zIndex: 10 }}>
        <div style={{
          width: '100%',
          maxWidth: '470px',
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '2.4rem 2.2rem',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.16), 0 0 30px rgba(16, 185, 129, 0.1)',
          position: 'relative'
        }}>

          {/* Animated Heartbeat ECG Line at top of Card */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '20px',
            right: '20px',
            height: '3px',
            background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)'
          }} />

          {/* Back to Landing Page button */}
          <button
            type="button"
            onClick={() => setActiveView('LANDING')}
            style={{
              position: 'absolute',
              top: '18px',
              left: '20px',
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '0.35rem 0.6rem',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0f172a';
              e.currentTarget.style.background = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <ArrowLeft size={15} />
            <span>Home</span>
          </button>

          {/* Card Top Title */}
          <div style={{ textAlign: 'center', marginBottom: '1.6rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              border: '1.5px solid #a7f3d0',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)'
            }}>
              <HeartPulse size={24} color="#059669" />
            </div>
            <h1 style={{ fontSize: '1.55rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.025em' }}>
              {authAction === 'SIGN_IN' ? 'Hospital Staff Portal' : 'Register Clinical Staff'}
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '0.3rem' }}>
              {authAction === 'SIGN_IN'
                ? 'Sign in to access Doctor OPD Workstation & Triage Queue'
                : 'Create attending physician or nursing staff account'}
            </p>
          </div>

          {/* Success Alert Banner */}
          {successMessage && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: '12px',
              padding: '0.7rem 0.9rem',
              marginBottom: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: '#065f46',
              fontWeight: 700
            }}>
              <CheckCircle2 size={17} color="#059669" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Logged In Status Badge */}
          {currentUser && !successMessage && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '0.55rem 0.85rem',
              marginBottom: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#059669' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ color: '#1e293b' }}>Signed in as <strong style={{ color: '#059669' }}>{currentUser.name}</strong></span>
              </div>
              <button
                onClick={logoutStaff}
                style={{
                  color: '#ef4444',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Sign out
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* 1. SIGN IN - STAFF FORM                                        */}
          {/* ============================================================== */}
          {authAction === 'SIGN_IN' && (
            <form onSubmit={handleStaffLogin}>
              {/* Quick 1-Click Demo Pills */}
              <div style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Quick 1-Click Demo:
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>AIIMS OPD</span>
                </div>
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  {DEMO_STAFF_ACCOUNTS.slice(0, 2).map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSelectStaffPreset(acc)}
                      style={{
                        flex: 1,
                        padding: '0.5rem 0.65rem',
                        background: email === acc.email ? '#ecfdf5' : '#ffffff',
                        border: email === acc.email ? '1.5px solid #10b981' : '1px solid #cbd5e1',
                        borderRadius: '10px',
                        color: email === acc.email ? '#065f46' : '#334155',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {acc.name.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Address */}
              <div style={{ marginBottom: '1.05rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Institutional Email / HPR ID
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={17} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. dr.arun@aiims.edu"
                    style={{
                      width: '100%',
                      padding: '0.76rem 0.9rem 0.76rem 2.45rem',
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '12px',
                      color: '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.03)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                    Password / Medical PIN
                  </label>
                  <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, cursor: 'pointer' }}>
                    Forgot?
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    style={{
                      width: '100%',
                      padding: '0.76rem 2.6rem 0.76rem 2.45rem',
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '12px',
                      color: '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.03)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.4rem' }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#10b981', cursor: 'pointer', width: '15px', height: '15px' }}
                />
                <label htmlFor="rememberMe" style={{ fontSize: '0.82rem', color: '#475569', cursor: 'pointer' }}>
                  Keep me signed in on this hospital device
                </label>
              </div>

              {/* Sign In Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.92rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)',
                  transition: 'all 0.18s ease'
                }}
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Workstation</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ============================================================== */}
          {/* 2. SIGN UP - STAFF REGISTRATION                                */}
          {/* ============================================================== */}
          {authAction === 'SIGN_UP' && (
            <form onSubmit={handleStaffRegister}>
              <div style={{ marginBottom: '0.9rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Full Name with Title
                </label>
                <input
                  type="text"
                  value={regStaffName}
                  onChange={(e) => setRegStaffName(e.target.value)}
                  required
                  placeholder="e.g. Dr. Sneha Roy, MD"
                  style={{
                    width: '100%',
                    padding: '0.72rem 0.85rem',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '0.9rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Institutional Email
                </label>
                <input
                  type="email"
                  value={regStaffEmail}
                  onChange={(e) => setRegStaffEmail(e.target.value)}
                  required
                  placeholder="name@hospital.org"
                  style={{
                    width: '100%',
                    padding: '0.72rem 0.85rem',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Role
                  </label>
                  <select
                    value={regStaffRole}
                    onChange={(e) => setRegStaffRole(e.target.value as UserRole)}
                    style={{
                      width: '100%',
                      padding: '0.72rem 0.6rem',
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '10px',
                      color: '#0f172a',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    <option value="DOCTOR">Doctor</option>
                    <option value="NURSE">Nurse</option>
                    <option value="TRIAGE_STAFF">Triage Staff</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Department
                  </label>
                  <select
                    value={regStaffDept}
                    onChange={(e) => setRegStaffDept(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.72rem 0.6rem',
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '10px',
                      color: '#0f172a',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    <option value="Cardiology & Emergency Triage">Cardiology</option>
                    <option value="General Medicine & Acute Care">General Medicine</option>
                    <option value="AYUSH & Integrative Medicine">AYUSH</option>
                    <option value="Pediatric Emergency Triage">Pediatrics</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '0.9rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  NMC Registration Number
                </label>
                <input
                  type="text"
                  value={regStaffLicense}
                  onChange={(e) => setRegStaffLicense(e.target.value)}
                  placeholder="e.g. NMC/2026/88921"
                  style={{
                    width: '100%',
                    padding: '0.72rem 0.85rem',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Create Password
                </label>
                <input
                  type="password"
                  value={regStaffPassword}
                  onChange={(e) => setRegStaffPassword(e.target.value)}
                  required
                  placeholder="Minimum 6 characters"
                  style={{
                    width: '100%',
                    padding: '0.72rem 0.85rem',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.92rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)'
                }}
              >
                <UserPlus size={17} />
                <span>Create Staff Account</span>
              </button>
            </form>
          )}



          {/* Toggle between Sign In and Create Account */}
          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.84rem',
            color: '#475569'
          }}>
            {authAction === 'SIGN_IN' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthAction('SIGN_UP');
                    setSuccessMessage(null);
                  }}
                  style={{
                    color: '#059669',
                    fontWeight: 800,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Create Account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthAction('SIGN_IN');
                    setSuccessMessage(null);
                  }}
                  style={{
                    color: '#059669',
                    fontWeight: 800,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Sign In
                </button>
              </span>
            )}
          </div>

          {/* Bottom Security Note */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            fontSize: '0.74rem',
            color: '#64748b'
          }}>
            <ShieldCheck size={14} color="#059669" />
            <span>ABDM Certified & DPDP Act 2023 Compliant</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
