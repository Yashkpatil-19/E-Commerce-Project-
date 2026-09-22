'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TargetGoal, TargetDiet } from '../types';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Zap
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    currentUser, 
    login, 
    signup, 
    logout,
    authPromptReason 
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpGoal, setSignUpGoal] = useState<TargetGoal>('Muscle Gain');
  const [signUpDiet, setSignUpDiet] = useState<TargetDiet>('Vegetarian');

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) return;
    await login(signInEmail, signInPassword || 'Password@123');
    setSuccessMessage(`Welcome back, ${signInEmail.split('@')[0]}!`);
    setTimeout(() => {
      setSuccessMessage(null);
      closeAuthModal();
    }, 900);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail) return;
    await signup(signUpName, signUpEmail, signUpPassword || 'Password@123', signUpGoal, signUpDiet);
    setSuccessMessage(`Account created for ${signUpName}!`);
    setTimeout(() => {
      setSuccessMessage(null);
      closeAuthModal();
    }, 900);
  };

  const handleDemoSignIn = async () => {
    await login('vikram.malhotra@example.com', 'DemoPassword@123', 'Vikram Malhotra');
    setSuccessMessage('Logged in as Vikram Malhotra (Demo Account)');
    setTimeout(() => {
      setSuccessMessage(null);
      closeAuthModal();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">PurePro Access</span>
          </div>

          <h2 className="text-xl font-black tracking-tight text-white">
            {currentUser ? 'Your PurePro Account' : (mode === 'signin' ? 'Sign In to Your Account' : 'Create a Verified Account')}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {currentUser 
              ? 'Manage your orders, verified batches & personalized recommendations' 
              : 'Unlock personalized supplement scoring, express checkout & lab verification'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {successMessage ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{successMessage}</h3>
              <p className="text-xs text-slate-500">Syncing your nutrition profile...</p>
            </div>
          ) : currentUser ? (
            /* Logged In View */
            <div className="space-y-5">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-base flex items-center justify-center shadow-emerald shadow-sm">
                  {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950">{currentUser.name}</h4>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                    <ShieldCheck className="w-3 h-3" /> Ultra-Verified Member
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Fitness Goal</span>
                  <strong className="text-slate-800 text-xs">{currentUser.goal || 'Muscle Gain'}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Diet Preference</span>
                  <strong className="text-slate-800 text-xs">{currentUser.diet || 'Vegetarian'}</strong>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    logout();
                    closeAuthModal();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                >
                  Sign Out
                </button>
                <button
                  onClick={closeAuthModal}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Logged Out View - Sign In / Sign Up */
            <div>
              {authPromptReason && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200/90 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950 shadow-xs animate-fade-in">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-emerald-900 text-[11px] uppercase tracking-wider">Authentication Required</span>
                    <p className="font-medium text-emerald-800 leading-snug mt-0.5">{authPromptReason}</p>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex border-b border-slate-100 mb-5">
                <button
                  onClick={() => setMode('signin')}
                  className={`flex-1 pb-3 text-xs font-bold border-b-2 transition-all ${
                    mode === 'signin'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 pb-3 text-xs font-bold border-b-2 transition-all ${
                    mode === 'signup'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* 1-Click Demo Shortcut */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 text-xs font-bold flex items-center justify-between transition-colors group"
                >
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
                    <span>Quick Demo: Sign In as <strong>Vikram Malhotra</strong></span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-2 text-slate-400 font-bold">Or continue with credentials</span>
                </div>
              </div>

              {/* Sign In Tab Content */}
              {mode === 'signin' && (
                <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="athlete@example.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-emerald shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Create Account Tab Content */}
              {mode === 'signup' && (
                <form onSubmit={handleSignUpSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="Aarav Sharma"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="aarav@example.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Create strong password"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Primary Goal
                      </label>
                      <select
                        value={signUpGoal}
                        onChange={(e) => setSignUpGoal(e.target.value as TargetGoal)}
                        className="w-full py-2 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        <option value="Muscle Gain">Muscle Gain</option>
                        <option value="Fat Loss">Fat Loss</option>
                        <option value="Endurance">Endurance</option>
                        <option value="General Fitness">General Fitness</option>
                        <option value="Athletic Performance">Performance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Diet
                      </label>
                      <select
                        value={signUpDiet}
                        onChange={(e) => setSignUpDiet(e.target.value as TargetDiet)}
                        className="w-full py-2 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-3 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-emerald shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Verification Assurance Footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Brand Authentic
            </span>
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
