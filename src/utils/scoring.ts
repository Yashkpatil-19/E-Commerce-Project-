import { Product, UserProfile, ProteinType } from '../types';

export interface NutritionTargets {
  dailyProteinGrams: number;
  dailyWaterLiters: number;
  dailyCaloriesTarget: number;
  creatineDoseGrams: number;
  timingProtocol: {
    morning: string;
    preWorkout: string;
    postWorkout: string;
    bedtime: string;
  };
  clinicalAlerts: string[];
}

/**
 * Calculates evidence-based daily nutrition & dosage targets.
 */
export function calculateDailyNutritionTargets(profile: UserProfile): NutritionTargets {
  const isMale = profile.biologicalSex !== 'Female';
  const weight = profile.weight || 65;

  // Protein calculation:
  // Sedentary: 1.0 - 1.2g/kg
  // Moderate: 1.4 - 1.6g/kg
  // High / Muscle Gain: 1.8 - 2.2g/kg
  let proteinMultiplier = 1.4;
  if (profile.goal === 'Muscle Gain') {
    proteinMultiplier = profile.activity === 'Athlete' ? 2.2 : 2.0;
  } else if (profile.goal === 'Fat Loss') {
    proteinMultiplier = 1.8; // higher protein preserves lean muscle during deficit
  } else if (profile.goal === 'Endurance' || profile.goal === 'Athletic Performance') {
    proteinMultiplier = 1.6;
  } else if (profile.activity === 'Sedentary') {
    proteinMultiplier = 1.1;
  }

  const dailyProteinGrams = Math.round(weight * proteinMultiplier);

  // Water calculation: 35-45 ml per kg body weight + workout factor
  const waterMultiplier = profile.activity === 'Athlete' || profile.activity === 'High' ? 0.05 : 0.04;
  const dailyWaterLiters = Number((weight * waterMultiplier).toFixed(1));

  // Baseline calories (Mifflin-St Jeor rough estimate)
  const baseBMR = isMale ? (10 * weight + 6.25 * 175 - 5 * profile.age + 5) : (10 * weight + 6.25 * 162 - 5 * profile.age - 161);
  const activityFactors = { Sedentary: 1.2, Moderate: 1.45, High: 1.7, Athlete: 1.9 };
  const maintenanceCalories = Math.round(baseBMR * (activityFactors[profile.activity] || 1.4));

  let dailyCaloriesTarget = maintenanceCalories;
  if (profile.goal === 'Muscle Gain') {
    dailyCaloriesTarget = maintenanceCalories + 350; // lean surplus
  } else if (profile.goal === 'Fat Loss') {
    dailyCaloriesTarget = maintenanceCalories - 450; // controlled deficit
  }

  // Clinical alerts
  const clinicalAlerts: string[] = [];
  if (profile.medicalAlerts?.includes('Lactose Intolerance') || profile.symptoms?.includes('Frequent Bloating / Digestion')) {
    clinicalAlerts.push('Lactose Sensitivity Detected: Standard whey concentrate filtered out. Hydrolyzed Isolate or Plant Protein recommended to prevent GI distress.');
  }
  if (profile.bloodBiomarkers?.includes('Low Vitamin D3')) {
    clinicalAlerts.push('Vitamin D3 Deficiency Indicated: Therapeutic D3 + K2 MK-7 prioritization enabled for bone mineral density and testosterone/estrogen regulation.');
  }
  if (profile.biologicalSex === 'Female' && (profile.bloodBiomarkers?.includes('Low Iron / Ferritin') || profile.symptoms?.includes('Chronic Fatigue'))) {
    clinicalAlerts.push('Ferritin / Iron Support: Targeted female multivitamin recommended with 18mg elemental iron & folic acid.');
  }
  if (profile.diet === 'Vegan') {
    clinicalAlerts.push('100% Plant-Based Protocol: Guaranteed dairy-free isolates with complete BCAA/EAA profiles & algal omega-3.');
  }

  return {
    dailyProteinGrams,
    dailyWaterLiters,
    dailyCaloriesTarget,
    creatineDoseGrams: weight > 85 ? 5 : 3,
    timingProtocol: {
      morning: 'Multivitamin + Omega-3 with whole-food breakfast for maximum fat-soluble absorption.',
      preWorkout: 'Pre-Workout or Electrolytes 25-30 mins prior to intense training.',
      postWorkout: 'Fast-digesting Whey Isolate or Plant Isolate + Creapure Creatine within 45 mins.',
      bedtime: profile.symptoms?.includes('Poor Sleep / High Stress') || profile.goal === 'Muscle Gain'
        ? 'Slow-release Micellar Casein or herbal adaptogen 30 mins before sleep.'
        : 'Ensure 7-8 hours sleep for endocrine recovery.'
    },
    clinicalAlerts
  };
}

