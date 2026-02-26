import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('legal');

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('privacyTitle')}</h1>
      <div className="prose prose-gray max-w-none">
        <p>Listino Pronto (&quot;noi&quot;, &quot;nostro&quot;) si impegna a proteggere la vostra privacy. Questa informativa descrive come raccogliamo, utilizziamo e proteggiamo i vostri dati personali.</p>
        <h2>Dati Raccolti</h2>
        <p>Raccogliamo solo i dati necessari per fornire il servizio: file di catalogo caricati, impostazioni aziendali (Codice Metel, ID Marca) e dati tecnici di navigazione.</p>
        <h2>Utilizzo dei Dati</h2>
        <p>I vostri dati vengono utilizzati esclusivamente per la classificazione ETIM e la generazione di file Metel. Non condividiamo i dati con terze parti.</p>
        <h2>Conservazione</h2>
        <p>I file caricati vengono eliminati automaticamente dopo 24 ore dalla sessione. Le correzioni di apprendimento attivo vengono conservate per migliorare la precisione del servizio.</p>
        <h2>Diritti GDPR</h2>
        <p>Avete diritto di accesso, rettifica, cancellazione e portabilità dei vostri dati. Contattate privacy@listino-pronto.it per qualsiasi richiesta.</p>
      </div>
    </div>
  );
}
