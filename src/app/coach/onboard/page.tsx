'use client';

import React, { Suspense } from 'react';
import { AppShell } from '../../../components/AppShell';

export default function CoachOnboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading Coach Onboarding...</div>}>
      <AppShell initialScreen="coach-onboard" />
    </Suspense>
  );
}
