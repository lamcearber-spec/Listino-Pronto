import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { CatalogProvider } from '@/contexts/CatalogContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Listino Pronto — Catalogo ETIM e Metel per la distribuzione elettrica',
  description: 'Converti il tuo catalogo prodotti CSV/Excel in formato ETIM BMEcat 5.0 XML e Metel ECP per il mercato della distribuzione elettrica italiana.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CatalogProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieConsent />
          </CatalogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
