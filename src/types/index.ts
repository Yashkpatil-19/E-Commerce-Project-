export type TargetGoal = 'Muscle Gain' | 'Fat Loss' | 'Endurance' | 'General Fitness' | 'Athletic Performance';

export type ActivityLevel = 'Sedentary' | 'Moderate' | 'High' | 'Athlete';

export type TargetDiet = 'Vegetarian' | 'Vegan' | 'Non-Vegetarian';

export type BiologicalSex = 'Male' | 'Female' | 'Other';

export type DailyDietQuality = 'High Whole Foods' | 'Moderate Balance' | 'Irregular / Fast Food';

export type SymptomType = 
  | 'Chronic Fatigue' 
  | 'Poor Sleep / High Stress' 
  | 'Frequent Bloating / Digestion' 
  | 'Slow Muscle Recovery';

export type MedicalCondition = 
  | 'Lactose Intolerance' 
  | 'Kidney Strain' 
  | 'High Blood Pressure' 
  | 'None / Healthy';

export type StressLevel = 'Low' | 'Moderate' | 'High Chronic';

export type SleepHours = '<6 hrs' | '6-7 hrs' | '7-8+ hrs';

export type BiomarkerStatus = 
  | 'Low Vitamin D3' 
  | 'Low Vitamin B12' 
  | 'Low Iron / Ferritin' 
  | 'High Joint Inflammation' 
  | 'Normal / Untested';

export type GoalTimeline = 'Short-term Peak Cycle (4-8 wks)' | 'Long-term Lifestyle Wellness';

export type TargetSupplementCategory = 
  | 'All / Complete Stack' 
  | 'Protein' 
  | 'Creatine' 
  | 'Vitamins' 
  | 'Fish Oil' 
  | 'Pre-Workout' 
  | 'Recovery';

export type ProteinType = 
  | 'Whey Isolate' 
  | 'Hydrolyzed Whey Isolate' 
  | 'Whey Concentrate / Blend' 
  | 'Micellar Casein' 
  | 'Plant Protein Isolate' 
  | 'Mass Gainer' 
  | 'Raw Unflavored';

export interface UserProfile {
  age: number;
  weight: number; // in kg
  goal: TargetGoal;
  activity: ActivityLevel;
  diet: TargetDiet;
  // Clinical 6-pillar assessment metrics
  biologicalSex?: BiologicalSex;
  heightCm?: number;
  dailyDietQuality?: DailyDietQuality;
  symptoms?: SymptomType[];
  medicalAlerts?: MedicalCondition[];
  stressLevel?: StressLevel;
  sleepHours?: SleepHours;
  bloodBiomarkers?: BiomarkerStatus[];
  timeline?: GoalTimeline;
  targetSupplementCategory?: TargetSupplementCategory;
  preferredProteinType?: ProteinType | 'Any';
}

export interface NutritionFacts {
  perServing: string;
  protein: string;
  calories: string;
  carbs: string;
  fats: string;
  bcaa: string;
  sugar: string;
}

export type ProductCategory = 
  | 'Protein' 
  | 'Creatine' 
  | 'Vitamins' 
  | 'Fish Oil' 
  | 'Pre-Workout' 
  | 'Recovery' 
  | 'Meal Replacements';

export type ProductForm = 'Capsule' | 'Softgel' | 'Powder' | 'Tablet' | 'Liquid';

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  verifiedBuyer: boolean;
  batchCode?: string;
  title: string;
  comment: string;
  helpfulCount: number;
  ratingAttributes?: {
    effectiveness?: number;
    quality?: number;
    packaging?: number;
  };
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory?: string;
  form?: ProductForm;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  protein_g: number;
  calories: number;
  target_goal: TargetGoal;
  target_diet: TargetDiet;
  image: string;
  servings: number;
  flavors: string[];
  sizes: string[];
  nutritionFacts: NutritionFacts;
  description: string;
  isBestSeller?: boolean;
  brandVerificationBadge?: string;
  reviews?: CustomerReview[];
  matchScore?: number;
  matchReason?: string;
  proteinType?: ProteinType;
  clinicalRationale?: string;
}

export interface CartItem {
  product: Product;
  flavor: string;
  size: string;
  quantity: number;
}

export interface ScratchCode {
  code: string;
  brand: string;
  product: string;
  batch: string;
  mfg: string;
  exp: string;
}

export interface VerifiedRecord {
  code: string;
  brand: string;
  product: string;
  batch: string;
  verifiedAt: string;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'paypal' | 'upi' | 'cod';
}

export type OrderStatus = 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'verified' | 'completed' | 'failed';

export interface Order {
  id: string;
  orderNumber?: string;
  userId?: string;
  date: string;
  status: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingDetails: ShippingDetails;
  paymentMethod?: string;
  paymentStatus?: PaymentStatus;
  paymentProofUrl?: string;
  paymentProofKey?: string;
  userProfile?: UserProfile;
}

export type ScreenType = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'verify' 
  | 'cart' 
  | 'checkout' 
  | 'order-confirmation' 
  | 'profile-setup'
  | 'profile';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isLoggedIn: boolean;
  goal?: TargetGoal;
  diet?: TargetDiet;
  savedAddresses?: string[];
  createdAt?: string;
}

export interface PendingCartAction {
  type: 'add-to-cart' | 'buy-now' | 'checkout';
  product?: Product;
  flavor?: string;
  size?: string;
  quantity?: number;
}
