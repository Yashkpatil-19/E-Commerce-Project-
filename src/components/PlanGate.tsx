'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Check, X, ShieldCheck, Zap, Lock, ArrowRight } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggeredFeature?: 'multi-plan' | 'full-analytics';
}

/**
 * 2-column Free vs. Premium comparison modal with 1-click demo upgrade.
 */
export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, triggeredFeature }) => {
  const { upgradeToPremium } = useApp();
  const [upgrading, setUpgrading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    setUpgrading(true);
    /* Note: In a real production deployment, upgrading to Premium would require a recurring-billing gateway
       (such as Stripe Billing, Paddle, or Razorpay Subscriptions) with webhook verification and recurring cycles,
       rather than the one-time payment flow used at store checkout. For this client-side demo, we activate it instantly. */
    setTimeout(() => {
      upgradeToPremium();
      setUpgrading(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 text-white text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PurePro Athlete Pass</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Unlock Full Fitness Journey & Analytics
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            {triggeredFeature === 'multi-plan' 
              ? 'Switching between multiple active training plans requires PurePro Premium.' 
              : 'Detailed muscle-group breakdowns and all-time analytics are available on Premium.'}
          </p>
        </div>

        {/* 2-Column Comparison Table */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Tier Card */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-slate-900 text-base">Free Tier</h4>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">Current Plan</span>
                </div>
                <div className="text-2xl font-black text-slate-900 mb-4">₹0 <span className="text-xs font-medium text-slate-500">/ forever</span></div>
                
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Single active plan at a time</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Daily calorie burns & routine generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>7-Day rolling activity analytics</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <X className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <span className="line-through">Multi-plan switching (Build/Cut/Fit)</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <X className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <span className="line-through">All-time totals & muscle-group chart</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 text-center text-[11px] text-slate-400 py-2 border-t border-slate-200">
                Included with all customer accounts
              </div>
            </div>

            {/* Premium Tier Card */}
            <div className="border-2 border-emerald-500 rounded-2xl p-5 bg-gradient-to-b from-emerald-50/50 to-teal-50/30 flex flex-col justify-between shadow-soft relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                Recommended
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-emerald-950 text-base flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    <span>PurePro Premium</span>
                  </h4>
                </div>
                <div className="text-2xl font-black text-emerald-950 mb-4">
                  ₹499 <span className="text-xs font-medium text-emerald-700">/ month (Demo: Free)</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2 font-bold text-slate-900">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Unrestricted switching across all 3 plans</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-900">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Full historical analytics & all-time totals</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-900">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Interactive muscle-group breakdown chart</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Priority coach matching & verified slots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Advanced MET caloric precision</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-emerald flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  {upgrading ? (
                    <span>Activating Premium...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Upgrade Now (Demo Instant)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PlanGateProps {
  feature: 'multi-plan' | 'full-analytics';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Gate component checking if user has access to a feature.
 * If user is on Free tier and attempts to view/trigger the feature, renders fallback or triggers modal.
 */
export const PlanGate: React.FC<PlanGateProps> = ({ feature, children, fallback }) => {
  const { isPremium, openUpgradeModal } = useApp();

  if (isPremium) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div 
      onClick={() => openUpgradeModal(feature)} 
      className="relative cursor-pointer group rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 p-6 text-center hover:bg-emerald-50/80 transition-all"
    >
      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
        <Lock className="w-5 h-5" />
      </div>
      <h4 className="font-black text-slate-900 text-sm">
        {feature === 'multi-plan' ? 'Multi-Plan Switching' : 'Full Historical & Muscle Breakdown Analytics'}
      </h4>
      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
        Available exclusively to PurePro Premium members. Click to preview or upgrade.
      </p>
      <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:underline">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Upgrade to Premium →</span>
      </div>
    </div>
  );
};
