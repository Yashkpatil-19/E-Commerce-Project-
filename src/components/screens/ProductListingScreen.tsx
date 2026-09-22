'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../ProductCard';
import { Search, SlidersHorizontal, Sparkles, X, Filter, Check, ShieldCheck, Award } from 'lucide-react';
import brandsData from '../../data/brands.json';

import { ProteinType } from '../../types';

export const ProductListingScreen: React.FC = () => {
  const { 
    products, 
    activeCategoryFilter, 
    setActiveCategoryFilter, 
    activeDietFilter, 
    setActiveDietFilter,
    profile,
    searchQuery,
    setSearchQuery,
    openAssessment
  } = useApp();

  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedForm, setSelectedForm] = useState<string>('All');
  const [selectedProteinType, setSelectedProteinType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'price-asc' | 'price-desc' | 'rating'>('match');

  const categories = ['All', 'Creatine', 'Protein', 'Vitamins', 'Fish Oil', 'Pre-Workout', 'Recovery', 'Meal Replacements'];
  const brands = ['All', ...brandsData.map(b => b.name)];
  
  // Available diet filters based on user profile
  const dietOptions = useMemo(() => {
    if (profile.diet === 'Vegan') return ['All (Vegan Protected)'];
    if (profile.diet === 'Vegetarian') return ['All (Veg Safe)', 'Vegetarian Only', 'Vegan Only'];
    return ['All Diets', 'Vegetarian', 'Vegan', 'Non-Vegetarian'];
  }, [profile.diet]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (activeCategoryFilter !== 'All') {
      list = list.filter(p => p.category === activeCategoryFilter);
    }

    // Form filter (Capsules, Softgels, Powders)
    if (selectedForm === 'Capsules & Softgels') {
      list = list.filter(p => p.form === 'Capsule' || p.form === 'Softgel' || p.category === 'Vitamins' || p.category === 'Fish Oil');
    } else if (selectedForm === 'Powder') {
      list = list.filter(p => p.form === 'Powder');
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      list = list.filter(p => p.brand === selectedBrand);
    }

    // Specialized Protein Type filter
    if (selectedProteinType !== 'All') {
      list = list.filter(p => p.proteinType === selectedProteinType);
    }

    // Secondary Diet filter selector
    if (activeDietFilter === 'Vegetarian Only' || activeDietFilter === 'Vegetarian') {
      list = list.filter(p => p.target_diet === 'Vegetarian');
    } else if (activeDietFilter === 'Vegan Only' || activeDietFilter === 'Vegan') {
      list = list.filter(p => p.target_diet === 'Vegan');
    } else if (activeDietFilter === 'Non-Vegetarian') {
      list = list.filter(p => p.target_diet === 'Non-Vegetarian');
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        (p.form && p.form.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'match') {
        return (b.matchScore || 0) - (a.matchScore || 0);
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });

    return list;
  }, [products, activeCategoryFilter, selectedBrand, selectedProteinType, selectedForm, activeDietFilter, searchQuery, sortBy]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Controls Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">Supplements & Nutrition Catalog</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> verified supplements compatible with your <strong className="text-emerald-700">{profile.goal}</strong> & <strong className="text-emerald-700">{profile.diet}</strong> profile.
            </p>
          </div>

          {/* Search + Sort Top Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:border-emerald-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer font-bold text-slate-900"
              >
                <option value="match">AI Match %</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <button
              onClick={openAssessment}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-sm transition-all active:scale-98"
              title="Personalize via Clinical Quiz"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>AI Quiz</span>
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(activeCategoryFilter !== 'All' || selectedBrand !== 'All' || selectedProteinType !== 'All' || searchQuery || (activeDietFilter !== 'All' && !activeDietFilter.startsWith('All'))) && (
          <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-semibold text-[11px]">Active Filters:</span>
            {selectedProteinType !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-emerald-800 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                Protein: {selectedProteinType}
                <button onClick={() => setSelectedProteinType('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {activeCategoryFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-slate-900 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                Category: {activeCategoryFilter}
                <button onClick={() => setActiveCategoryFilter('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedBrand !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-slate-900 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                Brand: {selectedBrand}
                <button onClick={() => setSelectedBrand('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={() => {
                setActiveCategoryFilter('All');
                setSelectedBrand('All');
                setActiveDietFilter('All');
                setSearchQuery('');
              }}
              className="text-red-500 hover:text-red-700 text-xs font-bold underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Website Catalog Layout: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Sidebar Filter (Desktop) */}
        <aside className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft space-y-6 lg:sticky lg:top-32">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>Filters</span>
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {filteredProducts.length} Items
            </span>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              Category
            </label>
            <div className="space-y-1">
              {categories.map((cat) => {
                const active = activeCategoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      active
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{cat}</span>
                    {active && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Supplement Form Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              Supplement Form
            </label>
            <div className="space-y-1">
              {['All', 'Capsules & Softgels', 'Powder'].map((form) => {
                const active = selectedForm === form;
                return (
                  <button
                    key={form}
                    onClick={() => setSelectedForm(form)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      active
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{form === 'Capsules & Softgels' ? '💊 Capsules & Softgels' : form === 'Powder' ? '⚡ Powders' : '✨ All Forms'}</span>
                    {active && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multiple Protein Formulations Filter */}
          {(activeCategoryFilter === 'All' || activeCategoryFilter === 'Protein') && (
            <div className="space-y-2 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-emerald-950 block">
                  Protein Type
                </label>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  7 Types
                </span>
              </div>
              <div className="space-y-1">
                {[
                  { val: 'All', label: 'All Protein Types' },
                  { val: 'Whey Isolate', label: 'Whey Isolate (WPI)' },
                  { val: 'Hydrolyzed Whey Isolate', label: 'Hydrolyzed Isolate (0g Lactose)' },
                  { val: 'Whey Concentrate / Blend', label: 'Whey Blend / EAF' },
                  { val: 'Plant Protein Isolate', label: 'Plant Isolate (Vegan)' },
                  { val: 'Micellar Casein', label: 'Micellar Casein (Nighttime)' },
                  { val: 'Raw Unflavored', label: 'Raw Whey (No Additives)' },
                  { val: 'Mass Gainer', label: 'Mass Gainer (High Calorie)' },
                ].map((item) => {
                  const active = selectedProteinType === item.val;
                  return (
                    <button
                      key={item.val}
                      onClick={() => setSelectedProteinType(item.val)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                        active
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-emerald-100/60'
                      }`}
                    >
                      <span className="text-[11px] truncate">{item.label}</span>
                      {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Diet Safety Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                Dietary Preference
              </label>
              <span className="text-[10px] text-emerald-600 font-bold">Safety Locked</span>
            </div>
            <div className="space-y-1">
              {dietOptions.map((diet) => {
                const active = activeDietFilter === diet || (diet.startsWith('All') && activeDietFilter === 'All');
                return (
                  <button
                    key={diet}
                    onClick={() => setActiveDietFilter(diet.startsWith('All') ? 'All' : diet)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{diet}</span>
                    {active && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              Authorized Brand
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {brands.map((b) => {
                const active = selectedBrand === b;
                return (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                      active
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{b}</span>
                    {active && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Product Grid (3-4 columns on desktop) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Ultra Verified Brands Trust Callout */}
          <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white p-4 rounded-2xl border border-emerald-800/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-xs text-white uppercase tracking-wider block">
                  100% Ultra-Verified Brands Only
                </span>
                <p className="text-[11px] text-slate-300 font-medium">
                  Strictly stocking lab-tested formulations from ON, MuscleBlaze, Dymatize, TrueBasics, GNC, MuscleTech, Fast&Up.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-400/20 font-mono font-bold">
                Labdoor USA • Informed Choice • NSF
              </span>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 px-6 bg-white rounded-3xl border border-slate-200 shadow-soft space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">No matching supplements found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Try adjusting your search query or loosening diet/brand filters.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveCategoryFilter('All');
                  setSelectedBrand('All');
                  setActiveDietFilter('All');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
