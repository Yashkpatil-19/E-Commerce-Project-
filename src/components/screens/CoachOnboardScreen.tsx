'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlanId } from '../../types';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  User, 
  Lock, 
  FileText, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const CoachOnboardScreen: React.FC = () => {
  const { currentUser, signup, submitCoachApplication, navigateTo } = useApp();

  // Multi-step state: 1 (Account), 2 (KYC & Verification), 3 (Under Review)
  const [step, setStep] = useState<1 | 2 | 3>(() => {
    if (currentUser?.role === 'coach' && (currentUser.coachStatus === 'pending' || currentUser.coachStatus === 'unverified')) {
      return 2;
    }
    return 1;
  });

  // Step 1 Form fields
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('Password@123');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');

  // Step 2 Form fields
  const [idType, setIdType] = useState<'Aadhaar' | 'PAN' | 'Passport' | 'Driving Licence'>('Aadhaar');
  const [idNumber, setIdNumber] = useState('123456789012');
  const [isIdMasked, setIsIdMasked] = useState(true);

  // File uploads (store filename + size only, no parsing)
  const [certFile, setCertFile] = useState<{ name: string; size: number } | null>({
    name: 'CSCS_Certification_2025.pdf',
    size: 2450000
  });
  const [addressFile, setAddressFile] = useState<{ name: string; size: number } | null>({
    name: 'Electricity_Bill_Address.pdf',
    size: 1120000
  });
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80');

  const [experienceYears, setExperienceYears] = useState(6);
  const [selectedSpecializations, setSelectedSpecializations] = useState<PlanId[]>(['build-muscle', 'get-fit']);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Step 1: Create coach account
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    await signup(name, email, password, undefined, undefined, 'coach');
    setStep(2);
  };

  const toggleSpecialization = (plan: PlanId) => {
    setSelectedSpecializations(prev => 
      prev.includes(plan) ? prev.filter(p => p !== plan) : [...prev, plan]
    );
  };

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertFile({ name: file.name, size: file.size });
    }
  };

  const handleAddressUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAddressFile({ name: file.name, size: file.size });
    }
  };

  // Masked ID preview: only shows last 4 characters
  const maskedIdDisplay = idNumber.length > 4 
    ? '•'.repeat(Math.max(0, idNumber.length - 4)) + idNumber.slice(-4)
    : idNumber;

  // Handle Step 2: Submit KYC application
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentConfirmed) return;
    setIsSubmitting(true);

    /* Note: This is a UI/workflow mock only. Do not implement real ID-validation, OCR, or government API logic.
       A real deployment would integrate a licensed Indian eKYC provider (such as DigiLocker or a UIDAI-authorized/third-party
       KYC vendor) on a secure backend. For this client demo, we store the masked string and file metadata. */

    setTimeout(() => {
      submitCoachApplication({
        userId: currentUser?.id,
        name: name || currentUser?.name || 'Applicant Coach',
        email: email || currentUser?.email || 'coach@purepro.fit',
        phone,
        idType,
        idNumberMasked: maskedIdDisplay,
        certFileName: certFile?.name || 'Certificate.pdf',
        certFileSize: certFile?.size || 1500000,
        addressProofFileName: addressFile?.name || 'AddressProof.pdf',
        addressProofFileSize: addressFile?.size || 1200000,
        profilePhotoUrl: photoUrl,
        experienceYears,
        specializations: selectedSpecializations.length > 0 ? selectedSpecializations : ['get-fit']
      });

      setIsSubmitting(false);
      setStep(3);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black tracking-wide border border-emerald-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PurePro Coach Network</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          Join India&apos;s Elite Supplement & Training Mentors
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto font-medium">
          Get client leads, conduct 1-on-1 consultations, and recommend verified authentic protein formulations.
        </p>
      </div>

      {/* Progress Steps Header */}
      <div className="flex items-center justify-center gap-3 text-xs font-bold">
        <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            1
          </div>
          <span>Account Setup</span>
        </div>

        <div className="w-8 h-0.5 bg-slate-200" />

        <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            2
          </div>
          <span>KYC & Verification</span>
        </div>

        <div className="w-8 h-0.5 bg-slate-200" />

        <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            3
          </div>
          <span>Review Status</span>
        </div>
      </div>

      {/* ─── STEP 1: ACCOUNT SETUP ─── */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-950">Step 1: Create Coach Account</h3>
            <p className="text-xs text-slate-500">Provide basic contact information to establish your coach portal.</p>
          </div>

          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Roy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="coach@purepro.fit"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Continue to Step 2: Verification</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── STEP 2: KYC & VERIFICATION ─── */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-950">Step 2: Professional Verification (Mock KYC)</h3>
              <span className="text-[11px] font-mono bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                Demo Only — Do Not Enter Real ID
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              PurePro verifies credentials before featuring coach profiles publicly.
            </p>
          </div>

          <form onSubmit={handleStep2Submit} className="space-y-5">
            {/* Government ID Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Government ID Type</label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value as any)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Aadhaar">Aadhaar Card (UIDAI)</option>
                  <option value="PAN">Permanent Account Number (PAN)</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving Licence">Driving Licence</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  ID Number <span className="text-slate-400 font-normal">(Masked upon entry)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    onFocus={() => setIsIdMasked(false)}
                    onBlur={() => setIsIdMasked(true)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                  {isIdMasked && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      {maskedIdDisplay}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Fitness Certification Upload
                </label>
                <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition-colors">
                  <Upload className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="text-xs font-bold text-slate-700">
                    {certFile ? certFile.name : 'Upload CSCS / ACE / ISSA PDF'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {certFile ? `${(certFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF or JPEG up to 10MB'}
                  </span>
                  <input type="file" accept=".pdf,image/*" onChange={handleCertUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Address Proof Document
                </label>
                <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition-colors">
                  <FileText className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="text-xs font-bold text-slate-700">
                    {addressFile ? addressFile.name : 'Utility bill or Rent agreement'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {addressFile ? `${(addressFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF or JPEG up to 10MB'}
                  </span>
                  <input type="file" accept=".pdf,image/*" onChange={handleAddressUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Experience and Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Years of Professional Experience
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Profile Photo URL / Avatar
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Specializations checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Specialization Categories (Select all that apply)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'get-fit', label: 'Get Fit & Functional', icon: '🏃' },
                  { id: 'build-muscle', label: 'Build Muscle (Hypertrophy)', icon: '💪' },
                  { id: 'weight-loss', label: 'Weight Loss & Shred', icon: '🔥' }
                ].map((spec) => {
                  const isChecked = selectedSpecializations.includes(spec.id as PlanId);
                  return (
                    <button
                      type="button"
                      key={spec.id}
                      onClick={() => toggleSpecialization(spec.id as PlanId)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2 text-xs font-bold transition-all ${
                        isChecked
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{spec.icon}</span>
                      <span>{spec.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legal consent confirmation */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentConfirmed}
                  onChange={(e) => setConsentConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-700 font-bold">
                  I confirm this information is accurate and agree to adhere to PurePro professional coaching ethics.
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!consentConfirmed || isSubmitting}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  consentConfirmed && !isSubmitting
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald active:scale-98 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <span>Submitting Application to Review...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Application for Verification</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── STEP 3: APPLICATION UNDER REVIEW ─── */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-soft space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center mx-auto text-amber-600">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              Status: Pending Review
            </span>
            <h2 className="text-2xl font-black text-slate-950 pt-2">Your application is under review</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Thank you for applying, <strong className="text-slate-800">{name || 'Coach'}</strong>! Our verification compliance team audits uploaded certifications and government proof within 24-48 business hours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1 text-slate-600 font-medium">
            <div>• Registered Email: <strong className="text-slate-900">{email}</strong></div>
            <div>• Masked ID: <strong className="text-slate-900 font-mono">{maskedIdDisplay}</strong></div>
            <div>• Cert File: <strong className="text-slate-900">{certFile?.name}</strong></div>
            <div>• Target Role: <strong className="text-emerald-700 font-bold">Verified Coach</strong></div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('coach-dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors"
            >
              Go to Coach Dashboard
            </button>
            <button
              onClick={() => navigateTo('admin-coaches')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-xs transition-colors"
            >
              Demo Admin Panel (Instant Review) →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
