'use client';

import { useState } from 'react';

const SECTIONS = [
  {
    title: 'Organization',
    fields: [
      { label: 'Company Name', value: 'Acme Corp', type: 'text' as const },
      { label: 'Contact Email', value: 'data-team@acme.com', type: 'text' as const },
      { label: 'Plan', value: 'Enterprise', type: 'readonly' as const },
    ],
  },
  {
    title: 'API Access',
    fields: [
      { label: 'API Key', value: 'sk-••••••••••••••••3f8a', type: 'readonly' as const },
      { label: 'Webhook URL', value: 'https://acme.com/webhooks/quirk', type: 'text' as const },
    ],
  },
  {
    title: 'Notifications',
    fields: [
      { label: 'Email on purchase complete', value: 'on', type: 'toggle' as const },
      { label: 'Email on new dataset available', value: 'on', type: 'toggle' as const },
      { label: 'Weekly usage summary', value: 'off', type: 'toggle' as const },
    ],
  },
];

function Toggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      style={{
        width: '36px',
        height: '20px',
        borderRadius: '10px',
        border: 'none',
        background: on ? 'rgba(255,255,255,0.3)' : 'var(--border)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      <div style={{
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: on ? '#fff' : 'var(--text-tertiary)',
        position: 'absolute',
        top: '2px',
        left: on ? '18px' : '2px',
        transition: 'left 0.15s',
      }} />
    </button>
  );
}

export default function SettingsPage() {
  return (
    <div style={{ padding: '32px', maxWidth: '640px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text)', margin: '0 0 4px' }}>Settings</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Manage your organization and preferences</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {SECTIONS.map((section) => (
          <div
            key={section.title}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', margin: '0 0 16px' }}>
              {section.title}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {section.fields.map((field) => (
                <div
                  key={field.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {field.label}
                  </label>
                  {field.type === 'toggle' ? (
                    <Toggle defaultOn={field.value === 'on'} />
                  ) : (
                    <input
                      defaultValue={field.value}
                      readOnly={field.type === 'readonly'}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: field.type === 'readonly' ? 'transparent' : 'var(--surface-elevated)',
                        color: field.type === 'readonly' ? 'var(--text-tertiary)' : 'var(--text)',
                        fontSize: '13px',
                        width: '260px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button style={{
          padding: '11px',
          background: '#fff',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          alignSelf: 'flex-start',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
