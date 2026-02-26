import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const t = useTranslations('pricing');

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Starter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('starter')}</h2>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">{t('starterPrice')}</span>
            <span className="text-gray-500">{t('starterPeriod')}</span>
            <p className="text-sm text-gray-400 mt-1">{t('starterYear')}</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              {t('starterFeature1')}
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              {t('starterFeature2')}
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              {t('starterFeature3')}
            </li>
          </ul>
          <Link
            href="/upload"
            className="block w-full text-center bg-brand-500 text-white py-3 rounded-lg hover:bg-brand-600 transition-colors"
            aria-label={`${t('cta')} - ${t('starter')}`}
          >
            {t('cta')}
          </Link>
        </div>

        {/* Business */}
        <div className="bg-white rounded-xl shadow-md border-2 border-brand-500 p-8 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {t('popular')}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('business')}</h2>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">{t('businessPrice')}</span>
            <span className="text-gray-500">{t('businessPeriod')}</span>
            <p className="text-sm text-gray-400 mt-1">{t('businessYear')}</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              {t('businessFeature1')}
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              {t('businessFeature2')}
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              {t('businessFeature3')}
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              {t('businessFeature4')}
            </li>
          </ul>
          <Link
            href="/upload"
            className="block w-full text-center bg-brand-500 text-white py-3 rounded-lg hover:bg-brand-600 transition-colors"
            aria-label={`${t('cta')} - ${t('business')}`}
          >
            {t('cta')}
          </Link>
        </div>

        {/* Enterprise */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('enterprise')}</h2>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">{t('enterprisePrice')}</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              {t('enterpriseFeature1')}
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              {t('enterpriseFeature2')}
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              {t('enterpriseFeature3')}
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              {t('enterpriseFeature4')}
            </li>
          </ul>
          <a
            href="mailto:info@listino-pronto.it"
            className="block w-full text-center border-2 border-brand-500 text-brand-500 py-3 rounded-lg hover:bg-brand-50 transition-colors"
            aria-label={`${t('contact')} - ${t('enterprise')}`}
          >
            {t('contact')}
          </a>
        </div>
      </div>
    </div>
  );
}
