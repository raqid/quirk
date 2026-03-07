import Providers from '../providers';
import TopNav from '@/components/app/TopNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <TopNav />
      <main style={{
        paddingTop: 80, paddingBottom: 40,
        maxWidth: 1000, margin: '0 auto', paddingLeft: 20, paddingRight: 20,
      }}>
        {children}
      </main>
    </Providers>
  );
}
