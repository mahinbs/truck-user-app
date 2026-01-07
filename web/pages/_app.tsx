import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { BottomNav } from '../components/BottomNav';

const pagesWithBottomNav = ['/dashboard', '/trips', '/profile'];

export default function App({ Component, pageProps, router }: AppProps) {
  const showBottomNav = pagesWithBottomNav.includes(router.pathname);

  return (
    <>
      <Component {...pageProps} />
      {showBottomNav && <BottomNav />}
    </>
  );
}

