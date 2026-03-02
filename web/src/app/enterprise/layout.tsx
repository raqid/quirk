import Sidebar from '@/components/enterprise/Sidebar';

export const metadata = {
  title: 'Quirk Enterprise — Data Marketplace',
};

export default function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
