'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Clock, 
  User, 
  FileText, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const AdminCoachesScreen: React.FC = () => {
  const { 
    coachApplications, 
    reviewCoachApplication, 
    navigateTo, 
    setUserAccountRole 
  } = useApp();

  const pendingApplications = coachApplications.filter(a => a.status === 'Pending Review');
  const pastApplications = coachApplications.filter(a => a.status !== 'Pending Review');

  const handleApprove = (appId: string) => {
    reviewCoachApplication(appId, 'verified');
  };

  const handleReject = (appId: string) => {
    reviewCoachApplication(appId, 'rejected');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Demo Callout Banner */}
      <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 sm:p-5 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <span className="text-xs font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
              Demo Admin Panel
            </span>
            <p className="text-xs text-amber-800 font-medium mt-0.5">
              No authentication required — for evaluation and demonstration purposes only.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setUserAccountRole('coach', 'verified')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Quick Switch: Log in as Verified Coach
          </button>
        </div>
      </div>

      {/* Main Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span>Coach Application Review Queue</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit submitted certifications, verify identity numbers, and approve or reject prospective coaches.
          </p>
        </div>

        <button
          onClick={() => navigateTo('coach-onboard')}
          className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition-colors self-start sm:self-auto"
        >
          + Submit New Mock Coach
        </button>
      </div>

      {/* Pending Review Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <span>Pending Review Applications</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              {pendingApplications.length}
            </span>
          </h3>
        </div>

        {pendingApplications.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No coach applications pending review</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Submit a mock KYC application at <button onClick={() => navigateTo('coach-onboard')} className="text-emerald-700 font-bold underline">/coach/onboard</button> to see it appear here instantly for approval.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-3">Applicant Name</th>
                  <th className="pb-3 px-3">Specializations</th>
                  <th className="pb-3 px-3">Experience</th>
                  <th className="pb-3 px-3">ID & Documents</th>
                  <th className="pb-3 px-3">Submitted</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-3 font-bold text-slate-900">
                      <div>{app.name}</div>
                      <div className="text-[11px] font-normal text-slate-500">{app.email}</div>
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex flex-wrap gap-1">
                        {app.specializations.map((s) => (
                          <span key={s} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            {s.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-3 text-slate-600 font-medium">
                      {app.experienceYears} Years
                    </td>

                    <td className="py-4 px-3 text-slate-600 space-y-0.5">
                      <div className="font-mono font-bold text-slate-800">{app.idType}: {app.idNumberMasked}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-emerald-600" />
                        <span>{app.certFileName}</span>
                      </div>
                    </td>

                    <td className="py-4 px-3 text-slate-500 font-mono text-[11px]">
                      {new Date(app.submittedDate).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-emerald flex items-center gap-1 transition-all active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold text-xs transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Past Reviewed Table */}
      {pastApplications.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
          <h3 className="font-black text-slate-900 text-sm">Application History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-2 px-3">Applicant</th>
                  <th className="pb-2 px-3">Status</th>
                  <th className="pb-2 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pastApplications.map((app) => (
                  <tr key={app.id}>
                    <td className="py-3 px-3 font-bold text-slate-800">{app.name} ({app.email})</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {new Date(app.submittedDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
