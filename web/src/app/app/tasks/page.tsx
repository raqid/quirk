'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchTasks, fetchTaskCategories } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

const TYPE_FILTERS = [
  { key: 'all', label: 'all' },
  { key: 'photo', label: 'photo' },
  { key: 'video', label: 'video' },
  { key: 'audio', label: 'audio' },
] as const;

export default function TasksPage() {
  const [tasks, setTasks] = useState<Array<Record<string, unknown>>>([]);
  const [categories, setCategories] = useState<Array<{ category: string; count: number }>>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const params: Record<string, string | number> = { limit: 50 };
    if (typeFilter !== 'all') params.type = typeFilter;
    if (catFilter) params.category = catFilter;

    try {
      const [tasksRes, catsRes] = await Promise.allSettled([
        fetchTasks(params),
        fetchTaskCategories(),
      ]);
      if (tasksRes.status === 'fulfilled') setTasks(tasksRes.value?.tasks || []);
      if (catsRes.status === 'fulfilled') setCategories(catsRes.value?.categories || []);
    } catch {
      // API unavailable — empty state shown
    }
  }, [typeFilter, catFilter]);

  useEffect(() => { loadData().finally(() => setLoading(false)); }, [loadData]);

  const filtered = useMemo(() => {
    if (!search.trim()) return tasks;
    const q = search.toLowerCase();
    return tasks.filter(t =>
      (t.title as string || '').toLowerCase().includes(q) ||
      (t.category as string || '').toLowerCase().includes(q)
    );
  }, [tasks, search]);

  const hotTasks = filtered.filter(t => t.is_hot);
  const normalTasks = filtered.filter(t => !t.is_hot);

  if (loading) {
    return (
      <div className="py-5">
        <h1
          className="text-[28px] mb-5"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'rgba(255,255,255,0.8)' }}
        >
          tasks
        </h1>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="mb-3 rounded-xl animate-pulse"
            style={{ height: 100, background: 'rgba(255,255,255,0.03)' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="pt-8 pb-5">
      <h1
        className="text-[28px] mb-8"
        style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'rgba(255,255,255,0.8)' }}
      >
        tasks
      </h1>

      {/* Search */}
      <div
        className="flex items-center gap-2 mb-6 pb-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="text-[14px]" style={{ color: 'rgba(255,255,255,0.15)' }}>&#x2315;</span>
        <input
          type="text"
          placeholder="search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-[14px]"
          style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="bg-transparent border-none cursor-pointer p-0"
          >
            <span className="text-[14px]" style={{ color: 'rgba(255,255,255,0.2)' }}>&times;</span>
          </button>
        )}
      </div>

      {/* Type filters */}
      <div className="flex gap-4 mb-4">
        {TYPE_FILTERS.map(f => {
          const active = typeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => { setTypeFilter(f.key); setCatFilter(''); }}
              className="bg-transparent border-none cursor-pointer p-0 text-[13px]"
              style={{
                color: active ? 'var(--color-olive)' : 'rgba(255,255,255,0.2)',
                fontWeight: active ? 400 : 300,
                fontFamily: 'var(--font-sans)',
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex gap-4 mb-10 flex-wrap">
          <button
            onClick={() => setCatFilter('')}
            className="bg-transparent border-none cursor-pointer p-0 text-[12px]"
            style={{
              color: !catFilter ? 'var(--color-olive)' : 'rgba(255,255,255,0.2)',
              fontWeight: !catFilter ? 400 : 300,
              fontFamily: 'var(--font-sans)',
            }}
          >
            all topics
          </button>
          {categories.map(c => (
            <button
              key={c.category}
              onClick={() => setCatFilter(catFilter === c.category ? '' : c.category)}
              className="bg-transparent border-none cursor-pointer p-0 text-[12px]"
              style={{
                color: catFilter === c.category ? 'var(--color-olive)' : 'rgba(255,255,255,0.2)',
                fontWeight: catFilter === c.category ? 400 : 300,
                fontFamily: 'var(--font-sans)',
              }}
            >
              {c.category}
              <span className="ml-1" style={{ color: 'rgba(255,255,255,0.1)' }}>{c.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Hot tasks */}
      {hotTasks.length > 0 && !search && (
        <div className="mb-12">
          <div className="flex justify-between items-baseline mb-4">
            <h2
              className="text-[11px] tracking-[0.3em] uppercase"
              style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
            >
              hot right now
            </h2>
            <span
              className="text-[12px]"
              style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
            >
              high pay, limited spots
            </span>
          </div>
          {hotTasks.map((task, i) => (
            <TaskRow key={task.id as string} task={task} isLast={i === hotTasks.length - 1} />
          ))}
        </div>
      )}

      {/* Normal tasks */}
      {normalTasks.length > 0 && (
        <div>
          {hotTasks.length > 0 && !search && (
            <h3
              className="text-[11px] tracking-[0.3em] uppercase mb-4"
              style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
            >
              all tasks
            </h3>
          )}
          {normalTasks.map((task, i) => (
            <TaskRow key={task.id as string} task={task} isLast={i === normalTasks.length - 1} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p
            className="text-[16px] mb-2"
            style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-serif)', fontWeight: 300 }}
          >
            no tasks found
          </p>
          <p
            className="text-[13px]"
            style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
          >
            try a different filter or check back soon
          </p>
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, isLast }: { task: Record<string, unknown>; isLast: boolean }) {
  const payPerSubmission = Number(task.pay_per_submission || 0);
  const royaltyRate = Number(task.royalty_rate || 0);
  const submitted = Number(task.submitted_count || 0);
  const quantity = Number(task.quantity_needed || 0);

  return (
    <div
      className="py-4"
      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex justify-between items-baseline mb-2">
        <div className="flex items-center gap-3 flex-1">
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

      <p
        className="text-[13px] leading-[1.7] mb-2"
        style={{ color: 'rgba(255,255,255,0.3)', maxHeight: 40, overflow: 'hidden', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
      >
        {String(task.description || '')}
      </p>

      <div className="flex items-center gap-3">
        {quantity > 0 && (
          <span
            className="text-[12px]"
            style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
          >
            {submitted} / {quantity}
          </span>
        )}
        {typeof task.type === 'string' && (
          <span
            className="text-[11px] capitalize"
            style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
          >
            {task.type}
          </span>
        )}
        {typeof task.category === 'string' && (
          <span
            className="text-[11px]"
            style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
          >
            {task.category}
          </span>
        )}
      </div>
    </div>
  );
}
