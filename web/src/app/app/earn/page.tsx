'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchRoyalties, fetchRoyaltySummary } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

const PERIODS = ['All', 'This month', 'This week'] as const;

function isThisMonth(dateStr: string) {
  const d = new Date(dateStr);
  const n = new Date();
  return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
}

function isThisWeek(dateStr: string) {
  return Date.now() - new Date(dateStr).getTime() < 7 * 86400000;
}

export default function EarnPage() {
  const [events, setEvents] = useState<Array<Record<string, unknown>>>([]);
  const [summary, setSummary] = useState({ total_royalties: 0, total_uses: 0, this_month: 0, companies_count: 0 });
  const [period, setPeriod] = useState<typeof PERIODS[number]>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [eventsRes, summaryRes] = await Promise.allSettled([
          fetchRoyalties({ limit: 50 }),
          fetchRoyaltySummary(),
        ]);
        if (eventsRes.status === 'fulfilled') setEvents(eventsRes.value?.events || []);
        if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value);
      } catch {
        // API unavailable — empty state shown
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return events.filter(e => {
      if (period === 'This month') return isThisMonth(e.created_at as string);
      if (period === 'This week') return isThisWeek(e.created_at as string);
      return true;
    });
  }, [events, period]);

  if (loading) {
    return (
      <div className="py-5">
        <h1
          className="text-[28px] mb-5"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'rgba(255,255,255,0.8)' }}
        >
          earn
        </h1>
        <div className="mb-4 rounded-xl animate-pulse" style={{ height: 140, background: 'rgba(255,255,255,0.03)' }} />
        <div className="rounded-xl animate-pulse" style={{ height: 200, background: 'rgba(255,255,255,0.03)' }} />
      </div>
    );
  }

  return (
    <div className="pt-8 pb-5">
      <h1
        className="text-[28px] mb-12"
        style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'rgba(255,255,255,0.8)' }}
      >
        earn
      </h1>

      {/* Total royalties */}
      <div className="mb-12">
        <p
          className="text-[11px] tracking-[0.3em] uppercase mb-3"
          style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
        >
          total royalties
        </p>
        <p
          className="text-[42px] mb-6"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'rgba(255,255,255,0.8)' }}
        >
          {formatCurrency(summary.total_royalties)}
        </p>

        {/* Stats */}
        <div className="flex items-center">
          {[
            { label: 'times used', value: String(summary.total_uses) },
            { label: 'companies', value: String(summary.companies_count) },
            { label: 'this month', value: formatCurrency(summary.this_month) },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              {i > 0 && (
                <span className="mx-3 text-[13px]" style={{ color: 'rgba(255,255,255,0.08)' }}>·</span>
              )}
              <span
                className="text-[14px]"
                style={{ color: 'var(--color-olive)', fontFamily: 'var(--font-serif)', fontWeight: 400 }}
              >
                {stat.value}
              </span>
              <span
                className="text-[12px] ml-2"
                style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Period filters */}
      <div className="flex gap-4 mb-10">
        {PERIODS.map(p => {
          const active = period === p;
          return (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="bg-transparent border-none cursor-pointer p-0 text-[13px]"
              style={{
                color: active ? 'var(--color-olive)' : 'rgba(255,255,255,0.2)',
                fontWeight: active ? 400 : 300,
                fontFamily: 'var(--font-sans)',
              }}
            >
              {p.toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* Events list */}
      <div>
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p
              className="text-[16px] mb-2"
              style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-serif)', fontWeight: 300 }}
            >
              no royalties yet
            </p>
            <p
              className="text-[13px] leading-[1.8]"
              style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
            >
              your royalties will appear here when companies use your data
            </p>
          </div>
        ) : (
          filtered.map((event, i) => (
            <div
              key={event.id as string}
              className="flex justify-between items-center py-4"
              style={{ borderBottom: i === filtered.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}
            >
              <div>
                <div
                  className="text-[14px]"
                  style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-serif)', fontWeight: 400 }}
                >
                  {event.dataset_name as string || 'Royalty payment'}
                </div>
                <div
                  className="text-[12px] mt-1"
                  style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
                >
                  {new Date(event.created_at as string).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </div>
              </div>
              <span
                className="text-[14px]"
                style={{ color: 'var(--color-olive)', fontFamily: 'var(--font-serif)', fontWeight: 400 }}
              >
                +{formatCurrency(event.amount as number)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
