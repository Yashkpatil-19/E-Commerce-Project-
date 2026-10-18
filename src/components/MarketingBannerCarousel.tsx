'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Check, 
  Flame, 
  Zap, 
  Leaf, 
  Star 
} from 'lucide-react';

interface Slide {
  id: string;
  badge: string;
  badgeIcon: React.ReactNode;
  brand: string;
  title: string;
  highlight: string;
  subheading: string;
  perks: string[];
  image: string;
  ctaText: string;
  ctaAction: 'category' | 'verify' | 'products' | 'brand';
  categoryParam?: string;
  bgGradient: string;
  accentColor: string;
  tagColor: string;
}

export const MarketingBannerCarousel: React.FC = () => {
  const { navigateTo, setActiveCategoryFilter, setActiveDietFilter } = useApp();

  const slides: Slide[] = [
    {
      id: 'slide-on-whey',
      badge: 'OFFICIAL RCB PARTNER • WORLD #1 BESTSELLER',
      badgeIcon: <Award className="w-3.5 h-3.5 text-amber-300" />,
      brand: 'OPTIMUM NUTRITION',
      title: 'Gold Standard 100% Whey',
      highlight: 'Greatness Unlocked • Optimum Advantage of Champions',
      subheading: '24g premium whey protein isolate as #1 ingredient with 5.5g BCAAs. Sourced directly from official Optimum Nutrition warehouses with verifiable hologram seals.',
      perks: ['24g Pure Protein', '5.5g BCAAs', 'Direct Factory Sealed', 'Official ON Partner'],
      image: '/banners/banner-on-whey.jpg',
      ctaText: 'Shop Optimum Nutrition',
      ctaAction: 'category',
      categoryParam: 'Protein',
      bgGradient: 'from-slate-950 via-red-950 to-slate-900',
      accentColor: 'from-red-400 via-amber-300 to-emerald-400',
      tagColor: 'bg-red-500/20 text-red-300 border-red-400/30'
    },
    {
      id: 'slide-mb-biozyme',
      badge: 'CHAMPION IS NOT IMPORTED • CLINICALLY TESTED',
      badgeIcon: <Flame className="w-3.5 h-3.5 text-orange-400" />,
      brand: 'MUSCLEBLAZE PERFORMANCE',
      title: 'Biozyme Performance Whey',
      highlight: 'Enhanced Absorption Formula (EAF®) • Phirse Zidd Kar',
      subheading: 'Clinically tested for 50% higher protein absorption and 60% lower stomach discomfort. Powered by Olympic Champion Neeraj Chopra with Labdoor USA certified purity.',
      perks: ['50% Higher Absorption', '25g Clean Protein', 'Zero Bloating', 'Labdoor USA Tested'],
      image: '/banners/banner-mb-biozyme.jpg',
      ctaText: 'Shop MuscleBlaze Biozyme',
      ctaAction: 'category',
      categoryParam: 'Protein',
      bgGradient: 'from-slate-950 via-zinc-900 to-amber-950',
      accentColor: 'from-amber-400 via-orange-300 to-emerald-400',
      tagColor: 'bg-orange-500/20 text-orange-300 border-orange-400/30'
    },
    {
      id: 'slide-dymatize-iso',
      badge: 'PRO ATHLETE STANDARD • ZERO LACTOSE',
      badgeIcon: <Zap className="w-3.5 h-3.5 text-cyan-300" />,
      brand: 'DYMATIZE ENTERPRISE',
      title: 'ISO 100 Hydrolyzed Whey Isolate',
      highlight: '25g Hydrolyzed Protein • 120 Calories • ≤1g Sugar',
      subheading: 'Ultra-fast digesting hydrolyzed whey isolate with less than 1g sugar and fat. Trusted worldwide by elite physique athletes for lean vascular muscle and instant recovery.',
      perks: ['25g Hydrolyzed Isolate', '120 Calories', 'Zero Lactose Bloat', 'Informed Choice Certified'],
      image: '/banners/banner-dymatize-iso.jpg',
      ctaText: 'Discover Dymatize ISO 100',
      ctaAction: 'products',
      bgGradient: 'from-slate-950 via-blue-950 to-slate-900',
      accentColor: 'from-cyan-400 via-teal-300 to-emerald-300',
      tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
    },
    {
      id: 'slide-authenticity-guarantee',
      badge: 'ANTI-COUNTERFEIT PROTECTION',
      badgeIcon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
      brand: 'PUREPRO DECENTRALIZED PROTOCOL',
      title: '100% Genuine Direct From Manufacturer',
      highlight: 'Scratch-Code Hologram on Every Single Tub',
      subheading: 'Eliminate counterfeit risks forever. Verify physical seal batches instantly using our direct manufacturer anti-counterfeit registry before consuming.',
      perks: ['Instant Batch Authentication', '100% Or 200% Refund', 'Tamper-Proof Seals', 'Direct Factory Logistics'],
      image: '/banners/banner-authenticity.jpg',
      ctaText: 'Verify Your Scratch Code Now',
      ctaAction: 'verify',
      bgGradient: 'from-emerald-950 via-slate-950 to-teal-950',
      accentColor: 'from-emerald-300 via-teal-200 to-white',
      tagColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-scroll logic (every 5 seconds when not hovered)
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;

    // Minimum swipe threshold of 50px
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleCtaClick = (slide: Slide) => {
    if (slide.ctaAction === 'verify') {
      navigateTo('verify');
    } else if (slide.ctaAction === 'category' && slide.categoryParam) {
      setActiveCategoryFilter(slide.categoryParam);
      navigateTo('products');
    } else {
      navigateTo('products');
    }
  };

  const activeSlideData = slides[currentSlide];

  return (
    <div 
      className="relative w-full overflow-hidden rounded-3xl shadow-2xl border border-slate-800/80 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Visual Container */}
      <div className={`relative min-h-[460px] sm:min-h-[420px] lg:min-h-[480px] bg-gradient-to-br ${activeSlideData.bgGradient} text-white flex flex-col justify-between transition-all duration-700 p-6 sm:p-10 lg:p-12`}>
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none transition-all duration-700"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-teal-500/15 blur-3xl pointer-events-none transition-all duration-700"></div>

        {/* Top Slide Meta: Badge + Slide Counter */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase border shadow-sm backdrop-blur-md ${activeSlideData.tagColor}`}>
            {activeSlideData.badgeIcon}
            <span>{activeSlideData.badge}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-slate-300 border border-white/10">
            <span className="text-emerald-400">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span className="text-slate-500">/</span>
            <span>{String(slides.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Main Banner Content Area: 2 Columns on Desktop */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto py-4">
          {/* Left: Text & CTA */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400/90 block mb-1">
                {activeSlideData.brand}
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                {activeSlideData.title}
              </h2>
              <p className={`text-sm sm:text-base font-extrabold mt-1 text-transparent bg-clip-text bg-gradient-to-r ${activeSlideData.accentColor}`}>
                {activeSlideData.highlight}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
              {activeSlideData.subheading}
            </p>

            {/* Perks Pills Grid */}
            <div className="flex flex-wrap gap-2 pt-1">
              {activeSlideData.perks.map((perk, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/10 backdrop-blur-md text-slate-200 px-2.5 py-1 rounded-lg border border-white/10"
                >
                  <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                  <span>{perk}</span>
                </span>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleCtaClick(activeSlideData)}
                className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-emerald shadow-lg flex items-center gap-2.5 hover:scale-102 active:scale-98"
              >
                <span>{activeSlideData.ctaText}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={() => navigateTo('verify')}
                className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-1.5 backdrop-blur-md"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify Code</span>
              </button>
            </div>
          </div>

          {/* Right: Featured High-Quality Product Showcase Container */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-88 lg:h-88 bg-black/40 backdrop-blur-md rounded-3xl p-2.5 border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-102 transition-transform duration-500 overflow-hidden">
              {/* Product Badge Pill */}
              <div className="absolute top-3 right-3 z-10 bg-emerald-600/95 text-white px-2.5 py-1 rounded-xl text-[10px] font-black tracking-wide shadow-md flex items-center gap-1 backdrop-blur-sm">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>Official Brand Image</span>
              </div>

              {/* Product Image */}
              <img
                src={activeSlideData.image}
                alt={activeSlideData.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/products/fallback.svg';
                }}
                className="w-full h-full object-cover rounded-2xl filter drop-shadow-xl transition-transform duration-700"
              />

              {/* Hologram stamp */}
              <div className="absolute bottom-3 left-3 z-10 bg-slate-950/90 text-slate-200 border border-emerald-500/40 px-3 py-1 rounded-xl text-[10px] font-mono font-bold shadow-md flex items-center gap-1.5 backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Direct Seal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Carousel Controls: Pagination Dots + Navigation Arrows */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          {/* Pagination Indicators / Progress Pills */}
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => {
              const isActive = currentSlide === index;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-9 bg-emerald-400 shadow-emerald shadow-sm'
                      : 'w-2.5 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                />
              );
            })}
          </div>

          {/* Left & Right Circular Arrow Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 active:bg-emerald-500 text-white flex items-center justify-center transition-all border border-white/20 backdrop-blur-md"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 active:bg-emerald-500 text-white flex items-center justify-center transition-all border border-white/20 backdrop-blur-md"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
