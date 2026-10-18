'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Package, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Upload, 
  FileText, 
  AlertCircle, 
  Sliders, 
  Sparkles, 
  ArrowRight,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  RefreshCw,
  Calendar,
  Dumbbell,
  Award,
  MessageSquare
} from 'lucide-react';
import { OrderStatus, TargetGoal, TargetDiet, ActivityLevel } from '../../types';

export const UserProfileScreen: React.FC = () => {
  const { 
    currentUser, 
    profile, 
    updateProfile, 
    orders, 
    refreshOrders, 
    uploadPaymentProof, 
    updateOrderStatus,
    verifiedCodes,
    navigateTo, 
    openAuthModal,
    openAssessment,
    appointmentRequests,
    coaches
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'appointments' | 'verified'>('orders');

  // Profile edit state
  const [editAge, setEditAge] = useState(profile.age);
  const [editWeight, setEditWeight] = useState(profile.weight);
  const [editGoal, setEditGoal] = useState<TargetGoal>(profile.goal);
  const [editDiet, setEditDiet] = useState<TargetDiet>(profile.diet);
  const [editActivity, setEditActivity] = useState<ActivityLevel>(profile.activity);
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);

  // Uploading state per order
  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!currentUser) {
    return (
      <div className="text-center py-20 px-4 max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Sign In to View Your Profile</h2>
        <p className="text-xs text-slate-500">
          Access your real-time InsForge order tracking, purchase history, payment receipts, and fitness recommendations.
        </p>
        <button
          onClick={() => openAuthModal()}
          className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-emerald transition-all"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...profile,
      age: editAge,
      weight: editWeight,
      goal: editGoal,
      diet: editDiet,
      activity: editActivity
    });
    setProfileSavedNotice(true);
    setTimeout(() => setProfileSavedNotice(false), 2500);
  };

  const handleFileUpload = async (orderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingOrderId(orderId);
    setUploadMessage('Uploading receipt to InsForge Storage...');

    const res = await uploadPaymentProof(file, orderId);

    if (res.success) {
      setUploadMessage('✓ Payment receipt uploaded and linked to your order!');
      await refreshOrders();
    } else {
      setUploadMessage(`Upload notice: ${res.error || 'Saved locally'}`);
    }

    setTimeout(() => {
      setUploadingOrderId(null);
      setUploadMessage(null);
    }, 3500);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshOrders();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-[11px] font-black uppercase">Order Placed</span>;
      case 'processing':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md text-[11px] font-black uppercase">Authenticating Batch</span>;
      case 'shipped':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md text-[11px] font-black uppercase flex items-center gap-1"><Truck className="w-3 h-3" /> Dispatched</span>;
      case 'delivered':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md text-[11px] font-black uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'cancelled':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-md text-[11px] font-black uppercase">Cancelled</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase">{status}</span>;
    }
  };

  const getStepProgress = (status: OrderStatus) => {
    const steps = ['placed', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(status);
    return Math.max(0, currentIndex >= 0 ? currentIndex : 0);
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-black text-2xl flex items-center justify-center shadow-emerald shadow-md">
              {currentUser.name ? currentUser.name.slice(0, 1).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{currentUser.name}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> InsForge Cloud Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          {/* User Quick Stats */}
          <div className="flex items-center gap-3 text-center">
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl min-w-[90px]">
              <span className="text-xl font-black text-emerald-400 block leading-none">{orders.length}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">Total Orders</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl min-w-[90px]">
              <span className="text-xl font-black text-white block leading-none">{profile.weight} kg</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">Target Weight</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl min-w-[90px]">
              <span className="text-xs font-black text-emerald-400 block leading-none truncate max-w-[90px]">{profile.goal}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">Fitness Goal</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-white/10 mt-6 pt-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-emerald'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders & Tracking ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-emerald'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Nutrition & Goal Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'appointments'
                ? 'bg-emerald-600 text-white shadow-emerald'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Appointments ({appointmentRequests.filter(r => r.userId === currentUser.id || r.userId === 'guest-user').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('verified')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'verified'
                ? 'bg-emerald-600 text-white shadow-emerald'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Tubs ({verifiedCodes.length})</span>
          </button>
        </div>
      </div>

      {/* ─── TAB 1: ORDERS & TRACKING ─── */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">Purchase History & Live Tracking</h2>
              <p className="text-xs text-slate-500">Live order status, manufacturer batch tracking, and payment verification receipts</p>
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          {uploadMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="font-bold">{uploadMessage}</span>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-soft">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Orders Placed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your order history is currently empty. Explore our verified supplements stack with 100% manufacturer warranty.
              </p>
              <button
                onClick={() => navigateTo('products')}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-emerald transition-all inline-flex items-center gap-2"
              >
                <span>Browse Supplement Store</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const currentStep = getStepProgress(order.status);

                return (
                  <div 
                    key={order.id} 
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-5 transition-all hover:border-emerald-200"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 font-mono">
                            {order.orderNumber || order.id}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-500">{order.date}</span>
                        </div>
                        {order.trackingNumber && (
                          <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                            Tracking: <strong className="text-slate-700">{order.trackingNumber}</strong>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}
                        <span className="text-base font-black text-slate-950">₹{order.total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* 5-Step Visual Delivery Progress Pipeline */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Delivery Pipeline: <strong>{order.estimatedDelivery || 'Express Courier'}</strong></span>
                        </span>
                        <span className="text-[10px] text-slate-400">InsForge Live Dispatch</span>
                      </div>

                      {/* Progress Steps */}
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                        {[
                          { label: 'Order Placed', step: 0 },
                          { label: 'Lab Authentication', step: 1 },
                          { label: 'Dispatched', step: 2 },
                          { label: 'Delivered', step: 3 }
                        ].map((s) => {
                          const isDone = currentStep >= s.step;
                          const isCurrent = currentStep === s.step;

                          return (
                            <div key={s.label} className="space-y-1">
                              <div className={`h-2 rounded-full transition-all ${
                                isDone 
                                  ? 'bg-emerald-500' 
                                  : 'bg-slate-200'
                              }`} />
                              <span className={isCurrent ? 'text-emerald-700 font-black' : isDone ? 'text-slate-700' : 'text-slate-400'}>
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Items ({order.items.length})</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.items.map((item, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                          >
                            <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200/60 flex items-center justify-center flex-shrink-0">
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
                              <h5 className="font-bold text-slate-900 text-xs truncate">{item.product.name}</h5>
                              <p className="text-[11px] text-slate-500">
                                {item.flavor} • {item.size} • Qty: <strong>{item.quantity}</strong>
                              </p>
                            </div>
                            <span className="font-black text-xs text-slate-900">
                              ₹{(item.product.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Proof Upload & Status Section */}
                    <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        {order.paymentProofUrl ? (
                          <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Payment Proof Verified</span>
                            <a 
                              href={order.paymentProofUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-emerald-600 hover:text-emerald-800 underline inline-flex items-center gap-0.5 ml-1"
                            >
                              <span>View Receipt</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-xl font-bold">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span>Payment: {order.paymentMethod?.toUpperCase() || 'UPI'} (Pending Receipt)</span>
                          </div>
                        )}
                      </div>

                      {/* Upload File Input for Storage Bucket */}
                      <div className="flex items-center gap-2">
                        <label 
                          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs cursor-pointer border flex items-center gap-1.5 transition-colors ${
                            uploadingOrderId === order.id
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{order.paymentProofUrl ? 'Re-upload Receipt' : 'Upload Payment Proof'}</span>
                          <input 
                            type="file" 
                            accept="image/*,.pdf" 
                            disabled={uploadingOrderId === order.id}
                            onChange={(e) => handleFileUpload(order.id, e)}
                            className="hidden" 
                          />
                        </label>

                        <button
                          onClick={() => navigateTo('verify')}
                          className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verify Tub Batch</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: NUTRITION & GOAL SETTINGS ─── */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">Nutritional Profile & Compatibility Engine</h2>
              <p className="text-xs text-slate-500">
                Personalized algorithm adapts protein scoring, recommended dosages, and creatine compatibility to your physiology.
              </p>
            </div>
            <button
              type="button"
              onClick={openAssessment}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Retake 6-Pillar Clinical Quiz</span>
            </button>
          </div>

          {/* Muscle Gain Journey Recommendation Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-5 text-white border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft">
            <div className="space-y-1 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl">💪</span>
                <h3 className="font-black text-sm text-white">Target Objective: Muscle Gain (Hypertrophy)</h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Calibrated for your {profile.weight}kg body weight. Access customized progressive resistance routines and track daily caloric expenditure.
              </p>
            </div>

            <a
              href="/fitness-journey?plan=build-muscle"
              onClick={(e) => {
                e.preventDefault();
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', '/fitness-journey?plan=build-muscle');
                }
                navigateTo('fitness-journey');
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs whitespace-nowrap shadow-emerald flex items-center gap-1.5 transition-all cursor-pointer active:scale-98"
            >
              <span>Start Your Muscle Gain Journey →</span>
            </a>
          </div>

          {profileSavedNotice && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="font-bold">Preferences saved! Re-calculating your supplement match scores...</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Your Age</label>
                <input
                  type="number"
                  min="16"
                  max="80"
                  value={editAge}
                  onChange={(e) => setEditAge(Number(e.target.value))}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Body Weight (kg)</label>
                <input
                  type="number"
                  min="35"
                  max="160"
                  value={editWeight}
                  onChange={(e) => setEditWeight(Number(e.target.value))}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Primary Fitness Goal</label>
                <select
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value as TargetGoal)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Muscle Gain">Muscle Gain (Hypertrophy)</option>
                  <option value="Fat Loss">Fat Loss & Definition</option>
                  <option value="Endurance">Endurance & Stamina</option>
                  <option value="General Fitness">General Daily Vitality</option>
                  <option value="Athletic Performance">Athletic Performance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Dietary Preference</label>
                <select
                  value={editDiet}
                  onChange={(e) => setEditDiet(e.target.value as TargetDiet)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Vegetarian">🌱 Vegetarian</option>
                  <option value="Vegan">🌿 100% Vegan</option>
                  <option value="Non-Vegetarian">🥩 Non-Vegetarian</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Training Activity</label>
                <select
                  value={editActivity}
                  onChange={(e) => setEditActivity(e.target.value as ActivityLevel)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Sedentary">Sedentary (1-2 days)</option>
                  <option value="Moderate">Moderate (3-4 days)</option>
                  <option value="High">High (5-6 days intense)</option>
                  <option value="Athlete">Competitive Athlete</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Update Nutrition Profile</span>
            </button>
          </form>
        </div>
      )}

      {/* ─── TAB: MY APPOINTMENTS ─── */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-950">My Coach Consultations</h2>
              <p className="text-xs text-slate-500">Live booking status and schedule with verified fitness mentors</p>
            </div>
            <button
              onClick={() => navigateTo('fitness-journey')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-emerald flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book New Consultation</span>
            </button>
          </div>

          {appointmentRequests.filter(r => r.userId === currentUser.id || r.userId === 'guest-user').length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No consultation requests yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore verified coaches at the bottom of your Fitness Journey and request personalized guidance.
              </p>
              <button
                onClick={() => navigateTo('fitness-journey')}
                className="mt-2 px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Explore Coaches →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {appointmentRequests
                .filter(r => r.userId === currentUser.id || r.userId === 'guest-user')
                .map((apt) => {
                  const coach = coaches.find(c => c.id === apt.coachId) || coaches[0];

                  return (
                    <div
                      key={apt.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={coach?.photo}
                          alt={coach?.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = '/purepro-logo.png';
                          }}
                          className="w-12 h-12 rounded-xl object-cover border border-emerald-300 flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-900 text-sm">{coach?.name}</h4>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              apt.status === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : apt.status === 'Declined'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                              {apt.status === 'Confirmed' ? '✓ Confirmed' : apt.status === 'Declined' ? 'Declined' : 'Pending Coach Review'}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 font-medium flex items-center gap-3">
                            <span className="flex items-center gap-1 font-bold text-slate-800">
                              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                              {apt.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-bold text-slate-800">
                              <Clock className="w-3.5 h-3.5 text-emerald-600" />
                              {apt.time}
                            </span>
                            <span>•</span>
                            <span className="uppercase text-slate-500 text-[11px]">
                              {apt.planId.replace('-', ' ')}
                            </span>
                          </div>

                          {apt.message && (
                            <p className="text-xs text-slate-500 italic mt-1 bg-white p-2 rounded-lg border border-slate-100 max-w-lg">
                              &ldquo;{apt.message}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:self-center">
                        {apt.status === 'Confirmed' ? (
                          <div className="text-right">
                            <span className="text-[11px] font-bold text-emerald-700 block">Slot Confirmed</span>
                            <span className="text-[10px] text-slate-400">Meeting link shared</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Awaiting coach confirmation</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: VERIFIED TUBS LOG ─── */}
      {activeTab === 'verified' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-950">Verified Authenticity Batch Records</h2>
              <p className="text-xs text-slate-500">Every scratch hologram validated against InsForge manufacturer registry</p>
            </div>
            <button
              onClick={() => navigateTo('verify')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-emerald"
            >
              Verify Another Tub
            </button>
          </div>

          {verifiedCodes.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No physical scratch-codes verified yet on this account.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {verifiedCodes.map((v, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-800 uppercase">{v.brand}</span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">
                      ✓ GENUINE
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">{v.product}</h4>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60 font-mono">
                    <span>Code: {v.code}</span>
                    <span>Batch: {v.batch}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
