'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, ShoppingBag, Home } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 sm:p-12 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-soft space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-soft">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-black tracking-wider uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Error 404 • Page Not Found
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Looking for Authentic Supplements?
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              The page you requested does not exist or has been moved. Explore our verified catalog of proteins, creatines, and vitamins.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link
              href="/"
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-emerald flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Home className="w-4 h-4" />
              <span>Return to PurePro Store</span>
            </Link>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/products/"
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Shop All</span>
              </Link>

              <Link
                href="/verify/"
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verify Tub</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
