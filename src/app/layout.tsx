import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { AppProvider } from '../context/AppContext';

export const metadata: Metadata = {
  title: 'PurePro | Premium Multi-Brand Supplement & Nutrition Store',
  description: 'AI-tailored sports nutrition, genuine scratch-code verified proteins, pre-workouts and vitamins.',
  icons: {
    icon: '/purepro-logo.png',
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
