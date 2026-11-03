import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const categories = ['Technology', 'Design', 'Business', 'Creative', 'Wellness', 'Other'];
const startOfTodayUTC = () => new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`);
const formatDate = (value, options = { month: 'short', day: 'numeric' }) => new Date(value).toLocaleDateString('en-US', { ...options, timeZone: 'UTC' });

function MetricCard({ label, value, detail, icon, accent = 'green' }) {
  const tones = {
    green: 'bg-[#eaf2e8] text-[#376247]', blue: 'bg-[#e9f0f2] text-[#4e6d76]', sand: 'bg-[#f3eee4] text-[#887348]', coral: 'bg-[#f6eae5] text-[#a25f4e]',
  };
  return <article className="rounded-[1.5rem] border border-[#e4e9e1] bg-white p-5 shadow-[0_8px_25px_rgba(34,57,42,.035)] sm:p-6"><div className="flex items-start justify-between"><p className="text-sm font-medium text-[#738076]">{label}</p><span className={`grid h-10 w-10 place-items-center rounded-2xl text-lg ${tones[accent]}`}>{icon}</span></div><p className="mt-4 text-3xl font-semibold tracking-tight text-[#253a2d]">{value}</p><p className="mt-1 text-xs text-[#8a968d]">{detail}</p></article>;
}

export default function AdminDashboardPage() {
  const [workshops, setWorkshops] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true); else setLoading(true);
    setError('');
    try {
      const [workshopRes, registrationRes] = await Promise.all([api.get('/workshops'), api.get('/registrations')]);
      setWorkshops(workshopRes.data.data || []);
      setRegistrations(registrationRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load dashboard data. Please check the API connection.');
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const stats = useMemo(() => {
    const today = startOfTodayUTC();
    const upcoming = workshops.filter((item) => new Date(`${item.workshopDate.slice(0, 10)}T00:00:00.000Z`) >= today);
    const capacity = upcoming.reduce((sum, item) => sum + Number(item.capacity || 0), 0);
    const booked = upcoming.reduce((sum, item) => sum + Number(item.registrationCount || 0), 0);
    const activeIds = new Set(upcoming.map((item) => item._id));
    const uniqueMembers = new Set(registrations.filter((item) => activeIds.has(item.workshop?._id)).map((item) => item.user?._id).filter(Boolean));
    return { upcoming, capacity, booked, remaining: Math.max(0, capacity - booked), fill: capacity ? Math.round((booked / capacity) * 100) : 0, uniqueMembers: uniqueMembers.size };
  }, [workshops, registrations]);

  const monthly = useMemo(() => {
    const now = new Date();
    const buckets = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 1));
      const key = date.toISOString().slice(0, 7);
      return { key, label: date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }), count: 0 };
    });
    const lookup = new Map(buckets.map((item) => [item.key, item]));
    registrations.forEach((item) => {
      const key = item.createdAt?.slice(0, 7);
      if (lookup.has(key)) lookup.get(key).count += 1;
    });
    return buckets;
  }, [registrations]);

  const categoryStats = useMemo(() => categories.map((name) => ({
    name,
    count: stats.upcoming.filter((item) => (item.category || 'Other') === name).reduce((sum, item) => sum + Number(item.registrationCount || 0), 0),
    total: stats.upcoming.filter((item) => (item.category || 'Other') === name).length,
  })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)), [stats.upcoming]);

  const popularWorkshops = useMemo(() => [...stats.upcoming].sort((a, b) => (b.registrationCount || 0) - (a.registrationCount || 0)).slice(0, 4), [stats.upcoming]);
  const recentRegistrations = useMemo(() => [...registrations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5), [registrations]);
  const maxMonthly = Math.max(1, ...monthly.map((item) => item.count));
  const maxCategory = Math.max(1, ...categoryStats.map((item) => item.count));

  return <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
    <section className="relative mb-7 overflow-hidden rounded-[2rem] bg-[#1c4836] px-7 py-8 text-white sm:px-10 sm:py-10"><div className="absolute -right-12 -top-28 h-80 w-80 rounded-full border-[38px] border-white/[.06]"/><div className="absolute right-40 top-10 h-32 w-32 rounded-full border border-white/10"/><div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#c6dfb8]">GatherSpace · Admin studio</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Your workshop pulse.</h1><p className="mt-2 text-sm text-[#d2dfd5]">A clear view of what’s happening across your learning community.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => loadDashboard(true)} disabled={refreshing} className="rounded-full border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60">{refreshing ? 'Refreshing…' : '↻ Refresh'}</button><Link to="/workshops/new" className="rounded-full bg-[#d3e6c8] px-4 py-2.5 text-sm font-semibold text-[#214432] no-underline transition hover:bg-white">＋ New workshop</Link></div></div><p className="relative mt-6 text-xs text-[#c5d6ca]">Overview · {formatDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p></section>

    {error && <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}<button onClick={() => loadDashboard()} className="font-semibold underline">Try again</button></div>}
    {loading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((item)=><div key={item} className="h-36 animate-pulse rounded-3xl bg-[#e9eee7]" />)}</div> : <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Upcoming workshops" value={stats.upcoming.length} detail={`${workshops.length} active workshops in catalog`} icon="✳"/><MetricCard label="All registrations" value={registrations.length} detail={`${stats.uniqueMembers} members with upcoming seats`} icon="↗" accent="blue"/><MetricCard label="Seats available" value={stats.remaining} detail={`${stats.booked} of ${stats.capacity} upcoming seats booked`} icon="◌" accent="sand"/><MetricCard label="Capacity filled" value={`${stats.fill}%`} detail="Across upcoming workshops" icon="◔" accent="coral"/></div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.9fr]">
        <section className="rounded-[1.75rem] border border-[#e4e9e1] bg-white p-6 shadow-[0_8px_25px_rgba(34,57,42,.035)] sm:p-7"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#829186]">Momentum</p><h2 className="mt-1 text-xl font-semibold tracking-tight text-[#293b30]">Registration activity</h2></div><span className="rounded-full bg-[#edf3ec] px-3 py-1.5 text-xs font-semibold text-[#45644d]">Last 6 months</span></div><div className="mt-7 grid h-52 grid-cols-6 items-end gap-3 border-b border-[#e9eee7] pb-2 sm:gap-5">{monthly.map((item) => <div key={item.key} className="flex h-full flex-col items-center justify-end gap-2"><span className="text-[11px] font-semibold text-[#708074]">{item.count || ''}</span><div className="flex h-[75%] w-full items-end"><div title={`${item.count} registrations`} className={`w-full rounded-t-xl transition-all ${item.count ? 'bg-gradient-to-t from-[#2b6044] to-[#8eb58d]' : 'bg-[#f0f3ee]'}`} style={{ height: `${Math.max(item.count ? 12 : 5, (item.count / maxMonthly) * 100)}%` }}/></div><span className="text-[11px] font-medium text-[#8a968d]">{item.label}</span></div>)}</div><p className="mt-4 text-xs text-[#929c93]">New registration records created each month.</p></section>

        <section className="rounded-[1.75rem] border border-[#e4e9e1] bg-white p-6 shadow-[0_8px_25px_rgba(34,57,42,.035)] sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#829186]">What people love</p><h2 className="mt-1 text-xl font-semibold tracking-tight text-[#293b30]">By category</h2></div><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#f3eee4] text-[#887348]">◉</span></div><div className="mt-6 space-y-4">{categoryStats.map((item, index)=><div key={item.name}><div className="mb-1.5 flex items-center justify-between text-xs"><span className="font-semibold text-[#526358]">{item.name} <span className="font-normal text-[#99a39a]">· {item.total} {item.total === 1 ? 'workshop' : 'workshops'}</span></span><span className="font-semibold text-[#607167]">{item.count}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#eff2ed]"><div className={`h-full rounded-full ${['bg-[#477c59]','bg-[#789b77]','bg-[#a4b991]','bg-[#c1b17e]','bg-[#86a9ac]','bg-[#b4bcb1]'][index % 6]}`} style={{ width: `${(item.count / maxCategory) * 100}%` }}/></div></div>)}</div></section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[1.75rem] border border-[#e4e9e1] bg-white p-6 shadow-[0_8px_25px_rgba(34,57,42,.035)] sm:p-7"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#829186]">Seat watch</p><h2 className="mt-1 text-xl font-semibold tracking-tight text-[#293b30]">Popular upcoming workshops</h2></div><Link to="/workshops" className="text-xs font-semibold text-[#45644d] no-underline">View catalog →</Link></div>{popularWorkshops.length ? <div className="mt-5 space-y-4">{popularWorkshops.map((item)=>{const booked=Number(item.registrationCount||0);const percent=item.capacity?Math.min(100,Math.round(booked/Number(item.capacity)*100)):0;return <div key={item._id}><div className="mb-2 flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#33483a]">{item.name}</p><p className="mt-0.5 text-xs text-[#89958c]">{formatDate(item.workshopDate, { month:'short', day:'numeric', year:'numeric' })} · {item.category || 'Other'}</p></div><span className="shrink-0 text-xs font-semibold text-[#617267]">{booked}/{item.capacity}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#eff2ed]"><div className={`h-full rounded-full ${percent >= 85 ? 'bg-[#c47a5b]' : 'bg-[#5b8962]'}`} style={{width:`${percent}%`}}/></div></div>})}</div> : <p className="mt-6 rounded-2xl bg-[#f5f7f2] px-4 py-5 text-sm text-[#829086]">No upcoming workshops yet. Add one to get started.</p>}</section>

        <section className="rounded-[1.75rem] border border-[#e4e9e1] bg-white p-6 shadow-[0_8px_25px_rgba(34,57,42,.035)] sm:p-7"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#829186]">Just joined</p><h2 className="mt-1 text-xl font-semibold tracking-tight text-[#293b30]">Recent registrations</h2></div><Link to="/registrations" className="text-xs font-semibold text-[#45644d] no-underline">All registrations →</Link></div>{recentRegistrations.length ? <div className="mt-4 divide-y divide-[#edf0eb]">{recentRegistrations.map((item)=><Link key={item._id} to={`/registrations/${item._id}`} className="flex items-center gap-3 py-3 no-underline hover:bg-[#fbfcf8]"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eaf1e8] text-sm font-bold text-[#54745d]">{item.user?.name?.slice(0,1)?.toUpperCase() || '?'}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#405348]">{item.user?.name || 'Member'}</span><span className="block truncate text-xs text-[#8a968d]">{item.workshop?.name || 'Workshop removed'}</span></span><span className="shrink-0 text-[10px] text-[#9aa49b]">{formatDate(item.createdAt, { month:'short', day:'numeric' })}</span></Link>)}</div> : <p className="mt-6 rounded-2xl bg-[#f5f7f2] px-4 py-5 text-sm text-[#829086]">Registrations will appear here as members join.</p>}</section>
      </div>
    </>}
  </div>;
}
