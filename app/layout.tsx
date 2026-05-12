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
  metadataBase: new URL('https://komakloyihasi.uz'),
  title: {
    default: "Ko'mak — Orzularga qanot beramiz",
    template: "%s | Ko'mak Loyihasi",
  },
  description:
    "Chekka hududlarda zamonaviy til o'quv markazlarini ochmoqchi yoshlarga foizsiz ssuda",
  keywords: [
    "Ko'mak",
    'foizsiz ssuda',
    "o'quv markazi",
    'yoshlar fondi',
    "chet tili o'rgatish",
    "O'zbekiston",
  ],
  icons: {
    icon: '/Group 85.svg',
    shortcut: '/Group 85.svg',
    apple: '/Group 85.svg',
  },
  openGraph: {
    title: "Ko'mak — Orzularga qanot beramiz",
    description:
      "Chekka hududlarda zamonaviy til o'quv markazlarini ochmoqchi yoshlarga foizsiz ssuda",
    url: "https://komakloyihasi.uz",
    siteName: "Ko'mak Loyihasi",
    images: [
      {
        url: "/komakOG.png",
        width: 1200,
        height: 630,
        alt: "Ko'mak Loyihasi",
      }
    ],
    type: 'website',
    locale: 'uz_UZ',
  },
  twitter: {
    card: "summary_large_image",
    title: "Ko'mak — Orzularga qanot beramiz",
    description: "Chekka hududlarda zamonaviy til o'quv markazlarini ochmoqchi yoshlarga foizsiz ssuda",
    images: ["/komakOG.png"],
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
        {/* Preload Material Symbols font — prevents render blocking (~300KB) */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          as="style"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-body bg-surface text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
