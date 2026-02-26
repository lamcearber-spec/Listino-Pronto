import { useTranslations } from 'next-intl';

export default function ImpressumPage() {
  const t = useTranslations('legal');

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('impressumTitle')}</h1>
      <div className="prose prose-gray max-w-none">
        <h2>Informazioni Legali</h2>
        <p>Listino Pronto<br />Via Example 1<br />20100 Milano (MI)<br />Italia</p>
        <p>P.IVA: IT00000000000<br />Email: info@listino-pronto.it</p>
        <h2>Hosting</h2>
        <p>Servizio ospitato su infrastruttura EU conforme al GDPR.</p>
      </div>
    </div>
  );
}
