'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserProfile, 
  TargetGoal, 
  ActivityLevel, 
  TargetDiet,
  BiologicalSex,
  TargetSupplementCategory,
  ProteinType,
  SymptomType,
  MedicalCondition
} from '../../types';
import { calculateDailyNutritionTargets } from '../../utils/scoring';
import { 
  User, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Flame, 
  ShieldAlert, 
  Dumbbell, 
  Heart, 
  Zap,
  Droplets,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const ProfileSetupScreen: React.FC = () => {
  const { profile, updateProfile, navigateTo, openAssessment } = useApp();

  const [formProfile, setFormProfile] = useState<UserProfile>({
    ...profile,
    biologicalSex: profile.biologicalSex || 'Male',
    symptoms: profile.symptoms || [],
    medicalAlerts: profile.medicalAlerts || [],
    targetSupplementCategory: profile.targetSupplementCategory || 'All / Complete Stack',
    preferredProteinType: profile.preferredProteinType || 'Any'
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const goals: { label: TargetGoal; desc: string; icon: string }[] = [
    { label: 'Muscle Gain', desc: 'Hypertrophy, strength & size gains', icon: '💪' },
    { label: 'Fat Loss', desc: 'Calorie deficit & lean muscle retention', icon: '🔥' },
    { label: 'Athletic Performance', desc: 'Explosive power & agility', icon: '⚡' },
    { label: 'Endurance', desc: 'Cardio stamina & hydration optimization', icon: '🏃' },
    { label: 'General Fitness', desc: 'Daily health, vitality & joints', icon: '🧘' },
  ];

  const activities: { label: ActivityLevel; desc: string }[] = [
    { label: 'Sedentary', desc: 'Desk job, light walking, little exercise' },
    { label: 'Moderate', desc: '3-4 workouts per week' },
    { label: 'High', desc: '5-6 intense gym & lifting sessions' },
    { label: 'Athlete', desc: 'Twice daily rigorous athletic training' },
  ];

  const diets: { label: TargetDiet; desc: string; icon: string }[] = [
    { label: 'Vegetarian', desc: 'Whey, milk protein, plant isolates (Zero meat/fish/gelatin)', icon: '🌱' },
    { label: 'Vegan', desc: '100% Plant-based only (No dairy, no whey, zero animal products)', icon: '🌿' },
    { label: 'Non-Vegetarian', desc: 'All sources including deep-sea fish oil & bovine collagen', icon: '🥩' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formProfile);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      navigateTo('home');
    }, 900);
  };

  const targets = calculateDailyNutritionTargets(formProfile);

  const toggleSymptom = (s: SymptomType) => {
    const current = formProfile.symptoms || [];
    if (current.includes(s)) {
      setFormProfile({ ...formProfile, symptoms: current.filter(item => item !== s) });
    } else {
      setFormProfile({ ...formProfile, symptoms: [...current, s] });
    }
  };

  const toggleMedicalAlert = (m: MedicalCondition) => {
    const current = formProfile.medicalAlerts || [];
    if (current.includes(m)) {
      setFormProfile({ ...formProfile, medicalAlerts: current.filter(item => item !== m) });
    } else {
      setFormProfile({ ...formProfile, medicalAlerts: [...current, m] });
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-soft">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          Personalized Nutrition & Goal Matcher
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          Our clinical engine scores supplements, calculates exact daily protein dosages, adapts to lactose tolerance, and enforces dietary safety.
        </p>

        {/* Quick launcher for full 6-pillar modal */}
        <button
          type="button"
          onClick={openAssessment}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-emerald shadow-sm transition-all active:scale-98"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Launch Complete 6-Pillar Clinical Quiz</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Real-time Calculated Biomarkers Card */}
      <div className="bg-slate-950 rounded-3xl p-6 text-white shadow-soft space-y-4 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-black text-xs uppercase tracking-wider">Clinical Dosing Blueprint</span>
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            Based on {formProfile.weight}kg • {formProfile.goal}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Daily Protein Target</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{targets.dailyProteinGrams}g</div>
            <div className="text-[10px] text-slate-500">~{Math.round(targets.dailyProteinGrams / formProfile.weight * 10) / 10}g/kg bodyweight</div>
          </div>

          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Target Hydration</div>
            <div className="text-xl font-black text-blue-400 mt-0.5">{targets.dailyWaterLiters}L</div>
            <div className="text-[10px] text-slate-500">Fluid & intra-cellular</div>
          </div>

          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Daily Energy Target</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">{targets.dailyCaloriesTarget} kcal</div>
            <div className="text-[10px] text-slate-500">{formProfile.goal === 'Muscle Gain' ? '+350 lean surplus' : 'Target baseline'}</div>
          </div>

          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Creatine Saturation</div>
            <div className="text-xl font-black text-purple-400 mt-0.5">{targets.creatineDoseGrams}g / day</div>
            <div className="text-[10px] text-slate-500">Creapure Monohydrate</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Metric Sliders Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-5">
          <h2 className="font-black text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
            1. Core Physical Metrics & Biological Sex
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Biological Sex */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-slate-700">Biological Sex</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Male', 'Female'] as BiologicalSex[]).map((sex) => {
                  const active = formProfile.biologicalSex === sex;
                  return (
                    <button
                      type="button"
                      key={sex}
                      onClick={() => setFormProfile({ ...formProfile, biologicalSex: sex })}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                        active 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600' 
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {sex === 'Male' ? '👨 Male' : '👩 Female'}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400">Calibrates iron, hormone & multi formulas</p>
            </div>

            {/* Body Weight */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Body Weight</label>
                <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                  {formProfile.weight} kg
                </span>
              </div>
              <input
                type="range"
                min={45}
                max={125}
                value={formProfile.weight}
                onChange={(e) => setFormProfile({ ...formProfile, weight: Number(e.target.value) })}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                <span>45 kg</span>
                <span>125 kg</span>
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Age</label>
                <span className="text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  {formProfile.age} yrs
                </span>
              </div>
              <input
                type="range"
                min={18}
                max={65}
                value={formProfile.age}
                onChange={(e) => setFormProfile({ ...formProfile, age: Number(e.target.value) })}
                className="w-full accent-slate-800 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                <span>18</span>
                <span>40</span>
                <span>65</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Goal Selector */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
          <h2 className="font-black text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
            2. Primary Fitness Goal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {goals.map((goal) => {
              const active = formProfile.goal === goal.label;
              return (
                <button
                  type="button"
                  key={goal.label}
                  onClick={() => setFormProfile({ ...formProfile, goal: goal.label })}
                  className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    active
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{goal.icon}</span>
                    {active && <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-black ${active ? 'text-emerald-950' : 'text-slate-900'}`}>
                      {goal.label}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">{goal.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Digestive Sensitivity & Symptoms Screening */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
          <h2 className="font-black text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
            3. Digestive Health & Lactose Screening
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => toggleMedicalAlert('Lactose Intolerance')}
              className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${
                (formProfile.medicalAlerts || []).includes('Lactose Intolerance')
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="text-xs font-black text-slate-900">Lactose Intolerant</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Filters out standard whey concentrate; prioritizes Hydrolyzed Isolate or Plant Protein.</p>
              </div>
              {(formProfile.medicalAlerts || []).includes('Lactose Intolerance') && (
                <Check className="w-4 h-4 text-emerald-600 stroke-[3] flex-shrink-0 ml-2 mt-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => toggleSymptom('Frequent Bloating / Digestion')}
              className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${
                (formProfile.symptoms || []).includes('Frequent Bloating / Digestion')
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="text-xs font-black text-slate-900">Frequent Bloating or Stomach Distress</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Prioritizes MB Biozyme (EAF enzymes) and Dymatize ISO 100 for light digestion.</p>
              </div>
              {(formProfile.symptoms || []).includes('Frequent Bloating / Digestion') && (
                <Check className="w-4 h-4 text-emerald-600 stroke-[3] flex-shrink-0 ml-2 mt-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Specialized Protein Type Preference */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-black text-slate-900 text-sm uppercase tracking-wider">
              4. Multiple Types of Protein Formulation
            </h2>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Full Spectrum Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { val: 'Any', label: 'AI Auto-Match', desc: 'Best match for your goal' },
              { val: 'Whey Isolate', label: 'Whey Isolate (WPI)', desc: '27g protein, <1g carbs' },
              { val: 'Hydrolyzed Whey Isolate', label: 'Hydrolyzed Isolate', desc: 'Pre-digested, 0g lactose' },
              { val: 'Plant Protein Isolate', label: 'Plant Isolate (Vegan)', desc: 'Pea & brown rice isolate' },
              { val: 'Micellar Casein', label: 'Micellar Casein', desc: '7-8 hr nighttime release' },
              { val: 'Raw Unflavored', label: 'Raw Whey 80%', desc: '0 artificial sweeteners' },
              { val: 'Mass Gainer', label: 'Mass Gainer', desc: '1,250 high calories' },
              { val: 'Whey Concentrate / Blend', label: 'Whey Blend', desc: 'Gold Standard & Biozyme' },
            ].map((p) => {
              const active = formProfile.preferredProteinType === p.val;
              return (
                <button
                  type="button"
                  key={p.val}
                  onClick={() => setFormProfile({ ...formProfile, preferredProteinType: p.val as ProteinType | 'Any' })}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    active
                      ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600 font-black text-emerald-950'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold">{p.label}</div>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dietary Preference Pills (Strict Safety Filter) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-black text-slate-900 text-sm uppercase tracking-wider">
              5. Dietary Lifestyle & Safety Filter
            </h2>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              100% Strict Filtering
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {diets.map((diet) => {
              const active = formProfile.diet === diet.label;
              return (
                <button
                  type="button"
                  key={diet.label}
                  onClick={() => setFormProfile({ ...formProfile, diet: diet.label })}
                  className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    active
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{diet.icon}</span>
                    {active && <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-black ${active ? 'text-emerald-950' : 'text-slate-900'}`}>
                      {diet.label}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{diet.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Strict Safety Guarantee Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Dietary Guarantee:</strong> When Vegetarian or Vegan is selected, all non-vegetarian items (including fish oil softgels, animal collagen, and non-veg gelatin capsules) are permanently blocked from appearing in your store recommendations.
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-emerald flex items-center justify-center gap-2.5 transition-all active:scale-98"
        >
          {savedSuccess ? (
            <>
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Preferences Saved! Personalizing Website Store...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Save & Apply Personalized Website Recommendations</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
