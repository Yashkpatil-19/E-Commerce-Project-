'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserProfile, 
  TargetGoal, 
  ActivityLevel, 
  TargetDiet,
  BiologicalSex,
  DailyDietQuality,
  SymptomType,
  MedicalCondition,
  StressLevel,
  SleepHours,
  BiomarkerStatus,
  GoalTimeline,
  TargetSupplementCategory,
  ProteinType
} from '../types';
import { calculateDailyNutritionTargets } from '../utils/scoring';
import { 
  Sparkles, 
  Check, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Heart, 
  Dumbbell, 
  Moon, 
  Activity, 
  AlertCircle, 
  Flame, 
  Clock, 
  Coffee, 
  Droplets,
  ShoppingCart
} from 'lucide-react';

interface AssessmentQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssessmentQuizModal: React.FC<AssessmentQuizModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, products, addToCart, navigateTo } = useApp();

  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<UserProfile>({
    ...profile,
    biologicalSex: profile.biologicalSex || 'Male',
    heightCm: profile.heightCm || 175,
    dailyDietQuality: profile.dailyDietQuality || 'Moderate Balance',
    symptoms: profile.symptoms || [],
    medicalAlerts: profile.medicalAlerts || [],
    stressLevel: profile.stressLevel || 'Moderate',
    sleepHours: profile.sleepHours || '6-7 hrs',
    bloodBiomarkers: profile.bloodBiomarkers || [],
    timeline: profile.timeline || 'Long-term Lifestyle Wellness',
    targetSupplementCategory: profile.targetSupplementCategory || 'All / Complete Stack',
    preferredProteinType: profile.preferredProteinType || 'Any',
  });

  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!isOpen) return null;

  const totalSteps = 7; // Steps 1 to 6 are questions, Step 7 is the Clinical Dossier

  const toggleSymptom = (s: SymptomType) => {
    const current = form.symptoms || [];
    if (current.includes(s)) {
      setForm({ ...form, symptoms: current.filter(item => item !== s) });
    } else {
      setForm({ ...form, symptoms: [...current, s] });
    }
  };

  const toggleMedicalAlert = (m: MedicalCondition) => {
    const current = form.medicalAlerts || [];
    if (m === 'None / Healthy') {
      setForm({ ...form, medicalAlerts: ['None / Healthy'] });
      return;
    }
    const filtered = current.filter(item => item !== 'None / Healthy');
    if (filtered.includes(m)) {
      setForm({ ...form, medicalAlerts: filtered.filter(item => item !== m) });
    } else {
      setForm({ ...form, medicalAlerts: [...filtered, m] });
    }
  };

  const toggleBiomarker = (b: BiomarkerStatus) => {
    const current = form.bloodBiomarkers || [];
    if (b === 'Normal / Untested') {
      setForm({ ...form, bloodBiomarkers: ['Normal / Untested'] });
      return;
    }
    const filtered = current.filter(item => item !== 'Normal / Untested');
    if (filtered.includes(b)) {
      setForm({ ...form, bloodBiomarkers: filtered.filter(item => item !== b) });
    } else {
      setForm({ ...form, bloodBiomarkers: [...filtered, b] });
    }
  };

  const handleFinishAssessment = () => {
    updateProfile(form);
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      onClose();
      navigateTo('products');
    }, 1000);
  };

  // Calculated evidence targets for step 7
  const targets = calculateDailyNutritionTargets(form);

  // Top 3 matched recommendations from active catalog
  const topMatched = products.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header with Step Progress Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-none">
                  {step === 7 ? 'Your Clinical Protocol & Recommendations' : 'AI Nutritional & Clinical Assessment'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {step === 7 ? 'Tailored precisely to your physiology, diet & biomarkers' : `Step ${step} of 6: ${
                    step === 1 ? 'Core Biometrics & Biological Sex' :
                    step === 2 ? 'Dietary Patterns & Whole Foods' :
                    step === 3 ? 'Health Objectives & Timeline' :
                    step === 4 ? 'Clinical Symptoms & Digestion' :
                    step === 5 ? 'Lifestyle, Stress & Sleep' :
                    'Diagnostics & Desired Supplements'
                  }`}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Modal Body with dynamic steps */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: Core Biometrics & Biological Sex */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-2">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Pillar 1: Core Biometrics & Demographics</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Metabolic baseline, iron needs, and optimal supplement dosing are heavily governed by age, weight, and biological sex.
                </p>
              </div>

              {/* Biological Sex */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Biological Sex (for micronutrient & multivitamin calibration)</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Male', 'Female'] as BiologicalSex[]).map((sex) => {
                    const active = form.biologicalSex === sex;
                    return (
                      <button
                        key={sex}
                        type="button"
                        onClick={() => setForm({ ...form, biologicalSex: sex })}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          active 
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600 font-black text-emerald-950' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{sex === 'Male' ? '👨 Male' : '👩 Female'}</span>
                        {active && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weight Slider */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Body Weight</label>
                  <span className="text-sm font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
                    {form.weight} kg
                  </span>
                </div>
                <input
                  type="range"
                  min={45}
                  max={120}
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>45 kg</span>
                  <span className="text-emerald-700 font-bold">Estimated Protein: ~{Math.round(form.weight * 1.8)}g/day</span>
                  <span>120 kg</span>
                </div>
              </div>

              {/* Age Slider */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Age</label>
                  <span className="text-sm font-black text-slate-900 bg-slate-200 px-3 py-1 rounded-xl">
                    {form.age} years
                  </span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={70}
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                  className="w-full accent-slate-800 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>18 yrs</span>
                  <span>40 yrs</span>
                  <span>70 yrs</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Dietary Patterns & Whole Foods */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-2">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Pillar 2: Dietary Patterns & Food Intake</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Identifies potential micronutrient gaps (B12, Iron, Omega-3) and enforces absolute dietary compliance.
                </p>
              </div>

              {/* Diet selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Dietary Restrictions & Preference</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { label: 'Vegetarian', desc: 'Whey, milk protein, plant isolates (No meat/fish/gelatin)', icon: '🌱' },
                    { label: 'Vegan', desc: '100% Plant-based only (No dairy, no whey, zero animal)', icon: '🌿' },
                    { label: 'Non-Vegetarian', desc: 'All sources including fish oil & gelatin', icon: '🥩' },
                  ].map((diet) => {
                    const active = form.diet === diet.label;
                    return (
                      <button
                        key={diet.label}
                        type="button"
                        onClick={() => setForm({ ...form, diet: diet.label as TargetDiet })}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          active 
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xl">{diet.icon}</span>
                          {active && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                        </div>
                        <div>
                          <div className={`text-xs font-black ${active ? 'text-emerald-950' : 'text-slate-900'}`}>{diet.label}</div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{diet.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Whole food quality */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Daily Whole-Food Quality</label>
                <div className="space-y-2">
                  {[
                    { val: 'High Whole Foods', title: 'High Whole Foods', desc: 'Cooked meals, abundant fruits/vegetables, clean protein sources' },
                    { val: 'Moderate Balance', title: 'Moderate Balance', desc: 'Mix of healthy home-cooked meals with occasional dining out' },
                    { val: 'Irregular / Fast Food', title: 'Irregular / Eating Out', desc: 'Frequent meal skipping, busy schedule, low vegetable/protein density' },
                  ].map((item) => {
                    const active = form.dailyDietQuality === item.val;
                    return (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setForm({ ...form, dailyDietQuality: item.val as DailyDietQuality })}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          active 
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className={`text-xs font-black ${active ? 'text-emerald-950' : 'text-slate-900'}`}>{item.title}</div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                        {active && <Check className="w-4 h-4 text-emerald-600 stroke-[3] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Health Goals & Objectives */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-2">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Pillar 3: Health Goals & Protocol Urgency</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dictates the active ingredients, calorie thresholds, and synergistic compound pairings.
                </p>
              </div>

              {/* Primary Objective */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Primary Health / Fitness Objective</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { label: 'Muscle Gain', desc: 'Hypertrophy, progressive overload, clean caloric surplus', icon: '💪' },
                    { label: 'Fat Loss', desc: 'Caloric deficit, high satiety protein, lean muscle retention', icon: '🔥' },
                    { label: 'Athletic Performance', desc: 'Explosive ATP power, sprinting capacity, sprint stamina', icon: '⚡' },
                    { label: 'Endurance', desc: 'Cardio stamina, hydration balance, VO2 max endurance', icon: '🏃' },
                    { label: 'General Fitness', desc: 'Longevity, daily micronutrients, joint mobility & vitality', icon: '🧘' },
                  ].map((goal) => {
                    const active = form.goal === goal.label;
                    return (
                      <button
                        key={goal.label}
                        type="button"
                        onClick={() => setForm({ ...form, goal: goal.label as TargetGoal })}
                        className={`p-3 rounded-2xl border text-left flex items-start justify-between transition-all ${
                          active 
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-2xl">{goal.icon}</span>
                          <div>
                            <div className={`text-xs font-black ${active ? 'text-emerald-950' : 'text-slate-900'}`}>{goal.label}</div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{goal.desc}</p>
                          </div>
                        </div>
                        {active && <Check className="w-4 h-4 text-emerald-600 stroke-[3] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timeline / Urgency */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Timeline & Protocol Focus</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: 'Short-term Peak Cycle (4-8 wks)', title: 'Short-Term Peak (4-8 wks)', desc: 'Intense cycle for photo shoot, sports event, or contest prep' },
                    { val: 'Long-term Lifestyle Wellness', title: 'Sustainable Lifestyle', desc: 'Steady lifelong vitality, metabolic health, and gradual gains' },
                  ].map((t) => {
                    const active = form.timeline === t.val;
                    return (
                      <button
                        key={t.val}
                        type="button"
                        onClick={() => setForm({ ...form, timeline: t.val as GoalTimeline })}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          active 
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black">{t.title}</span>
                          {active && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                        </div>
                        <p className="text-[11px] text-slate-500">{t.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Clinical History & Digestion */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-2">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Pillar 4: Clinical Symptoms & Digestive Baseline</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Highlights sensitivities like lactose bloating and guides whether hydrolyzed isolate or plant protein is mandatory.
                </p>
              </div>

              {/* Symptoms (multi-select) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Current Symptoms & Energy Baselines (Select all that apply)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { val: 'Chronic Fatigue', label: 'Chronic Fatigue / Low Energy', desc: 'Feeling drained by 2 PM; sluggish workout power' },
                    { val: 'Poor Sleep / High Stress', label: 'Poor Sleep Quality / Elevated Stress', desc: 'Restless nights, high cortisol, morning grogginess' },
                    { val: 'Frequent Bloating / Digestion', label: 'Frequent Bloating / Gas with Whey', desc: 'Lactose sensitivity or digestive discomfort with dairy' },
                    { val: 'Slow Muscle Recovery', label: 'Prolonged Soreness / Slow Recovery', desc: 'DOMS lasting 3+ days after heavy resistance sessions' },
                  ].map((symp) => {
                    const active = (form.symptoms || []).includes(symp.val as SymptomType);
                    return (
                      <button
                        key={symp.val}
                        type="button"
                        onClick={() => toggleSymptom(symp.val as SymptomType)}
                        className={`p-3 rounded-2xl border text-left flex items-start justify-between transition-all ${
                          active 
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className={`text-xs font-black ${active ? 'text-emerald-950' : 'text-slate-900'}`}>{symp.label}</div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{symp.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ml-2 ${
                          active ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {active && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Medical conditions & alerts */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Medical Conditions & Contraindication Screening</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { val: 'Lactose Intolerance', label: 'Lactose Intolerance' },
                    { val: 'Kidney Strain', label: 'Kidney / Hydration Sensitivity' },
                    { val: 'High Blood Pressure', label: 'High Blood Pressure (Avoid Stimulants)' },
                    { val: 'None / Healthy', label: 'None / Completely Healthy' },
                  ].map((med) => {
                    const active = (form.medicalAlerts || []).includes(med.val as MedicalCondition);
                    return (
                      <button
                        key={med.val}
                        type="button"
                        onClick={() => toggleMedicalAlert(med.val as MedicalCondition)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                          active 
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600 font-bold text-emerald-950' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>{med.label}</span>
                        {active && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Lifestyle, Training & Sleep */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-2">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Pillar 5: Lifestyle, Training Load & Sleep</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Training intensity determines amino acid turnover, while sleep governs night-time hormone release.
                </p>
              </div>

              {/* Activity Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Weekly Training Frequency</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { val: 'Sedentary', label: 'Sedentary', sub: 'Desk job, light walking' },
                    { val: 'Moderate', label: 'Moderate', sub: '3-4 workouts / week' },
                    { val: 'High', label: 'High Activity', sub: '5-6 heavy gym sessions' },
                    { val: 'Athlete', label: 'Elite / Athlete', sub: 'Twice daily training' },
                  ].map((act) => {
                    const active = form.activity === act.val;
                    return (
                      <button
                        key={act.val}
                        type="button"
                        onClick={() => setForm({ ...form, activity: act.val as ActivityLevel })}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          active 
                            ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`text-xs font-black ${active ? 'text-emerald-950' : 'text-slate-900'}`}>{act.label}</div>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{act.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sleep Hours & Stress */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Nightly Sleep Duration</label>
                  <div className="space-y-1.5">
                    {(['<6 hrs', '6-7 hrs', '7-8+ hrs'] as SleepHours[]).map((hrs) => {
                      const active = form.sleepHours === hrs;
                      return (
                        <button
                          key={hrs}
                          type="button"
                          onClick={() => setForm({ ...form, sleepHours: hrs })}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                            active 
                              ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600 font-bold text-emerald-950' 
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span>{hrs}</span>
                          {active && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Chronic Stress Levels</label>
                  <div className="space-y-1.5">
                    {(['Low', 'Moderate', 'High Chronic'] as StressLevel[]).map((lvl) => {
                      const active = form.stressLevel === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setForm({ ...form, stressLevel: lvl })}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                            active 
                              ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600 font-bold text-emerald-950' 
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span>{lvl}</span>
                          {active && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Diagnostics & Desired Supplements */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-2">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Pillar 6: Objective Diagnostics & Target Supplement</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Blood panel biomarker deficiencies pinpoint exact micronutrient needs.
                </p>
              </div>

              {/* Blood biomarkers (multi-select) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Known Blood Panel / Lab Work Gaps (Select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'Low Vitamin D3', label: 'Low Vitamin D3' },
                    { val: 'Low Vitamin B12', label: 'Low Vitamin B12' },
                    { val: 'Low Iron / Ferritin', label: 'Low Iron / Ferritin' },
                    { val: 'High Joint Inflammation', label: 'High Joint / CRP Inflammation' },
                    { val: 'Normal / Untested', label: 'Normal / Not Tested Recently' },
                  ].map((bio) => {
                    const active = (form.bloodBiomarkers || []).includes(bio.val as BiomarkerStatus);
                    return (
                      <button
                        key={bio.val}
                        type="button"
                        onClick={() => toggleBiomarker(bio.val as BiomarkerStatus)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                          active 
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600 font-bold text-emerald-950' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>{bio.label}</span>
                        {active && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Which supplement are you specifically looking for? */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Which Supplement Are You Specifically Looking For?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'All / Complete Stack',
                    'Protein',
                    'Creatine',
                    'Vitamins',
                    'Fish Oil',
                    'Pre-Workout',
                    'Recovery'
                  ].map((cat) => {
                    const active = form.targetSupplementCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setForm({ ...form, targetSupplementCategory: cat as TargetSupplementCategory })}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                          active 
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600 font-black text-emerald-950' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <span>{cat}</span>
                        {active && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Multiple Protein Types selector if Protein or All is selected */}
              {(form.targetSupplementCategory === 'Protein' || form.targetSupplementCategory === 'All / Complete Stack') && (
                <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-emerald-950">Specialized Protein Preference</label>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Multiple Types Available
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                    {[
                      { val: 'Any', label: 'AI Recommend Best Match' },
                      { val: 'Whey Isolate', label: 'Pure Whey Isolate (WPI)' },
                      { val: 'Hydrolyzed Whey Isolate', label: 'Hydrolyzed Isolate (0g Lactose)' },
                      { val: 'Plant Protein Isolate', label: '100% Plant Isolate (Vegan)' },
                      { val: 'Micellar Casein', label: 'Micellar Casein (Nighttime)' },
                      { val: 'Raw Unflavored', label: 'Raw Whey (Zero Additives)' },
                      { val: 'Mass Gainer', label: 'Mass Gainer (High Calorie)' },
                    ].map((prot) => {
                      const active = form.preferredProteinType === prot.val;
                      return (
                        <button
                          key={prot.val}
                          type="button"
                          onClick={() => setForm({ ...form, preferredProteinType: prot.val as ProteinType | 'Any' })}
                          className={`p-2 rounded-lg border text-left transition-all text-[11px] ${
                            active 
                              ? 'border-emerald-600 bg-white font-black text-emerald-900 shadow-xs ring-1 ring-emerald-600' 
                              : 'border-emerald-100 bg-white/70 hover:bg-white text-slate-700'
                          }`}
                        >
                          {prot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: Clinical Recommendation Dossier */}
          {step === 7 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
              {/* Top Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
                  <div className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider">Target Protein</div>
                  <div className="text-xl font-black text-emerald-950 mt-0.5">{targets.dailyProteinGrams}g <span className="text-xs font-normal">/ day</span></div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">~{Math.round(targets.dailyProteinGrams / (form.weight || 65) * 10) / 10}g per kg</div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-center">
                  <div className="text-[11px] text-blue-700 font-bold uppercase tracking-wider">Hydration</div>
                  <div className="text-xl font-black text-blue-950 mt-0.5">{targets.dailyWaterLiters}L <span className="text-xs font-normal">/ day</span></div>
                  <div className="text-[10px] text-blue-600 mt-0.5">Cellular volumization</div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
                  <div className="text-[11px] text-amber-700 font-bold uppercase tracking-wider">Target Calories</div>
                  <div className="text-xl font-black text-amber-950 mt-0.5">{targets.dailyCaloriesTarget} <span className="text-xs font-normal">kcal</span></div>
                  <div className="text-[10px] text-amber-600 mt-0.5">{form.goal === 'Muscle Gain' ? '+350 lean surplus' : form.goal === 'Fat Loss' ? '-450 fat deficit' : 'Maintenance'}</div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 text-center">
                  <div className="text-[11px] text-purple-700 font-bold uppercase tracking-wider">Creatine Saturation</div>
                  <div className="text-xl font-black text-purple-950 mt-0.5">{targets.creatineDoseGrams}g <span className="text-xs font-normal">/ day</span></div>
                  <div className="text-[10px] text-purple-600 mt-0.5">Creapure Monohydrate</div>
                </div>
              </div>

              {/* Clinical Alerts / Sensitivities */}
              {targets.clinicalAlerts.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Clinical Screening Guardrails</span>
                  </div>
                  <div className="space-y-1.5">
                    {targets.clinicalAlerts.map((alert, i) => (
                      <div key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        <span>{alert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Daily Timing Protocol */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Recommended Supplement Timing Protocol</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="font-bold text-slate-800">🌅 Morning (with breakfast):</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{targets.timingProtocol.morning}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="font-bold text-slate-800">⚡ Pre-Workout (25m prior):</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{targets.timingProtocol.preWorkout}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="font-bold text-slate-800">💪 Post-Workout (within 45m):</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{targets.timingProtocol.postWorkout}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="font-bold text-slate-800">🌙 Bedtime:</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{targets.timingProtocol.bedtime}</p>
                  </div>
                </div>
              </div>

              {/* Top Recommendations Showcase */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Top Matched Supplements for Your Physiology
                  </h5>
                  <span className="text-[11px] font-bold text-emerald-700">
                    Highest Clinical Match
                  </span>
                </div>

                <div className="space-y-2.5">
                  {topMatched.map((item) => (
                    <div key={item.id} className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1 flex-shrink-0" 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h6 className="text-xs font-black text-slate-900 truncate">{item.name}</h6>
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex-shrink-0">
                              {item.matchScore || 95}% Match
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-700 font-medium truncate mt-0.5">
                            {item.matchReason || 'Matches your clinical assessment profile'}
                          </p>
                          <div className="text-[11px] font-bold text-slate-900 mt-0.5">
                            ₹{item.price.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => addToCart(item, item.flavors[0], item.sizes[0], 1)}
                        className="p-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white flex-shrink-0 transition-colors"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Navigation Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between flex-shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : step === 6 ? (
            <button
              type="button"
              onClick={() => {
                updateProfile(form);
                setStep(7);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-emerald transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Clinical Protocol</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishAssessment}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-emerald transition-all"
            >
              {appliedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Protocol Saved! Opening Catalog...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Apply Protocol & Explore Recommendations</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
