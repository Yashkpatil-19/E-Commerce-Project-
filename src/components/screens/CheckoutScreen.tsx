'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Lock, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Loader2, 
  AlertCircle, 
  QrCode,
  CheckCircle2,
  Upload
} from 'lucide-react';
import { ShippingDetails } from '../../types';

export const CheckoutScreen: React.FC = () => {
  const { cart, cartTotal, placeOrder, navigateTo, profile, currentUser, openAuthModal, uploadPaymentProof } = useApp();

  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);

  const [formData, setFormData] = useState<ShippingDetails>({
    fullName: currentUser?.name || 'Rahul Sharma',
    email: currentUser?.email || 'rahul.fitness@example.com',
    phone: '9876543210',
    address: 'Flat 402, Green Glen Heights, Outer Ring Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    paymentMethod: 'paypal'
  });

  // Sync form when user logs in
  React.useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.name || prev.fullName,
        email: currentUser.email || prev.email
      }));
    }
  }, [currentUser]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full name (minimum 3 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.address.trim() || formData.address.trim().length < 6) {
      errs.address = 'Please provide a complete street address';
    }

    if (!formData.city.trim()) {
      errs.city = 'City is required';
    }

    if (!formData.pincode.trim() || formData.pincode.trim().length < 4) {
      errs.pincode = 'Valid PIN / Postal code required';
    }

    if (cart.length === 0) {
      errs.cart = 'Your shopping cart is empty';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!currentUser) {
      openAuthModal('Please sign in or create an account to finalize and place your order.');
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let proofUrl: string | undefined;
      let proofKey: string | undefined;

      if (paymentProofFile) {
        setUploadingProof(true);
        const uploadRes = await uploadPaymentProof(paymentProofFile);
        if (uploadRes.success) {
          proofUrl = uploadRes.url;
          proofKey = uploadRes.key;
        }
        setUploadingProof(false);
      }

      const result = await placeOrder(formData, proofUrl, proofKey);

      if (!result.success) {
        setSubmitError(result.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      navigateTo('order-confirmation');
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={() => navigateTo('cart')}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">Express Secure Checkout</h1>
          <p className="text-xs text-slate-500">256-Bit SSL Encrypted Direct Manufacturer Order</p>
        </div>
      </div>

      {/* Required Sign In Alert Banner */}
      {!currentUser && (
        <div className="p-4 bg-emerald-50 border border-emerald-200/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-900 text-sm">Sign in required to place order</p>
              <p className="text-slate-600">Please sign in or create an account to authenticate your purchase and activate warranty.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal('Please sign in or create an account to finalize your order.')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs whitespace-nowrap shadow-emerald transition-all"
          >
            Sign In / Create Account
          </button>
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <div>
            <span className="font-bold text-sm block">Submission Alert:</span>
            <span>{submitError}</span>
          </div>
        </div>
      )}

      {/* 2-Column Form & Summary Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Customer Info & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Shipping Address */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>1. Shipping & Contact Details</span>
              </h2>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Free Express Delivery
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border ${
                    errors.fullName ? 'border-red-400' : 'border-slate-200'
                  } rounded-xl font-medium focus:outline-none focus:bg-white focus:border-emerald-600`}
                />
                {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@email.com"
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border ${
                    errors.email ? 'border-red-400' : 'border-slate-200'
                  } rounded-xl font-medium focus:outline-none focus:bg-white focus:border-emerald-600`}
                />
                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Phone (10 digits) *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="9876543210"
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border ${
                    errors.phone ? 'border-red-400' : 'border-slate-200'
                  } rounded-xl font-medium focus:outline-none focus:bg-white focus:border-emerald-600`}
                />
                {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Street Address *</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Apartment, Street, Area, Landmark"
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border ${
                    errors.address ? 'border-red-400' : 'border-slate-200'
                  } rounded-xl font-medium focus:outline-none focus:bg-white focus:border-emerald-600`}
                ></textarea>
                {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">PIN Code *</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Selector */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft space-y-4">
            <h2 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>2. Choose Payment Method</span>
            </h2>

            <div className="space-y-3">
              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'paypal'
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={() => {}}
                    className="accent-emerald-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">PayPal.me & Global Cards</span>
                    <span className="text-xs text-slate-500">Auto-appends order total: ₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
                <span className="text-sm font-black text-blue-700">PayPal</span>
              </label>

              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'upi'
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={() => {}}
                    className="accent-emerald-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Instant UPI & QR Code (India)</span>
                    <span className="text-xs text-slate-500">Google Pay, PhonePe, Paytm, BHIM UPI</span>
                  </div>
                </div>
                <QrCode className="w-5 h-5 text-emerald-600" />
              </label>

              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={() => {}}
                    className="accent-emerald-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Cash on Delivery</span>
                    <span className="text-xs text-slate-500">Pay cash upon delivery verification</span>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-slate-400" />
              </label>

              {/* Optional Payment Proof Receipt Upload */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Upload Payment Receipt / UPI Screenshot (Optional)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">InsForge Storage</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Attach your payment confirmation screenshot for expedited dispatch and priority batch allocation.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setPaymentProofFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white file:text-emerald-800 file:border-slate-200 file:border hover:file:bg-slate-100 cursor-pointer"
                  />
                  {paymentProofFile && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Attached: {paymentProofFile.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Order Review & Submit (Sticky on Desktop) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-32">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4 text-xs">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
              Order Summary ({cart.length} items)
            </h3>

            {/* Compact Item Thumbnails */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-white rounded-lg p-1 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = '/products/fallback.svg';
                      }}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs truncate">{item.product.name}</h4>
                    <span className="text-[10px] text-slate-500 block">
                      {item.flavor} • {item.size} • Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 text-xs">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing math */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Total Items Cost</span>
                <span className="font-bold text-slate-900">₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Express Delivery</span>
                <span className="font-bold text-emerald-600 uppercase">FREE</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between items-baseline">
                <span className="font-black text-slate-950 text-sm">Total Payable</span>
                <span className="font-black text-emerald-700 text-xl">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Profile sync tag */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-950 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                Order synced with your <strong>{profile.goal}</strong> & <strong>{profile.diet}</strong> profile. Dispatched directly from authorized partner hubs.
              </span>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                isSubmitting
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald active:scale-98'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Order & Syncing to Formspree...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order • ₹{cartTotal.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
