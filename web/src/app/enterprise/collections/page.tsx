'use client';

import { FolderOpen, Plus } from 'lucide-react';

const COLLECTIONS = [
  { name: 'Q1 Training Batch', datasets: 3, items: '32K', updated: '2025-01-28' },
  { name: 'Multilingual Audio Set', datasets: 2, items: '23K', updated: '2025-01-15' },
  { name: 'Visual Diversity Pack', datasets: 4, items: '80K', updated: '2024-12-20' },
];

export default function CollectionsPage() {
  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text)', margin: '0 0 4px' }}>Collections</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Organize datasets into reusable groups</p>
        </div>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '9px 16px',
          background: '#fff',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
        }}>
          <Plus size={14} />
          New Collection
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {COLLECTIONS.map((col) => (
          <div
            key={col.name}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <FolderOpen size={18} color="rgba(255,255,255,0.4)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', margin: '0 0 4px' }}>{col.name}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                {col.datasets} datasets · {col.items} items · Updated {col.updated}
              </p>
            </div>
            <button style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              cursor: 'pointer',
            }}>
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
