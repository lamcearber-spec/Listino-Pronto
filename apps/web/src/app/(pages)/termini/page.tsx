import { useTranslations } from 'next-intl';

export default function TerminiPage() {
  const t = useTranslations('legal');

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('termsTitle')}</h1>
      <div className="prose prose-gray max-w-none">
        <p>Utilizzando Listino Pronto, accettate i seguenti termini e condizioni di servizio.</p>
        <h2>Servizio</h2>
        <p>Listino Pronto fornisce strumenti di conversione automatica per cataloghi prodotto nei formati ETIM BMEcat 5.0 XML e Metel ECP.</p>
        <h2>Responsabilità</h2>
        <p>L&apos;utente è responsabile della verifica dei dati esportati prima dell&apos;invio al Metel Data Pool. Listino Pronto non garantisce la correttezza assoluta della classificazione AI.</p>
        <h2>Fatturazione</h2>
        <p>I piani sono fatturati mensilmente o annualmente in base al numero di SKU classificati. Gli SKU non utilizzati non si accumulano tra i periodi.</p>
        <h2>Cancellazione</h2>
        <p>Potete cancellare il vostro abbonamento in qualsiasi momento. I dati vengono eliminati entro 30 giorni dalla cancellazione.</p>
      </div>
    </div>
  );
}
