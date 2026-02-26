'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const [companyId, setCompanyId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCompanyId(localStorage.getItem('listino-pronto-company-id') || '');
    setBrandId(localStorage.getItem('listino-pronto-brand-id') || '');
  }, []);

  const handleSave = () => {
    localStorage.setItem('listino-pronto-company-id', companyId.toUpperCase().slice(0, 3));
    localStorage.setItem('listino-pronto-brand-id', brandId);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
            {t('companyId')}
          </label>
          <input
            id="companyId"
            type="text"
            maxLength={3}
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value.toUpperCase())}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono uppercase focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            placeholder="ABC"
            aria-describedby="companyIdHelp"
          />
          <p id="companyIdHelp" className="text-xs text-gray-400 mt-1">{t('companyIdHelp')}</p>
        </div>

        <div>
          <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 mb-1">
            {t('brandId')}
          </label>
          <input
            id="brandId"
            type="text"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            placeholder="My Brand Name"
            aria-describedby="brandIdHelp"
          />
          <p id="brandIdHelp" className="text-xs text-gray-400 mt-1">{t('brandIdHelp')}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-brand-500 text-white px-6 py-2 rounded-lg hover:bg-brand-600 transition-colors"
            aria-label={t('save')}
          >
            <Save className="h-4 w-4" />
            {t('save')}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              {t('saved')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
