import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Upload, Brain, Download, Shield, Server, Award, Plug } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-500 to-brand-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('hero.title')}</h1>
          <p className="text-lg md:text-xl text-brand-100 mb-8 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 bg-white text-brand-500 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-50 transition-colors shadow-lg"
            aria-label={t('hero.cta')}
          >
            <Upload className="h-5 w-5" />
            {t('hero.cta')}
          </Link>
          <p className="mt-6 text-brand-200 text-sm">{t('hero.trusted')}</p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-brand-500" />
              </div>
              <div className="text-sm font-semibold text-brand-500 mb-1">Step 1</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('steps.step1')}</h3>
              <p className="text-gray-600 text-sm">{t('steps.step1Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-brand-500" />
              </div>
              <div className="text-sm font-semibold text-brand-500 mb-1">Step 2</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('steps.step2')}</h3>
              <p className="text-gray-600 text-sm">{t('steps.step2Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-brand-500" />
              </div>
              <div className="text-sm font-semibold text-brand-500 mb-1">Step 3</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('steps.step3')}</h3>
              <p className="text-gray-600 text-sm">{t('steps.step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t('features.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Brain className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.ai')}</h3>
              <p className="text-gray-600 text-sm">{t('features.aiDesc')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Download className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.formats')}</h3>
              <p className="text-gray-600 text-sm">{t('features.formatsDesc')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Brain className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.learning')}</h3>
              <p className="text-gray-600 text-sm">{t('features.learningDesc')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Award className="h-10 w-10 text-brand-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.compliance')}</h3>
              <p className="text-gray-600 text-sm">{t('features.complianceDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <Shield className="h-4 w-4" />
              {t('trust.gdpr')}
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <Server className="h-4 w-4" />
              {t('trust.eu')}
            </div>
            <div className="flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-full text-sm font-medium">
              <Award className="h-4 w-4" />
              {t('trust.etim')}
            </div>
            <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
              <Plug className="h-4 w-4" />
              {t('trust.metel')}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
