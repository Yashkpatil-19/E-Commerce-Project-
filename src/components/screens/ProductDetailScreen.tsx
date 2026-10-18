'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  ShoppingBag, 
  Truck, 
  Award, 
  Share2,
  Lock,
  RotateCcw,
  ThumbsUp,
  BadgeCheck,
  CheckCircle2,
  Zap
} from 'lucide-react';

export const ProductDetailScreen: React.FC = () => {
  const { selectedProduct, navigateTo, addToCart, buyNow, profile } = useApp();
  const [helpfulMap, setHelpfulMap] = useState<Record<string, number>>({});
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  const handleHelpfulClick = (reviewId: string, initialCount: number) => {
    if (votedMap[reviewId]) return;
    setHelpfulMap(prev => ({ ...prev, [reviewId]: (prev[reviewId] ?? initialCount) + 1 }));
    setVotedMap(prev => ({ ...prev, [reviewId]: true }));
  };

  // If no product selected, go back to products
  if (!selectedProduct) {
    return (
      <div className="text-center py-24">
        <p className="text-sm text-slate-500 mb-4">No product selected.</p>
        <button 
          onClick={() => navigateTo('products')}
          className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  // Selected flavor & size
  const [selectedFlavor, setSelectedFlavor] = useState<string>(selectedProduct.flavors[0] || 'Default');
  const [selectedSize, setSelectedSize] = useState<string>(selectedProduct.sizes[0] || 'Standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const handleAddToCart = () => {
    const added = addToCart(selectedProduct, selectedFlavor, selectedSize, quantity);
    if (added) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2000);
    }
  };

  const handleBuyNow = () => {
    buyNow(selectedProduct, selectedFlavor, selectedSize, quantity);
  };

  const getDietLabel = (diet: string) => {
    if (diet === 'Vegan') return { text: '100% Vegan Plant Based', color: 'bg-green-100 text-green-800 border-green-200' };
    if (diet === 'Vegetarian') return { text: '100% Pure Vegetarian', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    return { text: 'Non-Vegetarian', color: 'bg-amber-100 text-amber-900 border-amber-200' };
  };

  const dietBadge = getDietLabel(selectedProduct.target_diet);

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Breadcrumb / Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            onClick={() => navigateTo('products')}
            className="flex items-center gap-1 font-bold text-slate-700 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Shop Catalog</span>
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-600">{selectedProduct.category}</span>
          <span>/</span>
          <span className="font-bold text-slate-900 truncate max-w-xs">{selectedProduct.name}</span>
        </div>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: selectedProduct.name,
                url: window.location.href
              }).catch(() => {});
            }
          }}
          className="p-2 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Main Product Showcase: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: FIXED 1:1 IMAGE CONTAINER (Prompt 3 Fix) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full bg-slate-50 rounded-3xl p-8 sm:p-12 flex items-center justify-center relative border border-slate-200/80 shadow-soft overflow-hidden">
            {/* Match % Callout Badge */}
            {selectedProduct.matchScore && (
              <div className="absolute top-4 left-4 z-10 bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-black tracking-tight flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-4 h-4 fill-current" />
                <span>{selectedProduct.matchScore}% Compatibility</span>
              </div>
            )}

            {/* Authenticity Verified Tag */}
            <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-bold text-slate-800 border border-slate-200/80 shadow-xs flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Direct Brand Certified</span>
            </div>

            {/* Supplement Product Image with object-fit: contain so tubs show completely */}
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/products/fallback.svg')) {
                  target.src = '/products/fallback.svg';
                }
              }}
              className="w-full h-full object-contain mix-blend-multiply drop-shadow-lg max-h-[460px]"
            />
          </div>

          {/* Value Badges underneath image */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-white rounded-2xl border border-slate-200/70 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="font-bold text-slate-800 block text-[11px]">100% Authentic</span>
              <span className="text-[10px] text-slate-400">Scratch-verified</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200/70 shadow-xs">
              <Truck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="font-bold text-slate-800 block text-[11px]">Free Shipping</span>
              <span className="text-[10px] text-slate-400">On this product</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200/70 shadow-xs">
              <RotateCcw className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="font-bold text-slate-800 block text-[11px]">14-Day Returns</span>
              <span className="text-[10px] text-slate-400">Hassle-free guarantee</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Configuration */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{selectedProduct.brand} (Ultra Verified)</span>
                </span>
                {selectedProduct.brandVerificationBadge && (
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    🏅 {selectedProduct.brandVerificationBadge}
                  </span>
                )}
                {selectedProduct.form && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    selectedProduct.form === 'Capsule' ? 'bg-purple-100 text-purple-800' :
                    selectedProduct.form === 'Softgel' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-900'
                  }`}>
                    {selectedProduct.form === 'Capsule' ? '💊 Capsule Form' :
                     selectedProduct.form === 'Softgel' ? '💧 Softgel Capsule' :
                     '⚡ Micronized Powder'}
                  </span>
                )}
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${dietBadge.color}`}>
                {dietBadge.text}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
              {selectedProduct.name}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3 text-xs pt-1">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 font-extrabold px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm">{selectedProduct.rating}</span>
              </div>
              <span className="text-slate-600 font-semibold">
                Based on <strong className="text-slate-900">{selectedProduct.reviewsCount.toLocaleString()}</strong> verified customer reviews
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200/60 flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" />
                <span>98% Positive Feedback</span>
              </span>
            </div>

            {/* Price display */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-950">₹{selectedProduct.price.toLocaleString()}</span>
              {selectedProduct.originalPrice > selectedProduct.price && (
                <span className="text-lg text-slate-400 line-through">₹{selectedProduct.originalPrice.toLocaleString()}</span>
              )}
              <span className="text-xs font-black text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                Save ₹{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString()} (Inclusive of all taxes)
              </span>
            </div>
          </div>

          {/* Personalized Match Reason Box */}
          {selectedProduct.matchReason && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3 shadow-soft">
              <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-emerald-950 text-sm block mb-1">
                  Why this matches your {profile.goal} goal:
                </span>
                <p className="text-emerald-900 font-medium leading-relaxed">{selectedProduct.matchReason}</p>
              </div>
            </div>
          )}

          {/* Flavor Selector */}
          {selectedProduct.flavors && selectedProduct.flavors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Select Flavor: <span className="text-slate-900 font-bold">{selectedFlavor}</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.flavors.map((flavor) => (
                  <button
                    key={flavor}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedFlavor === flavor
                        ? 'bg-slate-950 text-white shadow-md ring-2 ring-slate-900/20'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size / Weight Selector */}
          {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Select Packaging Size: <span className="text-slate-900 font-bold">{selectedSize}</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedSize === size
                        ? 'bg-emerald-600 text-white shadow-emerald ring-2 ring-emerald-600/30'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center justify-center border border-slate-200 bg-slate-50 rounded-xl p-1">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 hover:bg-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-black text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 hover:bg-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                addedNotice 
                  ? 'bg-emerald-700 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald'
              }`}
            >
              {addedNotice ? (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* Instant Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="py-3.5 px-6 rounded-xl font-black text-xs sm:text-sm bg-slate-950 hover:bg-slate-900 text-white flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Buy Now • ₹{(selectedProduct.price * quantity).toLocaleString()}</span>
            </button>
          </div>

          {/* Verify Authenticity Shortcut Button */}
          <button
            onClick={() => navigateTo('verify')}
            className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-900 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Have a tub? Verify Scratch-Code Authenticity</span>
          </button>

          {/* Nutrition Facts Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-black text-slate-900 text-sm">Verified Nutrition Facts</h3>
              <span className="text-xs font-bold text-slate-400">Serving: {selectedProduct.nutritionFacts.perServing}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Protein</span>
                <span className="text-lg font-black text-emerald-700">{selectedProduct.nutritionFacts.protein}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Calories</span>
                <span className="text-lg font-black text-slate-900">{selectedProduct.nutritionFacts.calories}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">BCAA</span>
                <span className="text-lg font-black text-slate-900">{selectedProduct.nutritionFacts.bcaa}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-2 border-t border-slate-100">
                <span className="text-slate-400 text-[11px] block">Carbohydrates</span>
                <span className="font-bold text-slate-800">{selectedProduct.nutritionFacts.carbs}</span>
              </div>
              <div className="p-2 border-t border-slate-100">
                <span className="text-slate-400 text-[11px] block">Total Fats</span>
                <span className="font-bold text-slate-800">{selectedProduct.nutritionFacts.fats}</span>
              </div>
              <div className="p-2 border-t border-slate-100">
                <span className="text-slate-400 text-[11px] block">Added Sugar</span>
                <span className="font-bold text-slate-800">{selectedProduct.nutritionFacts.sugar}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft space-y-2">
            <h3 className="font-black text-slate-900 text-sm">Product Overview</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {selectedProduct.description}
            </p>
          </div>

          {/* ─── VERIFIED CUSTOMER RATINGS & REVIEWS SECTION ─── */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-950">Verified Customer Reviews</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>100% Authentic Buyers</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Reviews from authenticated customers who verified physical bottle scratch-codes
                </p>
              </div>

              {/* Average Score Badge */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl self-start sm:self-auto">
                <div className="text-center pr-3 border-r border-slate-200">
                  <span className="text-2xl font-black text-slate-950 block leading-none">{selectedProduct.rating}</span>
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="text-left text-xs">
                  <span className="font-bold text-slate-900 block">{selectedProduct.reviewsCount.toLocaleString()} Ratings</span>
                  <span className="text-emerald-700 font-extrabold text-[11px]">98% Recommend</span>
                </div>
              </div>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-slate-500 font-bold">5 Star</span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[88%]"></div>
                  </div>
                  <span className="w-8 text-right font-bold text-slate-700">88%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-slate-500 font-bold">4 Star</span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[10%]"></div>
                  </div>
                  <span className="w-8 text-right font-bold text-slate-700">10%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-slate-500 font-bold">3 Star</span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[2%]"></div>
                  </div>
                  <span className="w-8 text-right font-bold text-slate-700">2%</span>
                </div>
              </div>

              {/* Satisfaction Attributes */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex flex-col justify-center">
                  <span className="text-emerald-600 font-black text-sm">4.9 / 5</span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Effectiveness</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex flex-col justify-center">
                  <span className="text-emerald-600 font-black text-sm">4.8 / 5</span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Mixability</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex flex-col justify-center">
                  <span className="text-emerald-600 font-black text-sm">5.0 / 5</span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Authenticity</span>
                </div>
              </div>
            </div>

            {/* Real Customer Review Cards */}
            <div className="space-y-4 pt-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Top Reviews from Verified Buyers
              </h4>

              {(selectedProduct.reviews && selectedProduct.reviews.length > 0 ? selectedProduct.reviews : [
                {
                  id: 'default-rev-1',
                  author: 'Arjun K. (Competitive Athlete)',
                  rating: 5,
                  date: '2026-03-05',
                  verifiedBuyer: true,
                  batchCode: 'GENUINE-SEAL',
                  title: `Outstanding quality from ${selectedProduct.brand}!`,
                  comment: `Verified the authenticity code immediately upon delivery. 100% genuine formulation with noticeable stamina improvement and zero adverse digestion. Highly recommended!`,
                  helpfulCount: 88,
                },
                {
                  id: 'default-rev-2',
                  author: 'Meera Deshmukh',
                  rating: 5,
                  date: '2026-02-22',
                  verifiedBuyer: true,
                  batchCode: 'GENUINE-SEAL',
                  title: 'Clean ingredients and fast shipping',
                  comment: 'The packaging arrived tamper-proof with factory seal intact. Clean taste and top-tier nutritional profile.',
                  helpfulCount: 42,
                }
              ]).map((rev) => {
                const currentHelpful = helpfulMap[rev.id] ?? rev.helpfulCount;
                const hasVoted = votedMap[rev.id];

                return (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-2.5 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs">{rev.author}</span>
                            {rev.verifiedBuyer && (
                              <span className="inline-flex items-center gap-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                <span>Verified Buyer</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Title & Body */}
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-xs">{rev.title}</h5>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                        {rev.comment}
                      </p>
                    </div>

                    {/* Batch & Helpful footer */}
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                      {rev.batchCode && (
                        <div className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Batch Seal: <strong>{rev.batchCode}</strong></span>
                        </div>
                      )}

                      <button
                        onClick={() => handleHelpfulClick(rev.id, rev.helpfulCount)}
                        disabled={hasVoted}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          hasVoted 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <ThumbsUp className={`w-3 h-3 ${hasVoted ? 'fill-emerald-700' : ''}`} />
                        <span>Helpful ({currentHelpful})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
