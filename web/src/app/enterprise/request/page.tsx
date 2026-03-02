'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const GEOGRAPHIES = [
  'South Asia', 'East Asia', 'Southeast Asia', 'Sub-Saharan Africa',
  'North Africa', 'Middle East', 'Europe', 'North America',
  'Latin America', 'Oceania',
];

export default function RequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedGeos, setSelectedGeos] = useState<string[]>([]);

  function toggleGeo(geo: string) {
    setSelectedGeos((prev) =>
      prev.includes(geo) ? prev.filter((g) => g !== geo) : [...prev, geo]
    );
  }

  if (submitted) {
    return (
      <div style={{ padding: '32px', maxWidth: '640px' }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
        }}>
          <CheckCircle size={48} color="rgba(255,255,255,0.5)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', margin: '0 0 8px' }}>Request Submitted</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 24px' }}>
            Our team will review your request and respond within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            style={{
              padding: '10px 24px',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '640px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text)', margin: '0 0 4px' }}>Request Custom Collection</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          Our team will review and respond within 24 hours.
        </p>
      </div>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {/* Data Type */}
        <div>
          <label style={labelStyle}>Data Type *</label>
          <select style={inputStyle}>
            <option value="">Select data type</option>
            <option value="photo">Photo</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="mixed">Mixed (Photo + Video)</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label style={labelStyle}>Quantity Needed *</label>
          <input type="number" placeholder="e.g. 10000" style={inputStyle} min={0} />
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: '4px 0 0' }}>
            Minimum 500 items for custom collections
          </p>
        </div>

        {/* Geographic Requirements */}
        <div>
          <label style={labelStyle}>Geographic Requirements</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            {GEOGRAPHIES.map((geo) => {
              const selected = selectedGeos.includes(geo);
              return (
                <button
                  key={geo}
                  type="button"
                  onClick={() => toggleGeo(geo)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    border: `1px solid ${selected ? 'rgba(255,255,255,0.25)' : 'var(--border)'}`,
                    background: selected ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: selected ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {geo}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language */}
        <div>
          <label style={labelStyle}>Language (for audio)</label>
          <select style={inputStyle}>
            <option value="">Not applicable</option>
            <option value="hindi">Hindi</option>
            <option value="bangla">Bangla</option>
            <option value="arabic">Arabic</option>
            <option value="swahili">Swahili</option>
            <option value="portuguese">Portuguese</option>
            <option value="spanish">Spanish</option>
            <option value="other">Other (specify in notes)</option>
          </select>
        </div>

        {/* Timeline */}
        <div>
          <label style={labelStyle}>Timeline *</label>
          <select style={inputStyle}>
            <option value="">Select timeline</option>
            <option value="2w">Within 2 weeks</option>
            <option value="1m">Within 1 month</option>
            <option value="3m">Within 3 months</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label style={labelStyle}>Estimated Budget (USD) *</label>
          <input type="number" placeholder="e.g. 5000" style={inputStyle} min={0} />
        </div>

        {/* Special Instructions */}
        <div>
          <label style={labelStyle}>Special Instructions</label>
          <textarea
            placeholder="Any specific requirements — lighting conditions, demographic diversity, annotation format, etc."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={() => setSubmitted(true)}
          style={{
            padding: '13px',
            background: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '4px',
          }}
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '500',
  color: 'var(--text)',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  background: 'var(--surface-elevated)',
  color: 'var(--text)',
  fontSize: '13px',
  boxSizing: 'border-box',
  outline: 'none',
};
