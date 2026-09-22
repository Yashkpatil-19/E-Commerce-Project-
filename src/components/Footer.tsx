'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  RotateCcw, 
  Award, 
  Mail, 
  Phone, 
  MapPin, 
  Lock 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setActiveCategoryFilter } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Genuine Guaranteed</h4>
              <p className="text-xs text-slate-400 mt-1">Scratch-code verified directly with authorized manufacturers.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Free Express Shipping</h4>
              <p className="text-xs text-slate-400 mt-1">Free delivery on all orders with dispatch in under 24 hours.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Labdoor Certified</h4>
              <p className="text-xs text-slate-400 mt-1">Rigorous batch purity and label accuracy testing for peak results.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">AI Recommendation Engine</h4>
              <p className="text-xs text-slate-400 mt-1">Personalized nutrition scoring based on your weight and diet safety.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800/80 text-xs">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl inline-flex items-center shadow-sm">
                <img 
                  src="/purepro-logo.png" 
                  alt="PurePro Protein Supplements" 
                  className="h-10 w-auto object-contain" 
                />
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              PurePro is India&apos;s leading authorized multi-brand supplement store. We empower fitness athletes with 100% authentic proteins, performance pre-workouts, and science-backed nutritional formulas.
            </p>

            <div className="flex items-center gap-4 text-slate-400 pt-2">
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Secured</span>
              <span className="flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5 text-emerald-400" /> 14-Day Easy Returns</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Categories</h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => { setActiveCategoryFilter('Protein'); navigateTo('products'); }} className="hover:text-emerald-400 transition-colors">
                  Whey & Plant Proteins
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveCategoryFilter('Pre-Workout'); navigateTo('products'); }} className="hover:text-emerald-400 transition-colors">
                  Pre-Workout & Pumps
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveCategoryFilter('Recovery'); navigateTo('products'); }} className="hover:text-emerald-400 transition-colors">
                  BCAA & Electrolytes
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveCategoryFilter('Vitamins'); navigateTo('products'); }} className="hover:text-emerald-400 transition-colors">
                  Multivitamins & Omega-3
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveCategoryFilter('Meal Replacements'); navigateTo('products'); }} className="hover:text-emerald-400 transition-colors">
                  Clean Meal Replacements
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Authenticity */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Authenticity & Safety</h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => navigateTo('verify')} className="hover:text-emerald-400 text-emerald-400 font-bold flex items-center gap-1 transition-colors">
                  <span>Verify Scratch Code</span>
                  <ShieldCheck className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('profile-setup')} className="hover:text-emerald-400 transition-colors">
                  Diet & Goal Matcher
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('products')} className="hover:text-emerald-400 transition-colors">
                  Browse All 30 Products
                </button>
              </li>
              <li>
                <span className="text-slate-500">Official Brand Partner Seals</span>
              </li>
              <li>
                <span className="text-slate-500">Lab Batch COA Certificates</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Support</h5>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 1800-266-PURE</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>care@purepro-nutrition.store</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Indiranagar 100ft Rd, Bengaluru, Karnataka 560038</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PurePro Nutrition Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Shipping Policy</span>
            <span>Authenticity Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
