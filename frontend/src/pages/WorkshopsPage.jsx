import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const dateLabel = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default function WorkshopsPage() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetchWorkshops = async (q = '') => {
    setLoading(true); setError('');
    try { const res = await api.get('/workshops', { params: q ? { search: q } : {} }); setWorkshops(res.data.data); }
    catch (err) { setError(err.response?.data?.error || 'Could not load workshops. Check that the API is running.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchWorkshops(); }, []);
  const handleSearch = (e) => { e.preventDefault(); fetchWorkshops(search.trim()); };
  const handleDelete = async (id) => {
    if (!confirm('Delete this workshop? Registrations will remain in history.')) return;
    try { await api.delete(`/workshops/${id}`); setWorkshops((prev) => prev.filter((w) => w._id !== id)); }
    catch (err) { setError(err.response?.data?.error || 'Could not delete this workshop.'); }
  };

  return <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
    <section className="relative mb-12 overflow-hidden rounded-[2rem] bg-[#1c4836] px-7 py-10 text-white sm:px-12 sm:py-14">
      <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full border border-white/10"/><div className="absolute -right-2 -top-10 h-52 w-52 rounded-full border border-white/10"/>
      <div className="relative max-w-2xl">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.18em] text-[#d8ead9]"><span className="h-1.5 w-1.5 rounded-full bg-[#b8d7a7]"/>Curated learning experiences</p>
        <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-.04em] sm:text-6xl">Make room for<br/><span className="font-serif italic font-normal text-[#c6dfb8]">what’s next.</span></h1>
        <p className="mt-5 max-w-lg text-sm leading-6 text-[#d2dfd5] sm:text-base">Small-group workshops led by people who love what they do. Find your next spark and learn alongside a curious community.</p>
        <form onSubmit={handleSearch} className="mt-8 flex max-w-xl gap-2 rounded-2xl bg-white p-2 shadow-xl shadow-[#102a1e]/20">
          <span className="grid w-11 shrink-0 place-items-center text-xl text-[#708477]">⌕</span><input aria-label="Search workshops" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Try a topic, instructor or place..." className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#21352a] outline-none placeholder:text-[#9aa79c]"/>
          <button className="rounded-xl bg-[#1c4836] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#276044]">Search</button>
        </form>
      </div>
      {user?.role === 'admin' && <Link to="/workshops/new" className="relative mt-5 inline-flex rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-white no-underline hover:bg-white/10">＋ Create a workshop</Link>}
    </section>
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="mb-1 text-[11px] font-bold uppercase tracking-[.2em] text-[#789080]">The calendar</p><h2 className="text-2xl font-semibold tracking-tight text-[#23372b] sm:text-3xl">Upcoming workshops</h2></div><p className="text-sm text-[#78857b]">{workshops.length} {workshops.length === 1 ? 'experience' : 'experiences'}</p></div>
    {error && <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}<button onClick={() => fetchWorkshops(search)} className="ml-3 font-semibold underline">Try again</button></div>}
    {loading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map((i)=><div key={i} className="h-72 animate-pulse rounded-3xl bg-[#e9eee7]"/> )}</div> : workshops.length === 0 ? <div className="rounded-3xl border border-dashed border-[#d4ddd3] bg-white/70 px-6 py-16 text-center"><span className="text-4xl">✳</span><h3 className="mt-4 text-lg font-semibold text-[#293b30]">No workshops found</h3><p className="mt-2 text-sm text-[#77857a]">Try a different search or check back soon for new sessions.</p>{search && <button onClick={()=>{setSearch('');fetchWorkshops();}} className="mt-5 rounded-full bg-[#e8efe7] px-4 py-2 text-sm font-semibold text-[#315c45]">Clear search</button>}</div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{workshops.map((w, i)=>{
      const count = w.registrationCount ?? 0; const spots = Math.max(0, Number(w.capacity)-Number(count));
      return <article key={w._id} className="group overflow-hidden rounded-3xl border border-[#e5eae2] bg-white shadow-[0_8px_25px_rgba(34,57,42,.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(34,57,42,.1)]">
        <div className={`relative flex h-36 items-end overflow-hidden p-5 ${['bg-[#e5eee1]','bg-[#eee8dc]','bg-[#e4ebed]'][i%3]}`}><div className="absolute -right-5 -top-10 h-40 w-40 rounded-full border-[22px] border-white/30"/><div className="absolute right-10 top-5 h-20 w-20 rounded-full border border-white/70"/><span className="relative rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#486552] backdrop-blur">{dateLabel(w.workshopDate)}</span><span className="absolute right-5 top-5 text-3xl text-[#476750]/50">✳</span></div>
        <div className="p-5"><div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#7c8a7f]"><span className="text-[#63826b]">◉</span>{w.instructor}</div><h3 className="line-clamp-2 min-h-[3.5rem] text-xl font-semibold leading-7 tracking-tight text-[#263a2d]">{w.name}</h3><p className="mt-2 flex items-center gap-2 text-sm text-[#738076]"><span>⌖</span>{w.location}</p><div className="mt-5 flex items-center justify-between border-t border-[#edf0eb] pt-4"><div className="text-xs text-[#829086]"><strong className="text-[#425f4b]">{spots}</strong> spots left <span className="mx-1">·</span> {w.capacity} seats</div><Link to={`/workshops/${w._id}`} className="rounded-full bg-[#edf3ec] px-4 py-2 text-sm font-semibold text-[#315a42] no-underline group-hover:bg-[#1c4836] group-hover:text-white">Explore →</Link></div>
        {user?.role === 'admin' && <div className="mt-3 flex gap-4 text-xs"><Link className="text-[#8a7352] no-underline" to={`/workshops/${w._id}/edit`}>Edit workshop</Link><button onClick={()=>handleDelete(w._id)} className="text-red-600">Delete</button></div>}</div></article>;
    })}</div>}
    <footer className="mt-16 border-t border-[#e1e7df] pt-6 text-center text-xs text-[#98a198]">Gatherspace · Learn something worth sharing</footer>
  </div>;
}