/**
 * Enhanced Clinical & Lifestyle Recommendation Engine.
 * Covers all 6 pillars:
 * 1. Biometrics & Biological Sex
 * 2. Dietary Patterns & Whole-Food Quality
 * 3. Health Goals & Urgency
 * 4. Clinical Symptoms, Bloating & Lactose Intolerance
 * 5. Activity, Sleep Hours & Chronic Stress
 * 6. Objective Blood Biomarkers & Target Supplement Request
 */
export function scoreAndFilterProducts(products: Product[], profile: UserProfile | null): Product[] {
  if (!profile) {
    return products.map(p => ({
      ...p,
      matchScore: p.isBestSeller ? 92 : 85,
      matchReason: 'Trending fitness essential'
    }));
  }

  // 1. HARD SAFETY FILTERS
  const filteredProducts = products.filter(product => {
    // Diet safety: Vegan
    if (profile.diet === 'Vegan') {
      if (product.target_diet !== 'Vegan') return false;
    }
    // Diet safety: Vegetarian
    if (profile.diet === 'Vegetarian') {
      if (product.target_diet !== 'Vegetarian' && product.target_diet !== 'Vegan') return false;
    }

    // Biological Sex multivitamin safety:
    // Don't recommend Opti-Women to men, don't recommend Opti-Men to women
    if (profile.biologicalSex === 'Male' && product.id === 'prod-vit-2') {
      return false; // Opti-Women
    }
    if (profile.biologicalSex === 'Female' && product.id === 'prod-vit-1') {
      return false; // Opti-Men
    }

    // Severe Lactose Intolerance: exclude standard whey concentrate
    const hasLactoseIntolerance = profile.medicalAlerts?.includes('Lactose Intolerance');
    if (hasLactoseIntolerance && product.proteinType === 'Whey Concentrate / Blend') {
      return false;
    }

    return true;
  });

  // 2. CLINICAL SCORING ENGINE
  const scoredProducts = filteredProducts.map(product => {
    let rawScore = 45; // baseline
    const reasons: string[] = [];

    // --- A. Target Supplement Category Focus ---
    if (profile.targetSupplementCategory && profile.targetSupplementCategory !== 'All / Complete Stack') {
      if (product.category === profile.targetSupplementCategory) {
        rawScore += 35;
        reasons.push(`Direct match for your requested ${profile.targetSupplementCategory}`);
      } else {
        rawScore -= 10; // gently deprioritize non-requested categories
      }
    }

    // --- B. Preferred Protein Type Focus ---
    if (profile.preferredProteinType && profile.preferredProteinType !== 'Any' && product.proteinType) {
      if (product.proteinType === profile.preferredProteinType) {
        rawScore += 30;
        reasons.push(`Matches your preferred ${product.proteinType}`);
      }
    }

    // --- C. Primary Goal Match ---
    if (product.target_goal === profile.goal) {
      rawScore += 25;
      reasons.push(`Engineered for ${profile.goal}`);
    } else {
      // Synergy bonuses
      if (profile.goal === 'Muscle Gain') {
        if (product.category === 'Protein') {
          rawScore += 24;
          reasons.push('High-purity protein for muscular hypertrophy');
        } else if (product.category === 'Creatine') {
          rawScore += 24;
          reasons.push('ATP replenishment for heavy progressive overload');
        } else if (product.category === 'Recovery') {
          rawScore += 18;
          reasons.push('Accelerates post-workout muscle repair');
        }
      } else if (profile.goal === 'Fat Loss') {
        if (product.calories <= 120 && product.protein_g >= 20) {
          rawScore += 26;
          reasons.push('Low-calorie, ultra-high protein satiety');
        } else if (product.category === 'Fish Oil') {
          rawScore += 20;
          reasons.push('Omega-3 EPA supports insulin sensitivity');
        }
      } else if (profile.goal === 'Endurance' || profile.goal === 'Athletic Performance') {
        if (product.category === 'Pre-Workout' || product.category === 'Recovery') {
          rawScore += 25;
          reasons.push('Electrolytes & sustained stamina matrix');
        } else if (product.category === 'Creatine') {
          rawScore += 22;
          reasons.push('Increases anaerobic sprinting power');
        }
      } else if (profile.goal === 'General Fitness') {
        if (product.category === 'Vitamins' || product.category === 'Fish Oil') {
          rawScore += 25;
          reasons.push('Vital micronutrient & heart defense');
        }
      }
    }

    // --- D. Biological Sex & Micronutrients ---
    if (profile.biologicalSex === 'Male' && product.id === 'prod-vit-1') {
      rawScore += 30;
      reasons.push('Male-specific botanical & 75+ active micronutrient blend');
    } else if (profile.biologicalSex === 'Female' && product.id === 'prod-vit-2') {
      rawScore += 30;
      reasons.push('Tailored female formula with 18mg iron, folic acid & calcium');
    }

    // --- E. Clinical Digestive Symptoms & Bloating ---
    const hasBloating = profile.symptoms?.includes('Frequent Bloating / Digestion');
    if (hasBloating) {
      if (product.proteinType === 'Hydrolyzed Whey Isolate') {
        rawScore += 35;
        reasons.push('Hydrolyzed peptides: 0g lactose & zero bloating');
      } else if (product.proteinType === 'Whey Isolate') {
        rawScore += 30;
        reasons.push('Pure isolate: <1g carbs for effortless digestion');
      } else if (product.proteinType === 'Plant Protein Isolate') {
        rawScore += 30;
        reasons.push('100% dairy-free hypoallergenic plant isolate');
      } else if (product.name.includes('Biozyme')) {
        rawScore += 25;
        reasons.push('EAF enzymes clinically proven for 60% less stomach discomfort');
      }
    }

    // --- F. Chronic Fatigue ---
    if (profile.symptoms?.includes('Chronic Fatigue')) {
      if (product.category === 'Creatine') {
        rawScore += 24;
        reasons.push('Replenishes cellular ATP to fight chronic physical exhaustion');
      } else if (product.category === 'Vitamins') {
        rawScore += 22;
        reasons.push('High-potency B-complex restores metabolic energy conversion');
      }
    }

    // --- G. Poor Sleep, High Stress & Sleep Deprivation ---
    const hasSleepIssues = profile.symptoms?.includes('Poor Sleep / High Stress') || 
                           profile.stressLevel === 'High Chronic' || 
                           profile.sleepHours === '<6 hrs';
    if (hasSleepIssues) {
      if (product.proteinType === 'Micellar Casein') {
        rawScore += 32;
        reasons.push('Slow-release nighttime casein for 7-8h overnight anti-catabolic recovery');
      } else if (product.category === 'Fish Oil') {
        rawScore += 22;
        reasons.push('High EPA/DHA suppresses elevated cortisol from chronic stress');
      }
    }

    // --- H. Slow Muscle Recovery ---
    if (profile.symptoms?.includes('Slow Muscle Recovery')) {
      if (product.category === 'Recovery' || product.category === 'Protein') {
        rawScore += 25;
        reasons.push('Targeted BCAA/EAA matrix reduces delayed onset muscle soreness (DOMS)');
      }
    }

    // --- I. Objective Blood Panel Biomarkers ---
    if (profile.bloodBiomarkers?.includes('Low Vitamin D3')) {
      if (product.id === 'prod-vit-4') {
        rawScore += 45;
        reasons.push('Clinical 60,000 IU Vitamin D3 + K2 MK-7 directly corrects deficiency');
      }
    }
    if (profile.bloodBiomarkers?.includes('Low Vitamin B12')) {
      if (product.category === 'Vitamins' || product.name.includes('MB-Vite')) {
        rawScore += 30;
        reasons.push('Active B12 restores neurological baseline');
      }
    }
    if (profile.bloodBiomarkers?.includes('High Joint Inflammation')) {
      if (product.category === 'Fish Oil') {
        rawScore += 35;
        reasons.push('Triple-strength anti-inflammatory EPA/DHA for joint lubrication');
      }
    }

    // --- J. Whole Food Intake Quality ---
    if (profile.dailyDietQuality === 'Irregular / Fast Food') {
      if (product.category === 'Vitamins' || product.category === 'Fish Oil') {
        rawScore += 22;
        reasons.push('Essential safety net for irregular whole-food micronutrient intake');
      }
    } else if (profile.dailyDietQuality === 'High Whole Foods') {
      if (product.proteinType === 'Raw Unflavored') {
        rawScore += 25;
        reasons.push('Zero artificial sweeteners or additives matches your whole-food commitment');
      }
    }

    // --- K. Mass Gainer for Underweight Hardgainers ---
    if (profile.goal === 'Muscle Gain' && profile.weight < 60 && product.proteinType === 'Mass Gainer') {
      rawScore += 30;
      reasons.push('1,250 calorie formula specifically supports rapid weight gain for hardgainers');
    }

    // --- L. Activity Level Synergy ---
    if (profile.activity === 'Athlete' || profile.activity === 'High') {
      if (product.protein_g >= 24) {
        rawScore += 10;
        reasons.push(`${product.protein_g}g heavy-duty protein for intense training load`);
      }
      if (product.category === 'Pre-Workout' || product.category === 'Recovery') {
        rawScore += 10;
        reasons.push('Sustained energy and intra-workout endurance');
      }
    }

    // Rating and best-seller bonuses
    if (product.rating >= 4.8) rawScore += 4;
    if (product.isBestSeller) rawScore += 3;

    // Normalize match score between 75% and 99%
    const normalizedMatch = Math.min(99, Math.max(75, Math.round(rawScore)));

    const primaryReason = reasons.length > 0 
      ? reasons.slice(0, 2).join(' • ')
      : `Optimal synergy with your ${profile.goal} and ${profile.diet} lifestyle`;

    return {
      ...product,
      matchScore: normalizedMatch,
      matchReason: primaryReason,
      clinicalRationale: reasons.join('; ')
    };
  });

  // Sort descending by match score
  return scoredProducts.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}
