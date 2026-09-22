'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  Truck, 
  ShieldCheck,
  Lock
} from 'lucide-react';

export const CartScreen: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartTotal, 
    updateCartQuantity, 
    removeFromCart, 
    navigateTo, 
    clearCart,
    proceedToCheckout 
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === 'VITAL10' || couponCode.toUpperCase() === 'EMERALD') {
      setDiscountPercent(10);
      setCouponSuccess('10% VIP Fitness discount applied!');
    } else {
      setCouponError('Invalid coupon code. Try "VITAL10"');
    }
  };

  const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
  const finalTotal = cartTotal - discountAmount;

  if (cart.length === 0) {
    return (
      <div className="text-center py-24 px-4 max-w-lg mx-auto space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black text-slate-900">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-slate-500">
            Fuel your fitness journey with 100% verified proteins, pre-workouts, and daily vitality formulas.
          </p>
        </div>
        <button
          onClick={() => navigateTo('products')}
          className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-emerald transition-all inline-flex items-center gap-2"
        >
          <span>Explore Supplement Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('products')}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">Your Shopping Cart</h1>
            <p className="text-xs text-slate-500">{cart.length} unique items selected for your stack</p>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-500 hover:text-red-700 underline"
        >
          Clear Entire Cart
        </button>
      </div>

      {/* Free Shipping Notification */}
      <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 text-xs sm:text-sm flex items-center gap-3">
        <Truck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <span className="font-bold text-emerald-950">
          🎉 Congratulations! You have unlocked Free Express Delivery on this order.
        </span>
      </div>

      {/* 2-Column Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.product.id}-${item.flavor}-${item.size}`}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-soft flex flex-col sm:flex-row items-start sm:items-center gap-4 relative"
            >
              {/* FIXED 1:1 IMAGE CONTAINER (Prompt 3 requirement) */}
              <div className="aspect-square w-24 sm:w-28 bg-slate-50 rounded-xl p-2.5 flex items-center justify-center flex-shrink-0 border border-slate-100 overflow-hidden">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-600 block">
                  {item.product.brand}
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  {item.product.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Flavor: <span className="font-semibold text-slate-700">{item.flavor}</span> • Size: <span className="font-semibold text-slate-700">{item.size}</span>
                </p>

                <div className="pt-2 flex items-center justify-between sm:justify-start gap-6">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 bg-slate-50 rounded-xl p-1">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.flavor, item.size, -1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-black text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.flavor, item.size, 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-black text-slate-950 text-base sm:text-lg">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.product.id, item.flavor, item.size)}
                className="self-end sm:self-auto p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                title="Remove product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary (Sticky on Desktop) */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-32">
          {/* Coupon Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Have a Promo Code?
            </h4>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Try 'VITAL10'"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:outline-none focus:border-emerald-600"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Apply
              </button>
            </form>

            {couponSuccess && <p className="text-xs font-bold text-emerald-600">{couponSuccess}</p>}
            {couponError && <p className="text-xs font-bold text-red-500">{couponError}</p>}
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft space-y-4 text-xs">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
              Order Price Summary
            </h3>

            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-900">₹{cartSubtotal.toLocaleString()}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>VIP Discount ({discountPercent}%)</span>
                <span>-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Shipping Charges</span>
              <span className="font-bold text-emerald-600 uppercase">FREE (Express)</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>GST / Taxes (18% Included)</span>
              <span className="font-bold text-slate-900">₹{Math.round(finalTotal * 0.18).toLocaleString()}</span>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
              <span className="font-black text-slate-950 text-base">Grand Total</span>
              <span className="font-black text-emerald-700 text-2xl">₹{finalTotal.toLocaleString()}</span>
            </div>

            <button
              onClick={proceedToCheckout}
              className="w-full py-4 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-emerald transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-slate-400 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
