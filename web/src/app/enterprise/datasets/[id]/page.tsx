import { notFound } from 'next/navigation';
import { Camera, Video, Mic, MapPin, Calendar, Cpu, CheckCircle } from 'lucide-react';
import { DATASETS } from '@/data/enterprise';
import DatasetCharts from '@/components/enterprise/DatasetCharts';

export function generateStaticParams() {
  return DATASETS.map((d) => ({ id: d.id }));
}

const TYPE_ICON = { photo: Camera, video: Video, audio: Mic };
const TYPE_COLOR = { photo: 'rgba(255,255,255,0.5)', video: 'rgba(140,160,200,0.6)', audio: 'rgba(180,160,120,0.6)' };

const LICENSE_TERMS = [
  'Full commercial use license for AI/ML training',
  'No attribution required in trained models',
  'Perpetual license — data purchased stays licensed',
  'Not for resale or redistribution',
  'Single organization use only',
];

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DatasetDetailPage({ params }: Props) {
  const { id } = await params;
  const dataset = DATASETS.find((d) => d.id === id);
  if (!dataset) notFound();

  const TypeIcon = TYPE_ICON[dataset.type];
  const typeColor = TYPE_COLOR[dataset.type];

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      {/* Back */}
      <a href="/enterprise/datasets" style={{
        fontSize: '13px',
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        marginBottom: '24px',
      }}>
        ← Back to Catalog
      </a>

      {/* Header */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '500',
                color: typeColor, background: `${typeColor}1A`,
              }}>
                <TypeIcon size={11} />
                {dataset.type}
              </span>
              <span style={{
                fontSize: '11px', padding: '3px 10px', borderRadius: '4px',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontWeight: '500',
              }}>
                Quality {dataset.quality}
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text)', margin: '0 0 8px' }}>{dataset.name}</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, maxWidth: '560px' }}>{dataset.description}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text)', margin: '0 0 2px' }}>
              ${dataset.pricePerUnit.toFixed(2)}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>per {dataset.unit}</p>
          </div>
        </div>

        {/* Meta chips */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
          {[
            { icon: MapPin, label: dataset.geography },
            { icon: Calendar, label: dataset.dateRange },
            { icon: Cpu, label: dataset.devices.join(', ') },
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <Icon size={13} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div style={{ marginBottom: '20px' }}>
        <DatasetCharts dataset={dataset} />
      </div>

      {/* Sample Grid + Pricing + License */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Sample Preview */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', margin: '0 0 14px' }}>Sample Preview</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {Array.from({ length: 9 }).map((_, i) => {
                const lightness = 14 + (i % 3) * 2;
                return (
                  <div key={i} style={{
                    aspectRatio: '4/3',
                    borderRadius: '6px',
                    background: `hsl(0, 0%, ${lightness}%)`,
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                      {dataset.type} #{i + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Pricing Tiers */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', margin: '0 0 14px' }}>Pricing Tiers</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dataset.pricingTiers.map((tier) => (
                <div key={tier.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--border)',
                }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)', margin: '0 0 2px' }}>{tier.label}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: 0 }}>{tier.quantity.toLocaleString()} {dataset.unit}s</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', margin: '0 0 2px' }}>
                      ${tier.total}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: 0 }}>
                      ${tier.pricePerUnit}/{dataset.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button style={{
              width: '100%',
              marginTop: '14px',
              padding: '12px',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
              Purchase Dataset
            </button>
            <button style={{
              width: '100%',
              marginTop: '8px',
              padding: '11px',
              background: 'transparent',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}>
              Request Custom Collection
            </button>
          </div>

          {/* License Terms */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', margin: '0 0 12px' }}>License Terms</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {LICENSE_TERMS.map((term) => (
                <div key={term} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <CheckCircle size={13} color="rgba(255,255,255,0.4)" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>{term}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
