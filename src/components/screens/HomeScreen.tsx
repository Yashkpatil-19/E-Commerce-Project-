'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../ProductCard';
import { MarketingBannerCarousel } from '../MarketingBannerCarousel';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Truck, 
  FlaskConical, 
  Award, 
  Zap, 
  HeartHandshake,
  CheckCircle,
  Sliders,
  Star,
  BadgeCheck,
  Dumbbell,
  Target
} from 'lucide-react';
import brandsData from '../../data/brands.json';

export const HomeScreen: React.FC = () => {
  const { 
    profile, 
    recommendedProducts, 
    navigateTo, 
    setActiveCategoryFilter,
    openAssessment 
  } = useApp();

  const categories = [
    { name: 'Creatine', icon: '⚡', desc: 'Creapure® ATP Boosters', count: '6 Formulas' },
    { name: 'Protein', icon: '💪', desc: 'Whey, Isolate, Casein & Plant', count: '9 Formulas' },
    { name: 'Vitamins', icon: '💊', desc: 'High Potency Multi Capsules', count: '4 Formulas' },
    { name: 'Fish Oil', icon: '💧', desc: 'Triple Strength Omega-3 Softgels', count: '4 Formulas' },
    { name: 'Pre-Workout', icon: '🔥', desc: 'Explosive Pump & Energy', count: '2 Formulas' },
    { name: 'Recovery', icon: '🌱', desc: 'BCAA & Full Spectrum EAAs', count: '2 Formulas' },
  ];

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategoryFilter(categoryName);
    navigateTo('products');
  };

  return (
    <div className="space-y-10 pb-16">
      {/* ─── MARKETING BANNER CAROUSEL ─── */}
      <MarketingBannerCarousel />

      {/* Authenticity Banner Callout */}
      <div 
        onClick={() => navigateTo('verify')}
        className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:border-emerald-400 transition-all shadow-soft"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-emerald shadow-sm flex-shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-900 text-base">Anti-Counterfeit Product Verification Portal</h3>
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded uppercase">Official</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Already purchased a supplement? Scratch the seal on the tub and verify its genuine batch in our decentralized manufacturer registry.
            </p>
          </div>
        </div>

        <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm whitespace-nowrap flex items-center gap-1.5">
          <span>Enter Scratch Code</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* "Recommended for You" Showcase Grid */}
      <section className="space-y-4">
        {/* Clinical Assessment Callout Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 rounded-3xl p-5 sm:p-6 text-white shadow-soft relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-800/40">
          <div className="relative z-10 space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black tracking-wide border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Clinical Supplement & Nutrition Matcher</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
              Want a 100% personalized supplement stack for your body?
            </h3>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Complete our 6-pillar assessment (Biometrics, Dietary preferences, Lactose/Digestion, Blood Panels, Sleep & Stress) to get evidence-based dosing and customized protein recommendations.
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0 flex items-center gap-2.5">
            <button
              onClick={openAssessment}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-emerald shadow-sm transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-emerald-950" />
              <span>Start Clinical Assessment</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-black text-lg">✦</span>
              <h2 className="font-black text-slate-950 text-xl tracking-tight">Recommended for You</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Top compatibility products matched to your {profile.weight}kg body weight, {profile.goal} goal, and {profile.diet} lifestyle.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={openAssessment}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Retake Clinical Quiz</span>
            </button>
            <button
              onClick={() => navigateTo('products')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Responsive Desktop Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Explore Categories Section */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="font-black text-slate-950 text-xl tracking-tight">Shop by Category</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Formulations engineered for every stage of your athletic performance
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft hover:border-emerald-400 hover:shadow-card transition-all text-left group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl p-2 rounded-xl bg-slate-50 group-hover:bg-emerald-50 transition-colors">
                  {cat.icon}
                </span>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600">
                  {cat.count}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {cat.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ─── SHOP BY GOAL & FITNESS JOURNEY ─── */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-slate-950 text-xl tracking-tight">Shop by Goal</h2>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Interactive Training
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Select your personal fitness target to explore matched protein stacks and dynamic workout regimens.
            </p>
          </div>

          <button 
            onClick={() => navigateTo('fitness-journey')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>All Fitness Journeys</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Muscle Gain Card */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 text-white p-6 rounded-3xl border border-emerald-800/40 shadow-soft flex flex-col justify-between space-y-4 relative overflow-hidden group">
            <div className="space-y-2 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2.5 rounded-2xl bg-white/10 backdrop-blur-md">💪</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/25 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-400/30">
                  Most Popular
                </span>
              </div>
              <h3 className="text-lg font-black text-white">Muscle Gain (Hypertrophy)</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Engineered for maximum mechanical tension, clean caloric surplus, and fast post-workout myofibrillar protein synthesis.
              </p>
            </div>

            <div className="pt-2 relative z-10">
              <a
                href="/fitness-journey?plan=build-muscle"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/fitness-journey?plan=build-muscle');
                  }
                  navigateTo('fitness-journey');
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-emerald shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <span>Start Your Muscle Gain Journey →</span>
              </a>
            </div>
          </div>

          {/* Weight Loss Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2.5 rounded-2xl bg-amber-50">🔥</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  Metabolic Fat Burn
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">Weight Loss & Definition</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                High-cadence interval training, elevated thermogenic output, and low-carb whey isolate formulations.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="/fitness-journey?plan=weight-loss"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/fitness-journey?plan=weight-loss');
                  }
                  navigateTo('fitness-journey');
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Start Weight Loss Journey →</span>
              </a>
            </div>
          </div>

          {/* Get Fit Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2.5 rounded-2xl bg-blue-50">🏃</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  All-Round Vitality
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">Get Fit & Functional</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Core stability, cardiovascular stamina, joint mobility, and balanced multivitamin daily nourishment.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="/fitness-journey?plan=get-fit"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/fitness-journey?plan=get-fit');
                  }
                  navigateTo('fitness-journey');
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Start Fitness Journey →</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 100% Ultra-Verified Authorized Brand Partners */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-slate-950 text-xl tracking-tight">Ultra-Verified Brand Partners</h2>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Strict Quality Audit
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Direct manufacturer supplies tested by Labdoor USA, Informed Choice, and NSF Certified for Sport.
            </p>
          </div>
          <button 
            onClick={() => { setActiveCategoryFilter('All'); navigateTo('products'); }}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore All Brands</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {brandsData.map((brand) => (
            <div 
              key={brand.id} 
              onClick={() => {
                setActiveCategoryFilter('All');
                navigateTo('products');
              }}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft hover:border-emerald-400 hover:shadow-card cursor-pointer transition-all flex flex-col items-center text-center group relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 bg-emerald-50 text-emerald-700 text-[9px] font-black px-1.5 py-0.5 rounded border border-emerald-200">
                ✓ Ultra Verified
              </div>

              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden my-1 group-hover:scale-105 transition-transform p-1">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = '/purepro-logo.png';
                  }}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mt-1">{brand.name}</h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5 border border-emerald-200/60 line-clamp-1">
                {brand.badge}
              </span>
              <p className="text-[10px] text-slate-400 font-medium mt-1 line-clamp-2">
                {brand.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── REAL CUSTOMER REVIEWS & ATHLETE TESTIMONIALS ─── */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-emerald-900/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-md border border-emerald-400/30">
                Verified Buyer Feedback
              </span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mt-2">
              Loved by 50,000+ Athletes & Fitness Enthusiasts
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Every review verified against genuine physical product batch scratch-codes.
            </p>
          </div>

          <button
            onClick={() => navigateTo('products')}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>Shop Top Rated</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  V
                </div>
                <div>
                  <span className="font-bold text-white text-xs block">Vikram Malhotra</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Verified Creatine Buyer</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <h4 className="font-bold text-xs text-white">&ldquo;ON Micronized Creapure is 100% genuine!&rdquo;</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Scratched the hologram code right after delivery and verified authentic on PurePro. Zero grit, 7.5kg lift increase in 3 weeks.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Batch: ON2026C12</span>
              <span className="text-emerald-400 font-sans font-bold">✓ Authenticated</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  D
                </div>
                <div>
                  <span className="font-bold text-white text-xs block">Deepak Chawla</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Verified Omega-3 Buyer</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <h4 className="font-bold text-xs text-white">&ldquo;Zero fishy burps, truly enteric coated!&rdquo;</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              MuscleBlaze Triple Strength 1000mg softgels are completely odorless. Knee joint stiffness from heavy squats vanished within 14 days.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Batch: MB26-616</span>
              <span className="text-emerald-400 font-sans font-bold">✓ Authenticated</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center">
                  G
                </div>
                <div>
                  <span className="font-bold text-white text-xs block">Gaurav Mehta</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Verified Multi Buyer</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <h4 className="font-bold text-xs text-white">&ldquo;Opti-Men high potency capsules work wonders&rdquo;</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              No afternoon workout crashes anymore. The 75+ nutrient blend gives clean sustained energy throughout the day.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Batch: ON2026V01</span>
              <span className="text-emerald-400 font-sans font-bold">✓ Authenticated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Guarantee Badges */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6 text-center">
          The PurePro Quality Guarantee
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-sm">100% Genuine Direct</h5>
              <p className="text-xs text-slate-500 mt-0.5">Sourced directly from certified brand warehouses with authentic seals.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-sm">Lab Tested & Certified</h5>
              <p className="text-xs text-slate-500 mt-0.5">Every batch tested for heavy metals, protein content, and zero steroids.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-sm">Express 24-hr Dispatch</h5>
              <p className="text-xs text-slate-500 mt-0.5">Fast temperature-controlled delivery across all metropolitan PIN codes.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-sm">Hassle-Free Returns</h5>
              <p className="text-xs text-slate-500 mt-0.5">14-day replacement guarantee if the seal is compromised or damaged.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
