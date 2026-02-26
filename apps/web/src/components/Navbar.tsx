'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';

export function Navbar() {
  const t = useTranslations('nav');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2" aria-label="Listino Pronto home">
              <Zap className="h-8 w-8 text-brand-500" />
              <span className="text-xl font-bold text-brand-500">Listino Pronto</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-gray-600 hover:text-brand-500 transition-colors">{t('features')}</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-brand-500 transition-colors">{t('pricing')}</Link>
            <Link href="/faq" className="text-gray-600 hover:text-brand-500 transition-colors">{t('faq')}</Link>
            <Link href="/settings" className="text-gray-600 hover:text-brand-500 transition-colors">{t('settings')}</Link>
            <LanguageToggle />
            <Link
              href="/upload"
              className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors"
              aria-label={t('upload')}
            >
              {t('upload')}
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-brand-500"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            <Link href="/#features" className="block text-gray-600 hover:text-brand-500" onClick={() => setIsOpen(false)}>{t('features')}</Link>
            <Link href="/pricing" className="block text-gray-600 hover:text-brand-500" onClick={() => setIsOpen(false)}>{t('pricing')}</Link>
            <Link href="/faq" className="block text-gray-600 hover:text-brand-500" onClick={() => setIsOpen(false)}>{t('faq')}</Link>
            <Link href="/settings" className="block text-gray-600 hover:text-brand-500" onClick={() => setIsOpen(false)}>{t('settings')}</Link>
            <LanguageToggle />
            <Link
              href="/upload"
              className="block bg-brand-500 text-white px-4 py-2 rounded-lg text-center hover:bg-brand-600"
              onClick={() => setIsOpen(false)}
            >
              {t('upload')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
