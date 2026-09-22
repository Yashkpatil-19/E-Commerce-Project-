'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  ShoppingBag, 
  User, 
  Sparkles, 
  Search, 
  Menu, 
  X, 
  ChevronDown,
  Lock,
  PhoneCall,
  Sliders,
  Package
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentScreen, 
    navigateTo, 
    cartCount, 
    cartTotal,
    profile, 
    setActiveCategoryFilter, 
    searchQuery, 
    setSearchQuery,
    currentUser,
    openAuthModal,
    openAssessment
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryNav = (cat: string) => {
    setActiveCategoryFilter(cat);
    navigateTo('products');
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('products');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-slate-950 text-slate-300 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden sm:inline text-emerald-400 font-bold flex items-center gap-1">
              ⚡ 100% Authentic Guaranteed Direct From Brands
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-300">
              Free Express 24-hr Shipping Across India
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] ml-auto">
            {/* Active profile indication */}
            <button 
              onClick={() => navigateTo('profile-setup')}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Matched: <strong className="text-emerald-400">{profile.goal}</strong> ({profile.diet})</span>
            </button>

            <span className="text-slate-600">|</span>

            <button
              onClick={() => navigateTo('verify')}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Website Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3 text-left group flex-shrink-0"
          aria-label="PurePro Home"
        >
          <img 
            src="/purepro-logo.png" 
            alt="PurePro Protein Supplements" 
            className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </button>

        {/* Desktop Search Bar */}
        <form 
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-lg mx-6 relative"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search verified Creatine, Whey, Vitamins capsules, Fish Oil softgels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-full text-xs font-bold transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Verify Shortcut */}
          <button
            onClick={() => navigateTo('verify')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentScreen === 'verify'
                ? 'bg-emerald-600 text-white shadow-emerald'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Scratch-Code</span>
          </button>

          {/* AI Clinical Supplement Matcher Quiz */}
          <button
            onClick={openAssessment}
            className="px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald shadow-xs transition-all active:scale-98"
            title="Take AI Clinical Supplement Consultation"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>AI Supplement Quiz</span>
          </button>

          {/* Profile Matcher */}
          <button
            onClick={() => navigateTo('profile-setup')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentScreen === 'profile-setup'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{profile.diet} • {profile.goal}</span>
          </button>

          {/* Account / My Orders & Profile */}
          <button
            onClick={() => currentUser ? navigateTo('profile') : openAuthModal()}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              currentUser
                ? currentScreen === 'profile'
                  ? 'bg-emerald-600 text-white shadow-emerald shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald shadow-xs'
            }`}
            title={currentUser ? 'View My Orders & Profile' : 'Sign In'}
          >
            {currentUser ? (
              <>
                <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shadow-xs ${
                  currentScreen === 'profile' ? 'bg-white text-emerald-800' : 'bg-emerald-600 text-white'
                }`}>
                  {currentUser.name ? currentUser.name.slice(0, 1).toUpperCase() : 'U'}
                </span>
                <span className="max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
                <Package className="w-3.5 h-3.5 text-slate-400" />
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Cart with Price */}
          <button
            onClick={() => navigateTo('cart')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2.5 transition-all relative ${
              currentScreen === 'cart'
                ? 'bg-emerald-600 text-white shadow-emerald'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Cart {cartTotal > 0 ? `• ₹${cartTotal.toLocaleString()}` : ''}</span>
          </button>
        </div>

        {/* Mobile controls toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => navigateTo('cart')}
            className="p-2.5 rounded-xl bg-slate-900 text-white relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Category Navigation Bar */}
      <nav className="hidden lg:block border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center gap-6 py-3">
            <button 
              onClick={() => { setActiveCategoryFilter('All'); navigateTo('products'); }}
              className="hover:text-emerald-600 transition-colors flex items-center gap-1 text-slate-950 font-black"
            >
              All Products
            </button>
            <button onClick={() => handleCategoryNav('Protein')} className="hover:text-emerald-600 transition-colors">
              Whey & Protein
            </button>
            <button onClick={() => handleCategoryNav('Creatine')} className="hover:text-emerald-600 transition-colors text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded-md font-extrabold">
              ⚡ Creatine Creapure
            </button>
            <button onClick={() => handleCategoryNav('Vitamins')} className="hover:text-emerald-600 transition-colors">
              💊 Vitamins Capsules
            </button>
            <button onClick={() => handleCategoryNav('Fish Oil')} className="hover:text-emerald-600 transition-colors">
              💧 Fish Oil Capsules
            </button>
            <button onClick={() => handleCategoryNav('Pre-Workout')} className="hover:text-emerald-600 transition-colors">
              Pre-Workout
            </button>
            <button onClick={() => handleCategoryNav('Recovery')} className="hover:text-emerald-600 transition-colors">
              BCAA Recovery
            </button>
            <button onClick={() => handleCategoryNav('Meal Replacements')} className="hover:text-emerald-600 transition-colors">
              Meal Shakes
            </button>
          </div>

          <div className="flex items-center gap-4 py-3 text-slate-500">
            <button onClick={() => navigateTo('profile-setup')} className="hover:text-emerald-600 text-emerald-700 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Goal Engine ({profile.goal})</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-5 space-y-4 shadow-xl">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Creatine, Whey, Vitamins, Fish Oil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
            />
          </form>

          {/* AI Clinical Quiz Button */}
          <button
            onClick={() => { openAssessment(); setMobileMenuOpen(false); }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>AI Clinical Supplement Quiz</span>
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
            <button 
              onClick={() => { setActiveCategoryFilter('All'); navigateTo('products'); setMobileMenuOpen(false); }}
              className="p-3 rounded-xl bg-slate-100 text-left font-black text-slate-900"
            >
              All Supplements
            </button>
            <button onClick={() => handleCategoryNav('Creatine')} className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-left font-black">
              ⚡ Creatine Creapure
            </button>
            <button onClick={() => handleCategoryNav('Protein')} className="p-3 rounded-xl bg-slate-100 text-left">
              Whey & Protein
            </button>
            <button onClick={() => handleCategoryNav('Vitamins')} className="p-3 rounded-xl bg-slate-100 text-left">
              💊 Vitamins Capsules
            </button>
            <button onClick={() => handleCategoryNav('Fish Oil')} className="p-3 rounded-xl bg-slate-100 text-left">
              💧 Fish Oil Capsules
            </button>
            <button onClick={() => handleCategoryNav('Pre-Workout')} className="p-3 rounded-xl bg-slate-100 text-left">
              Pre-Workouts
            </button>
            <button onClick={() => handleCategoryNav('Recovery')} className="p-3 rounded-xl bg-slate-100 text-left">
              Recovery & BCAAs
            </button>
            <button onClick={() => handleCategoryNav('Meal Replacements')} className="p-3 rounded-xl bg-slate-100 text-left">
              Meal Replacements
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            {currentUser ? (
              <button
                onClick={() => { navigateTo('profile'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Package className="w-4 h-4 text-emerald-400" />
                <span>My Orders & Profile ({currentUser.name})</span>
              </button>
            ) : (
              <button
                onClick={() => { openAuthModal(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-emerald shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
            )}
            <button
              onClick={() => { navigateTo('verify'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Product Authenticity</span>
            </button>
            <button
              onClick={() => { navigateTo('profile-setup'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Configure Profile ({profile.goal})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
