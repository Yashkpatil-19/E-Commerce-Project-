'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle, 
  ExternalLink, 
  ShoppingBag, 
  Truck, 
  ArrowRight, 
  ShieldCheck, 
  QrCode, 
  Download,
  Award
} from 'lucide-react';

export const OrderConfirmationScreen: React.FC = () => {
  const { latestOrder, navigateTo } = useApp();

  const order = latestOrder;
  const PAYPAL_ME_LINK = process.env.NEXT_PUBLIC_PAYPAL_ME_LINK || 'https://paypal.me/YOUR_PAYPAL_ME_LINK';

  if (!order) {
    return (
      <div className="text-center py-24 px-4 max-w-md mx-auto space-y-4">
        <p className="text-sm text-slate-500">No active order found.</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const paymentRedirectUrl = `${PAYPAL_ME_LINK}/${order.total}`;

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      {/* Celebration Header */}
      <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center shadow-emerald relative overflow-hidden border border-emerald-900/60">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <CheckCircle className="w-9 h-9" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
          Order Successfully Dispatched & Registered
        </span>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-3 mb-1">
          Thank You, {order.shippingDetails.fullName}!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Order ID: <span className="font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded">{order.id}</span>
        </p>

        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-around text-center text-xs sm:text-sm">
          <div>
            <span className="text-[11px] text-slate-400 block">Order Date</span>
            <span className="font-bold text-white">{order.date}</span>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div>
            <span className="text-[11px] text-slate-400 block">Estimated Delivery</span>
            <span className="font-bold text-emerald-300">2 - 3 Business Days</span>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div>
            <span className="text-[11px] text-slate-400 block">Total Amount</span>
            <span className="font-bold text-white">₹{order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Redirection Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <span>💳 Payment Completion</span>
          </h3>
          <span className="text-base font-black text-emerald-700">₹{order.total.toLocaleString()}</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          {order.shippingDetails.paymentMethod === 'paypal' ? (
            <>Complete payment seamlessly on PayPal.me with your order total auto-appended.</>
          ) : order.shippingDetails.paymentMethod === 'upi' ? (
            <>Scan the QR code below or pay via any UPI app (GPay, PhonePe, Paytm, BHIM).</>
          ) : (
            <>Cash on Delivery chosen. Please keep ₹{order.total.toLocaleString()} ready upon delivery.</>
          )}
        </p>

        {order.shippingDetails.paymentMethod === 'paypal' && (
          <a
            href={paymentRedirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Proceed to PayPal.me (₹{order.total})</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {order.shippingDetails.paymentMethod === 'upi' && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-32 h-32 bg-white border border-slate-300 rounded-2xl mx-auto flex items-center justify-center p-2 shadow-sm">
              <QrCode className="w-28 h-28 text-slate-900" />
            </div>
            <p className="text-xs font-mono font-bold text-slate-900">UPI ID: purepro.supplements@upi</p>
            <p className="text-[11px] text-slate-500">Amount: ₹{order.total} • Order ID: {order.id}</p>
          </div>
        )}
      </div>

      {/* Ordered Products & Destination Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ordered Supplements */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
          <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
            Ordered Supplements ({order.items.length})
          </h3>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                <div className="w-14 h-14 bg-white rounded-xl p-1.5 border border-slate-100 flex items-center justify-center flex-shrink-0">
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
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{item.product.name}</h4>
                  <span className="text-[11px] text-slate-500 block">
                    {item.flavor} • {item.size} • Qty: {item.quantity}
                  </span>
                </div>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  ₹{(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Destination */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4 text-xs sm:text-sm">
          <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Shipping Destination</span>
          </h3>
          <div className="space-y-1">
            <p className="font-bold text-slate-900 text-base">{order.shippingDetails.fullName}</p>
            <p className="text-slate-600 leading-relaxed">
              {order.shippingDetails.address}, {order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pincode}
            </p>
            <p className="text-slate-500 pt-1">Contact: +91 {order.shippingDetails.phone}</p>
            <p className="text-slate-500">Email: {order.shippingDetails.email}</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-emerald-700 text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>Order verified & covered under 100% authenticity guarantee</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => navigateTo('home')}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigateTo('verify')}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verify a Scratch Code</span>
        </button>
      </div>
    </div>
  );
};
