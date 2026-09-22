'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  ScanLine, 
  HelpCircle, 
  Clock, 
  RotateCcw,
  Sparkles,
  Award,
  Check
} from 'lucide-react';
import { ScratchCode, VerifiedRecord } from '../../types';

export const VerifyProductScreen: React.FC = () => {
  const { verifyCode, verifiedCodes, navigateTo } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [resultState, setResultState] = useState<{
    status: 'idle' | 'genuine' | 'already-used' | 'invalid';
    details?: ScratchCode;
    previousVerification?: VerifiedRecord;
  }>({ status: 'idle' });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const result = await verifyCode(inputCode);
    setResultState(result);
  };

  const sampleCodes = [
    { label: 'Unused Genuine (ON)', code: 'ON-7842-X9' },
    { label: 'Unused Genuine (MB)', code: 'MB-9102-K3' },
    { label: 'Unused Genuine (Dymatize)', code: 'DYMA-4421-Z8' },
    { label: 'Invalid / Counterfeit', code: 'FAKE-9999-NO' },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-soft">
          <ShieldCheck className="w-9 h-9 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          Anti-Counterfeit Authenticity Verifier
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          Verify physical supplement tubs in real-time against our direct manufacturer database to eliminate counterfeit risks.
        </p>
      </div>

      {/* Verification Portal Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-soft space-y-6">
        {/* Holographic Scratch Demonstration Box */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 rounded-2xl p-6 text-white text-center relative overflow-hidden border border-emerald-900/50">
          <div className="absolute top-3 right-3 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-500/30">
            Holographic Seal
          </div>
          <div className="my-3 space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block">
              Locate the 10-character scratch area on your tub cap
            </span>
            <div className="inline-block bg-slate-800/90 border border-slate-600 rounded-xl px-6 py-2.5 font-mono text-base tracking-widest text-amber-300 select-all shadow-inner">
              XXXX - XXXX - XX
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Scratch gently with a coin to reveal your unique authentication key. Each genuine code can only be claimed once.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleVerify} className="space-y-4 max-w-xl mx-auto">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
              Enter 10-Character Scratch Code
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. ON-7842-X9"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-base font-bold text-slate-900 placeholder-slate-400 uppercase tracking-widest focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => setInputCode('ON-7842-X9')}
                title="Paste demo code"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 p-1.5 rounded-xl"
              >
                <ScanLine className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-emerald transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Verify Product Authenticity</span>
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="pt-4 border-t border-slate-100 max-w-xl mx-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center sm:text-left">
            One-Click Test Scratch Codes:
          </span>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {sampleCodes.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setInputCode(item.code);
                  setResultState({ status: 'idle' });
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border border-slate-200 transition-colors"
              >
                {item.label}: <span className="font-mono">{item.code}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VERIFICATION RESULT STATES */}

      {/* 1. SUCCESS: GENUINE PRODUCT */}
      {resultState.status === 'genuine' && resultState.details && (
        <div className="bg-emerald-50 border-2 border-emerald-500/70 rounded-3xl p-6 sm:p-8 text-emerald-950 space-y-5 shadow-emerald animate-in fade-in zoom-in-95 duration-200 max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <div className="inline-block bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md mb-1">
                Authenticity Passed
              </div>
              <h3 className="font-black text-slate-950 text-xl leading-tight">100% Genuine & Authentic Product</h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
            This scratch code has been validated against the official manufacturer registry and permanently registered to your account.
          </p>

          <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-emerald-200 text-xs sm:text-sm space-y-2.5">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Brand Partner:</span>
              <span className="font-bold text-slate-900">{resultState.details.brand}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Product Name:</span>
              <span className="font-bold text-slate-900">{resultState.details.product}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Batch Number:</span>
              <span className="font-mono font-bold text-slate-900">{resultState.details.batch}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Manufacturing Date:</span>
              <span className="font-bold text-slate-900">{resultState.details.mfg}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Expiry Date:</span>
              <span className="font-bold text-slate-900">{resultState.details.exp}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. WARNING: ALREADY USED */}
      {resultState.status === 'already-used' && resultState.previousVerification && (
        <div className="bg-amber-50 border-2 border-amber-500/70 rounded-3xl p-6 sm:p-8 text-amber-950 space-y-5 shadow-soft animate-in fade-in zoom-in-95 duration-200 max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <div className="inline-block bg-amber-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md mb-1">
                Warning: Already Registered
              </div>
              <h3 className="font-black text-slate-950 text-xl leading-tight">Code Previously Verified</h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
            This scratch code was already verified on <strong>{resultState.previousVerification.verifiedAt}</strong>. If you did not verify this product yourself, it may be a counterfeit duplicate.
          </p>

          <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-amber-200 text-xs sm:text-sm space-y-2">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Product:</span>
              <span className="font-bold text-slate-900">{resultState.previousVerification.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Initial Verification Timestamp:</span>
              <span className="font-bold text-amber-800">{resultState.previousVerification.verifiedAt}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. DANGER: INVALID / COUNTERFEIT */}
      {resultState.status === 'invalid' && (
        <div className="bg-red-50 border-2 border-red-500/70 rounded-3xl p-6 sm:p-8 text-red-950 space-y-5 shadow-soft animate-in fade-in zoom-in-95 duration-200 max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <XCircle className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <div className="inline-block bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md mb-1">
                Security Alert
              </div>
              <h3 className="font-black text-slate-950 text-xl leading-tight">Invalid Verification Code</h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-red-900 leading-relaxed font-medium">
            The code entered was not found in our authorized manufacturer batch records. Please double-check the characters or contact brand customer protection immediately.
          </p>

          <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-red-200 text-xs sm:text-sm text-slate-700">
            <p className="font-bold mb-1 text-red-700">Counterfeit Prevention Helpline:</p>
            <p className="text-slate-500">Toll-free: 1800-266-PURE (Mon-Sat 9AM-7PM) or email support@purepro-nutrition.store</p>
          </div>
        </div>
      )}

      {/* Verification History Log */}
      {verifiedCodes.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h3 className="font-black text-slate-900 text-sm">Your Verified Products History</h3>
            </div>
            <span className="text-xs font-bold text-slate-400">{verifiedCodes.length} Products Registered</span>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-2 text-xs">
            {verifiedCodes.map((item, index) => (
              <div key={index} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.product}</h4>
                  <span className="text-[11px] text-slate-500 font-mono">Code: {item.code} • Batch: {item.batch} • {item.verifiedAt}</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex-shrink-0">
                  Genuine Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
