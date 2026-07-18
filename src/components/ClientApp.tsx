'use client';

import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/components/theme-provider';

const App = dynamic(() => import('../App'), { ssr: false });

if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === 'string' && input.startsWith('https://api.gcx.co.in')) {
      input = input.replace('https://api.gcx.co.in', '');
    }
    return originalFetch(input, init);
  };
}

export default function ClientApp() {
  return (
    <ThemeProvider defaultTheme="light">
      <App />
    </ThemeProvider>
  );
}
