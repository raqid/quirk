'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/auth';
import { fetchProfileStats, fetchPortfolio, fetchTasks, fetchRoyalties } from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import EarningsChart from '@/components/app/EarningsChart';
import TierProgress from '@/components/app/TierProgress';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildLast7Days(royaltyEvents: Array<Record<string, unknown>>) {
  const now = new Date();
  const bars = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() - (6 - i) * 86400000);
    return { day: DAYS[d.getDay()], date: d.toISOString().split('T')[0], amount: 0 };
  });
  for (const ev of royaltyEvents) {
    const date = new Date(ev.created_at as string).toISOString().split('T')[0];
    const bar = bars.find((b) => b.date === date);
    if (bar) bar.amount += Number(ev.amount || 0);
  }
  return bars;
}

const EMPTY_STATS = { total_uploads: 0, total_earned: 0, total_referrals: 0, streak_days: 0, tier: 'bronze', next_tier: 'silver', tier_progress: 0, next_tier_uploads: 10 };
const EMPTY_PORTFOLIO = { total_earned: 0, royalties_this_month: 0, royalties_last_month: 0, trend_percent: 0, trend_direction: 'up', photos: { count: 0 }, videos: { count: 0 }, audio: { count: 0 } };

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(EMPTY_STATS);
  const [portfolio, setPortfolio] = useState(EMPTY_PORTFOLIO);
  const [tasks, setTasks] = useState<Array<Record<string, unknown>>>([]);
  const [royalties, setRoyalties] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  const last7Days = useMemo(() => buildLast7Days(royalties), [royalties]);

  useEffect(() => {
    async function load() {
      try {
        const [statsR, portR, tasksR, royR] = await Promise.allSettled([
          fetchProfileStats(),
          fetchPortfolio(),
          fetchTasks({ status: 'active', limit: '3' }),
          fetchRoyalties({ limit: '50' }),
        ]);
        if (statsR.status === 'fulfilled') setStats(statsR.value || EMPTY_STATS);
        if (portR.status === 'fulfilled') setPortfolio(portR.value || EMPTY_PORTFOLIO);
        if (tasksR.status === 'fulfilled') setTasks((tasksR.value as { tasks: Array<Record<string, unknown>> })?.tasks || []);
        if (royR.status === 'fulfilled') setRoyalties((royR.value as { events: Array<Record<string, unknown>> })?.events || []);
      } catch {
        // API unavailable — pages will show empty states
      }
      setLoading(false);
    }
    load();
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'good morning';
    if (h < 18) return 'good afternoon';
    return 'good evening';
  })();

  const firstName = user?.display_name?.split(' ')[0] || 'there';
  const trendUp = portfolio.trend_direction === 'up';

  if (loading) {
    return (
      <div className="py-5">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="mb-4 rounded-xl animate-pulse"
            style={{ height: i === 1 ? 200 : 80, background: 'rgba(255,255,255,0.03)' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="pt-8 pb-5">
      {/* Greeting */}
      <div className="mb-16">
        <p
          className="text-[12px] tracking-[0.15em] mb-2"
          style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
        >
          {greeting},
        </p>
        <h1
          className="text-[36px]"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'rgba(255,255,255,0.8)' }}
        >
          {firstName}
        </h1>
      </div>

      {/* Total earned */}
      <div className="mb-12">
        <p
          className="text-[11px] tracking-[0.3em] uppercase mb-3"
          style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
        >
          total earned
        </p>
        <div className="flex items-baseline gap-4">
          <span
            className="text-[42px]"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'rgba(255,255,255,0.8)' }}
          >
            {formatCurrency(stats.total_earned)}
          </span>
          <span
            className="text-[13px]"
            style={{
              color: trendUp ? 'var(--color-olive)' : 'rgba(255,255,255,0.25)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 300,
            }}
          >
            {trendUp ? '↑' : '↓'} {portfolio.trend_percent}%
          </span>
          {stats.streak_days > 0 && (
            <span
              className="text-[13px]"
              style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
            >
              · {stats.streak_days} day streak
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="mb-12">
        <EarningsChart data={last7Days} />
      </div>

      {/* Stats row */}
      <div
        className="flex items-center gap-8 mb-12 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        {[
          { label: 'this month', value: formatCurrency(portfolio.royalties_this_month) },
          { label: 'uploads', value: String(stats.total_uploads) },
          { label: 'referrals', value: String(stats.total_referrals) },
        ].map((stat, i) => (
          <div key={stat.label} className="flex items-center">
            {i > 0 && (
              <span className="text-[14px]" style={{ color: 'rgba(255,255,255,0.08)' }}>|</span>
            )}
            <div className={i > 0 ? 'ml-8' : ''}>
              <span
                className="text-[15px]"
                style={{ color: 'var(--color-olive)', fontFamily: 'var(--font-serif)', fontWeight: 400 }}
              >
                {stat.value}
              </span>
              <span
                className="text-[12px]"
                style={{ color: 'rgba(255,255,255,0.2)', marginLeft: 10, fontFamily: 'var(--font-sans)', fontWeight: 300 }}
              >
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tier progress */}
      <div className="mb-16">
        <TierProgress
          tier={stats.tier}
          nextTier={stats.next_tier}
          progress={stats.tier_progress}
          uploadsNeeded={
            stats.next_tier_uploads != null
              ? Math.max(0, stats.next_tier_uploads - stats.total_uploads)
              : null
          }
        />
      </div>

      {/* Tasks */}
      {tasks.length > 0 && (
        <div className="mb-16">
          <div className="flex justify-between items-baseline mb-6">
            <h2
              className="text-[11px] tracking-[0.3em] uppercase"
              style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
            >
              top tasks
            </h2>
            <a
              href="/app/tasks"
              className="text-[13px] no-underline"
              style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
            >
              see all
            </a>
          </div>
          <div>
            {tasks.map((task, i) => (
              <TaskRow key={task.id as string} task={task} isLast={i === tasks.length - 1} />
            ))}
          </div>
        </div>
      )}

      {/* Recent royalties */}
      {royalties.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-baseline mb-6">
            <h2
              className="text-[11px] tracking-[0.3em] uppercase"
              style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
            >
              recent royalties
            </h2>
            <a
              href="/app/earn"
              className="text-[13px] no-underline"
              style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
            >
              see all
            </a>
          </div>
          <div>
            {royalties.slice(0, 5).map((ev, i) => (
              <RoyaltyRow key={ev.id as string} event={ev} isLast={i === Math.min(royalties.length, 5) - 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, isLast }: { task: Record<string, unknown>; isLast: boolean }) {
  const payPerSubmission = Number(task.pay_per_submission || 0);
  const royaltyRate = Number(task.royalty_rate || 0);

  return (
    <a
      href="/app/tasks"
      className="block no-underline py-4"
      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex justify-between items-baseline">
        <div className="flex items-center gap-3">
          {Boolean(task.is_hot) && (
            <span
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ color: 'var(--color-olive)', fontFamily: 'var(--font-sans)', fontWeight: 400 }}
            >
              hot
            </span>
          )}
          <span
            className="text-[15px]"
            style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-serif)', fontWeight: 400 }}
          >
            {String(task.title || '')}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-[14px]"
            style={{ color: 'var(--color-olive)', fontFamily: 'var(--font-serif)', fontWeight: 400 }}
          >
            {formatCurrency(payPerSubmission)}
          </span>
          {royaltyRate > 0 && (
            <span
              className="text-[12px]"
              style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
            >
              +{(royaltyRate * 100).toFixed(0)}%
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

function RoyaltyRow({ event, isLast }: { event: Record<string, unknown>; isLast: boolean }) {
  return (
    <div
      className="flex justify-between items-center py-3"
      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)' }}
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
          {new Date(event.created_at as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
      <span
        className="text-[14px]"
        style={{ color: 'var(--color-olive)', fontFamily: 'var(--font-serif)', fontWeight: 400 }}
      >
        +{formatCurrency(event.amount as number)}
      </span>
    </div>
  );
}
