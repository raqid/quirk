import Link from 'next/link';
import { Camera, Video, Mic, Filter } from 'lucide-react';
import { DATASETS } from '@/data/enterprise';
import type { DataType } from '@/data/enterprise';

const TYPE_ICON: Record<DataType, React.ElementType> = {
  photo: Camera,
  video: Video,
  audio: Mic,
};

const TYPE_COLOR: Record<DataType, string> = {
  photo: 'rgba(255,255,255,0.5)',
  audio: 'rgba(180,160,120,0.6)',
  video: 'rgba(140,160,200,0.6)',
};

function QualityBar({ score }: { score: number }) {
  const color = score >= 90 ? 'rgba(255,255,255,0.6)' : score >= 80 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.25)';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Quality</span>
        <span style={{ fontSize: '11px', color, fontWeight: '500' }}>{score}</span>
      </div>
      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: '2px' }} />
      </div>
    </div>
  );
}

function DatasetCard({ dataset }: { dataset: typeof DATASETS[0] }) {
  const TypeIcon = TYPE_ICON[dataset.type];
  const typeColor = TYPE_COLOR[dataset.type];
  return (
    <Link href={`/enterprise/datasets/${dataset.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          transition: 'border-color 0.15s',
          cursor: 'pointer',
        }}
        className="dataset-card"
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', margin: 0, lineHeight: '1.4' }}>
            {dataset.name}
          </h3>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '500',
            color: typeColor,
            background: `${typeColor}1A`,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            <TypeIcon size={10} />
            {dataset.type}
          </span>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: '0 0 2px' }}>Size</p>
            <p style={{ fontSize: '13px', color: 'var(--text)', margin: 0, fontWeight: '500' }}>{dataset.countLabel}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: '0 0 2px' }}>Geography</p>
            <p style={{ fontSize: '13px', color: 'var(--text)', margin: 0 }}>{dataset.geography}</p>
          </div>
        </div>

        <QualityBar score={dataset.quality} />

        {/* Price */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border)',
          paddingTop: '12px',
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Per {dataset.unit}</span>
          <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
            ${dataset.pricePerUnit.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function DatasetsPage() {
  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text)', margin: '0 0 4px' }}>Dataset Catalog</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Browse and purchase curated AI training datasets</p>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
          <Filter size={14} />
          <span>Filters:</span>
        </div>
        {['All Types', 'Photo', 'Video', 'Audio'].map((f) => (
          <button key={f} style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            background: f === 'All Types' ? 'var(--surface-elevated)' : 'transparent',
            color: f === 'All Types' ? 'var(--text)' : 'var(--text-secondary)',
            fontSize: '12px',
            cursor: 'pointer',
          }}>
            {f}
          </button>
        ))}
        <select style={{
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--text-secondary)',
          fontSize: '12px',
          cursor: 'pointer',
        }}>
          <option>All Geographies</option>
          <option>South Asia</option>
          <option>East Asia</option>
          <option>Africa</option>
          <option>Americas</option>
        </select>
        <select style={{
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--text-secondary)',
          fontSize: '12px',
          cursor: 'pointer',
        }}>
          <option>Any Quality</option>
          <option>90+ Score</option>
          <option>80+ Score</option>
        </select>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
      }}>
        {DATASETS.map((d) => <DatasetCard key={d.id} dataset={d} />)}
      </div>

      <style>{`
        .dataset-card:hover { border-color: var(--border-light) !important; }
      `}</style>
    </div>
  );
}
