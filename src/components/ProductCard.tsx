'use client';

import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Sparkles, Plus, Check, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart } = useApp();
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultFlavor = product.flavors[0] || 'Standard';
    const defaultSize = product.sizes[0] || 'Standard';
    const added = addToCart(product, defaultFlavor, defaultSize, 1);
    if (added) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1200);
    }
  };

  const getDietBadge = (diet: string) => {
    if (diet === 'Vegan') {
      return (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">
          🌿 Vegan
        </span>
      );
    }
    if (diet === 'Vegetarian') {
      return (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          🌱 Veg
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
        🥩 Non-Veg
      </span>
    );
  };

  return (
    <div 
      onClick={() => navigateTo('product-detail', product.id)}
      className="supplement-card bg-white rounded-2xl border border-slate-100 p-3 shadow-soft hover:shadow-card hover:border-emerald-200 transition-all flex flex-col justify-between cursor-pointer group text-left relative"
    >
      <div>
        {/* FIXED 1:1 IMAGE CONTAINER WITH CONTAINMENT & PADDING (Prompt 3 Fix) */}
        <div className="aspect-square w-full bg-slate-50 rounded-xl p-3.5 flex items-center justify-center relative overflow-hidden mb-3 border border-slate-100/80">
          {/* Match % Badge */}
          {product.matchScore && (
            <div className="absolute top-2 left-2 z-10 bg-emerald-600/95 text-white px-2 py-0.5 rounded-lg text-[10px] font-black tracking-tight flex items-center gap-1 shadow-sm backdrop-blur-xs">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              {product.matchScore}% Match
            </div>
          )}

          {/* Best Seller or Rating Tag */}
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-800 shadow-xs border border-slate-200/50">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>

          {/* Supplement Product Image with object-fit: contain */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.endsWith('/products/fallback.svg')) {
                target.src = '/products/fallback.svg';
              }
            }}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Brand & Diet Tags */}
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 truncate">
              {product.brand}
            </span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold flex-shrink-0" title="Ultra Verified Brand">
              ✓
            </span>
          </div>
          {getDietBadge(product.target_diet)}
        </div>

        {/* Product Title */}
        <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors mb-1.5">
          {product.name}
        </h3>

        {/* Ratings & Customer Reviews Count */}
        <div className="flex items-center gap-1.5 mb-2 text-xs">
          <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded-md font-bold text-[11px] border border-amber-200/60">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            ({product.reviewsCount >= 1000 ? `${(product.reviewsCount / 1000).toFixed(1)}k` : product.reviewsCount} reviews)
          </span>
        </div>

        {/* Form, Protein Type & Servings Highlight */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2 text-[11px] text-slate-500 font-medium">
          {product.proteinType ? (
            <span className="bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md border border-emerald-200 text-[10px]">
              {product.proteinType}
            </span>
          ) : product.form === 'Capsule' ? (
            <span className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-md border border-purple-100">
              💊 Capsules
            </span>
          ) : product.form === 'Softgel' ? (
            <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-100">
              💧 Softgels
            </span>
          ) : product.protein_g > 0 ? (
            <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-100">
              ⚡ {product.protein_g}g Protein
            </span>
          ) : (
            <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
              ⚡ {product.category}
            </span>
          )}
          <span className="text-[10px] text-slate-400 truncate">
            {product.servings} Servings
          </span>
        </div>
      </div>

      {/* Price & Add to Cart */}
      <div className="pt-2 border-t border-slate-50 flex items-center justify-between mt-auto">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-950">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-slate-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Free Delivery</span>
        </div>

        <button
          onClick={handleQuickAdd}
          className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
            isAdded 
              ? 'bg-emerald-600 text-white scale-95 shadow-emerald' 
              : 'bg-slate-100 text-slate-800 hover:bg-emerald-600 hover:text-white group-hover:bg-emerald-600 group-hover:text-white'
          }`}
          title="Add to cart"
        >
          {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
