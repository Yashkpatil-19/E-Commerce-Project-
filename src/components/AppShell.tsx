'use client';

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { ProductListingScreen } from './screens/ProductListingScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { VerifyProductScreen } from './screens/VerifyProductScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrderConfirmationScreen } from './screens/OrderConfirmationScreen';
import { ProfileSetupScreen } from './screens/ProfileSetupScreen';
import { UserProfileScreen } from './screens/UserProfileScreen';
import { AuthModal } from './AuthModal';
import { AssessmentQuizModal } from './AssessmentQuizModal';
import { ScreenType } from '../types';

interface AppShellProps {
  initialScreen?: ScreenType;
}

export const AppShell: React.FC<AppShellProps> = ({ initialScreen }) => {
  const { currentScreen, navigateTo, isAssessmentOpen, closeAssessment } = useApp();

  useEffect(() => {
    if (initialScreen) {
      navigateTo(initialScreen);
    }
  }, [initialScreen]);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'products':
        return <ProductListingScreen />;
      case 'product-detail':
        return <ProductDetailScreen />;
      case 'verify':
        return <VerifyProductScreen />;
      case 'cart':
        return <CartScreen />;
      case 'checkout':
        return <CheckoutScreen />;
      case 'order-confirmation':
        return <OrderConfirmationScreen />;
      case 'profile-setup':
        return <ProfileSetupScreen />;
      case 'profile':
        return <UserProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const hideBottomNav = currentScreen === 'checkout' || currentScreen === 'order-confirmation';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Website Top Header & Navigation */}
      <Navbar />

      {/* Main Website Content Area (Responsive container) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveScreen()}
      </main>

      {/* Full Website Footer */}
      <Footer />

      {/* Sticky Bottom Nav (Mobile devices only) */}
      {!hideBottomNav && <BottomNav />}

      {/* Login & Create Account Modal */}
      <AuthModal />

      {/* Clinical 6-Pillar Assessment & Supplement Quiz Modal */}
      <AssessmentQuizModal isOpen={isAssessmentOpen} onClose={closeAssessment} />
    </div>
  );
};
