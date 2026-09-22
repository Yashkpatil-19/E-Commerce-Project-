# TRustIT — Premium Multi-Brand Supplement & Nutrition Store

A mobile-first eCommerce web application engineered for authentic sports nutrition, personalized rule-based recommendation scoring, anti-counterfeit scratch-code verification, and seamless static hosting on Netlify.

---

## ✨ Features

- **Personalized Rule-Based Scoring Engine**:
  - Dynamically scores and ranks 30 products based on User Profile (Age, Body Weight, Fitness Goal, Activity Level, Diet).
  - Calculates a real-time **Compatibility Match %** (e.g. `98% Match`).
  - **Strict Diet Safety Filter**: When Vegetarian or Vegan is chosen, all non-vegetarian items (e.g., animal collagen, fish oil softgels) are automatically and completely excluded.
  - Automatically populates the **"Recommended for You"** showcase on the home screen.
- **Product Image Fix**:
  - All product cards, listings, and detail pages utilize a dedicated 1:1 aspect ratio container with `object-fit: contain`, subtle neutral backgrounds (`#f8fafc`), and generous padding so supplement tubs, bottles, and canisters are displayed cleanly without cropping or zooming.
- **Anti-Counterfeit Scratch-Code Verification**:
  - Pre-seeded with 50 manufacturer authentication codes.
  - Handles 3 distinct lifecycle states:
    1. **Genuine Product**: Displays manufacturer batch, expiry, and authenticates the product. Automatically marks the code as registered in `localStorage`.
    2. **Already-Used Warning**: Shows previous verification timestamp and alerts the customer to counterfeit duplicate risks.
    3. **Invalid Code**: Highlights counterfeit alert and provides manufacturer helpline contact.
  - Tracks verification history in browser `localStorage`.
- **Cart & Express Checkout**:
  - Size and flavor selectors with dynamic pricing.
  - LocalStorage-backed cart with item counters, coupon code discounts (`VITAL10`), and free shipping.
  - Form validation (Name, Email, 10-digit Phone, Full Address).
  - Double-submission prevention with loading state.
  - Formspree order dispatch and automatic cart clearing.
  - Redirection to PayPal.me link (with total appended) or instant UPI QR code.
- **Zero-Config Netlify Static Export**:
  - Built with Next.js static HTML export (`output: 'export'`, `images: { unoptimized: true }`).
  - Pre-configured `netlify.toml` with publish directory `out`.

---

## 🚀 Getting Started

### 1. Local Development
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your mobile browser or device emulator.

### 2. Building for Static Export
```bash
npm run build
```
This will compile and output the full production-ready static website to the `out/` directory.

---

## 🌐 Deploying to Netlify

### Option A: Direct Drag & Drop (Netlify Drop)
1. Run `npm run build` locally to generate the `out/` directory.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `out` folder into the Netlify upload box.
4. Your website will be live in seconds with an SSL certificate.

### Option B: Deploy with Git Repository
1. Push your code to GitHub / GitLab / Bitbucket.
2. Log in to Netlify and click **"Add new site" -> "Import an existing project"**.
3. Select your repository.
4. Netlify will auto-detect settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
5. Click **"Deploy site"**.

---

## ⚙️ Configuring Formspree & Payment Links

The project is pre-configured with demo-friendly fallbacks. To connect your live endpoints, you can configure them via environment variables or replace them directly in `src/components/screens/CheckoutScreen.tsx` and `src/context/AppContext.tsx`:

Create a `.env.local` file:
```env
# Formspree endpoint (e.g. https://formspree.io/f/mqkvyqpo)
NEXT_PUBLIC_FORMSPREE_URL=https://formspree.io/f/YOUR_FORMSPREE_URL

# PayPal.me link (e.g. https://paypal.me/yourbrand)
NEXT_PUBLIC_PAYPAL_ME_LINK=https://paypal.me/YOUR_PAYPAL_ME_LINK
```

> **Note for India Sales**: If selling domestically in India, UPI and Razorpay Payment Links are supported out of the box. You can swap `NEXT_PUBLIC_PAYPAL_ME_LINK` for your Razorpay Payment Link or UPI address (`yourhandle@upi`).

---

## 🧪 Testing Scratch Codes

Try these pre-loaded codes on the **Verify** screen:
- `ON-7842-X9`: Optimum Nutrition Gold Standard 100% Whey
- `MB-9102-K3`: MuscleBlaze Biozyme Performance Whey
- `DYMA-4421-Z8`: Dymatize ISO 100 Hydrolyzed Whey
- `FA-6632-L7`: Fast&Up Reload Electrolytes Fizz
- `FAKE-9999-NO`: Counterfeit / Invalid test code
