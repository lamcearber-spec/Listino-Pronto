'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { setLocale } from '@/lib/locale';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();

  const toggleLocale = async () => {
    const newLocale = locale === 'it' ? 'en' : 'it';
    await setLocale(newLocale);
    router.refresh();
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1 text-gray-600 hover:text-brand-500 transition-colors text-sm"
      aria-label={`Switch to ${locale === 'it' ? 'English' : 'Italiano'}`}
    >
      <Globe className="h-4 w-4" />
      <span>{locale === 'it' ? 'EN' : 'IT'}</span>
    </button>
  );
}
