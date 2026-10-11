import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import ChatWindow from '../components/ChatWindow';

export const metadata: Metadata = {
  title: 'WiseFoodies | Know Your Food',
  description:
    'Eat Smarter. Choose Better. Know your food before you buy it with the Food Benefit Score (FBS) and Nutrition Per Paisa.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('wf_theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main" className="flex-1 pb-24 md:pb-8">{children}</main>
        <Footer />
        <MobileNav />
        <ChatWindow />
      </body>
    </html>
  );
}
