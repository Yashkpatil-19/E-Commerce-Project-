'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Check, 
  X, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  Award, 
  MessageSquare, 
  CheckCircle2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const CoachDashboardScreen: React.FC = () => {
  const { 
    currentUser, 
    appointmentRequests, 
    updateAppointmentStatus, 
    coaches,
    navigateTo,
    setUserAccountRole 
  } = useApp();

  // Active Coach ID to inspect appointments for (defaults to current user or seed coach-01 for demo convenience)
  const [activeCoachId, setActiveCoachId] = useState<string>(() => {
    if (currentUser?.role === 'coach' && currentUser.id) {
      return currentUser.id;
    }
    return 'coach-01';
  });

  const currentCoach = coaches.find(c => c.id === activeCoachId) || coaches[0];

  // 1. If logged-in user is a coach and their status is NOT verified, show "Your profile is under review" and stop here
  if (currentUser?.role === 'coach' && currentUser.coachStatus !== 'verified') {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center mx-auto text-amber-600">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
            Under Compliance Audit
          </span>
          <h2 className="text-2xl font-black text-slate-950">Your profile is under review</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Your credentials and identity documents have been submitted and are currently in the compliance verification queue. You will receive an access grant once verified.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 text-left max-w-sm mx-auto">
          <div>• Registered Email: <strong className="text-slate-900">{currentUser.email}</strong></div>
          <div>• Current Status: <strong className="text-amber-700 uppercase font-bold">{currentUser.coachStatus || 'pending'}</strong></div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigateTo('admin-coaches')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-emerald transition-all"
          >
            Go to Demo Admin Queue (Approve Now) →
          </button>
          <button
            onClick={() => setUserAccountRole('coach', 'verified')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Instant Demo Bypass (Set Verified)
          </button>
        </div>
      </div>
    );
  }

  // Filter requests matching activeCoachId (or all pending if matching demo)
  const pendingRequests = appointmentRequests.filter(
    r => (r.coachId === activeCoachId || activeCoachId === 'coach-01') && r.status === 'Pending'
  );

  const pastRequests = appointmentRequests.filter(
    r => (r.coachId === activeCoachId || activeCoachId === 'coach-01') && r.status !== 'Pending'
  );

  const handleAccept = (reqId: string) => {
    updateAppointmentStatus(reqId, 'Confirmed');
  };

  const handleDecline = (reqId: string) => {
    updateAppointmentStatus(reqId, 'Declined');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Top Coach Profile Summary Bar */}
      <div className="rounded-3xl bg-slate-950 p-6 sm:p-8 text-white shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-emerald-950">
        <div className="flex items-center gap-4">
          <img 
            src={currentCoach.photo} 
            alt={currentCoach.name} 
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = '/purepro-logo.png';
            }}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">{currentCoach.name}</h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                ✓ Verified Mentor
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentCoach.experienceYears} Years Experience • Rating {currentCoach.rating} / 5.0
            </p>
          </div>
        </div>

        {/* Demo Switcher for Evaluation */}
        <div className="flex flex-col sm:items-end gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-medium">Viewing Schedule For:</span>
          <select
            value={activeCoachId}
            onChange={(e) => setActiveCoachId(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-400 focus:outline-none"
          >
            {coaches.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── PENDING APPOINTMENTS QUEUE ─── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-950 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Incoming Appointment Requests</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review consultation inquiries. Accepting immediately notifies the athlete and updates their profile.
            </p>
          </div>

          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            {pendingRequests.length} Pending
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No pending consultation requests</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Athletes booking appointments on <button onClick={() => navigateTo('fitness-journey')} className="text-emerald-700 font-bold underline">/fitness-journey</button> will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div 
                key={req.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md uppercase">
                      Plan: {req.planId.replace('-', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {req.date}
                    </span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {req.time}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
                    &ldquo;{req.message}&rdquo;
                  </p>

                  <div className="text-[11px] text-slate-400 font-mono">
                    Athlete ID: {req.userId} • Requested: {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-emerald flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Slot</span>
                  </button>
                  <button
                    onClick={() => handleDecline(req.id)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold text-xs transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── CONFIRMED / PAST APPOINTMENTS ─── */}
      {pastRequests.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
          <h3 className="font-black text-slate-900 text-base">Completed & Confirmed Consultations</h3>
          <div className="divide-y divide-slate-100">
            {pastRequests.map((req) => (
              <div key={req.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{req.date} at {req.time}</span>
                    <span className="text-slate-400">•</span>
                    <span className="uppercase text-slate-600 font-medium">{req.planId.replace('-', ' ')}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-md">{req.message}</div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  req.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
