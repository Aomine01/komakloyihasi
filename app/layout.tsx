import type { Metadata } from 'next';
import { Public_Sans, Inter } from 'next/font/google';
import './globals.css';

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Ko'mak — Orzularga qanot beramiz",
  description:
    "Chekka va olis hududlarda zamonaviy til o'quv markazlarini ochmoqchi yoshlarga — foizsiz ssuda, davlat ko'magi va yaxlit ekotizim. O'zbekiston Yoshlar fondi loyihasi.",
  keywords: [
    "Ko'mak",
    'foizsiz ssuda',
    "o'quv markazi",
    'yoshlar fondi',
    "chet tili o'rgatish",
    "O'zbekiston",
  ],
  openGraph: {
    title: "Ko'mak — Orzularga qanot beramiz",
    description:
      "Chekka hududlarda zamonaviy til o'quv markazlarini ochmoqchi yoshlarga foizsiz ssuda",
    type: 'website',
    locale: 'uz_UZ',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={`${publicSans.variable} ${inter.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-surface text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
        {children}

        {/* Floating Telegram Button */}
        <a
          href="https://t.me/komak_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-float transition-transform hover:scale-110"
          aria-label="Telegram bot"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6 text-white"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </a>
      </body>
    </html>
  );
}
