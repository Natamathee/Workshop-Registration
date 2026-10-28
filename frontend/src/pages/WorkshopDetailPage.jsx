import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function WorkshopDetailPage() {
  const { id } = useParams(); const { user } = useAuth(); const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [registering, setRegistering] = useState(false); const [message, setMessage] = useState(''); const [myRegistration, setMyRegistration] = useState(null); const [confirmCancel, setConfirmCancel] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true); setError(''); setMyRegistration(null);
      try {
        const res = await api.get(`/workshops/${id}`);
        if (cancelled) return;
        setWorkshop(res.data.data);
        if (user?.role === 'member') {
          try {
            const registrations = await api.get('/registrations');
            if (!cancelled) {
              const match = registrations.data.data.find((item) => (item.workshop?._id || item.workshop) === id);
              setMyRegistration(match || null);
            }
          } catch { /* Keep workshop browsing available if the registration list cannot be loaded. */ }
        }
      } catch (err) { if (!cancelled) setError(err.response?.data?.error || 'Workshop not found'); }
      finally { if (!cancelled) setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, [id, user]);
  const handleRegister = async () => { setRegistering(true); setMessage(''); try { const res = await api.post('/registrations', { workshop: id }); setMyRegistration(res.data.data); setWorkshop((current) => ({ ...current, registrationCount: (current.registrationCount ?? 0) + 1 })); setMessage('You’re on the list! Your registration is confirmed.'); } catch (err) { setMessage(err.response?.data?.error || 'Registration failed'); } finally { setRegistering(false); } };
  const handleCancel = async () => {
    if (!myRegistration?._id) return;
    setRegistering(true); setMessage('');
    try {
      await api.delete(`/registrations/${myRegistration._id}`);
      setMyRegistration(null); setConfirmCancel(false);
      setWorkshop((current) => ({ ...current, registrationCount: Math.max(0, (current.registrationCount ?? 0) - 1) }));
      setMessage('Your registration was cancelled.');
    } catch (err) { setMessage(err.response?.data?.error || 'Could not cancel registration.'); }
    finally { setRegistering(false); }
  };
  if (loading) return <p className="mx-auto max-w-7xl px-5 py-20 text-center text-[#819087]">Loading workshop…</p>;
  if (error) return <div className="mx-auto max-w-3xl px-5 py-20 text-center"><p className="text-red-700">{error}</p><Link to="/workshops" className="mt-4 inline-block text-[#315c45]">Back to workshops</Link></div>;
  const date = new Date(workshop.workshopDate); const full = Number(workshop.registrationCount ?? 0) >= Number(workshop.capacity);
  return <div className="mx-auto max-w-7xl px-5 pb-20 pt-7 lg:px-8"><button onClick={() => navigate(-1)} className="mb-6 text-sm font-medium text-[#65796b]">← Back to workshops</button><div className="grid gap-8 lg:grid-cols-[1fr_360px]">
    <article className="overflow-hidden rounded-[2rem] border border-[#e4e9e1] bg-white"><div className="relative flex min-h-64 items-end overflow-hidden bg-[#e5eee1] p-8 sm:min-h-80 sm:p-12"><div className="absolute -right-4 -top-28 h-[28rem] w-[28rem] rounded-full border-[50px] border-white/30"/><div className="absolute right-28 top-12 h-40 w-40 rounded-full border border-white/70"/><div className="relative"><span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#4e6b56]">Workshop</span><h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-[-.04em] text-[#21392a] sm:text-5xl">{workshop.name}</h1></div></div><div className="p-7 sm:p-10"><p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#829186]">About this session</p><p className="mt-3 whitespace-pre-line text-base leading-8 text-[#526358]">{workshop.description}</p><div className="mt-9 grid gap-5 border-t border-[#edf0eb] pt-7 sm:grid-cols-2"><div><p className="text-xs uppercase tracking-widest text-[#96a197]">Your instructor</p><p className="mt-1 font-semibold text-[#293d30]">{workshop.instructor}</p></div><div><p className="text-xs uppercase tracking-widest text-[#96a197]">Where it happens</p><p className="mt-1 font-semibold text-[#293d30]">{workshop.location}</p></div></div></div></article>
    <aside className="h-fit rounded-[2rem] border border-[#e4e9e1] bg-white p-6 shadow-[0_12px_35px_rgba(34,57,42,.05)] sm:p-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#839187]">Save your seat</p><p className="mt-3 text-3xl font-semibold tracking-tight text-[#24392c]">{date.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'})}</p><p className="mt-1 text-sm text-[#738076]">{workshop.location}</p><div className="my-6 space-y-4 border-y border-[#edf0eb] py-5 text-sm"><div className="flex justify-between"><span className="text-[#7d8b80]">Instructor</span><strong className="text-[#364d3d]">{workshop.instructor}</strong></div><div className="flex justify-between"><span className="text-[#7d8b80]">Availability</span><strong className="text-[#364d3d]">{Math.max(0, Number(workshop.capacity)-(workshop.registrationCount ?? 0))} of {workshop.capacity} seats</strong></div></div>
      {message && <div role="status" className={`mb-4 rounded-2xl px-4 py-3 text-sm ${message.startsWith('You') ? 'bg-[#eaf3e9] text-[#315c45]' : message.startsWith('Your registration was cancelled') ? 'bg-[#f3f5f1] text-[#526358]' : 'bg-red-50 text-red-700'}`}>{message}</div>}
      {user?.role === 'member' ? (myRegistration ? <><button onClick={() => setConfirmCancel((value) => !value)} disabled={registering} className="w-full rounded-full border border-[#efd9d6] bg-[#fff8f6] px-5 py-3.5 text-sm font-semibold text-[#a5534a] transition hover:bg-[#fcebe8] disabled:opacity-50">{registering ? 'Updating registration…' : 'Cancel my registration'}</button>{confirmCancel && <div className="mt-3 rounded-2xl border border-[#f0dedb] bg-[#fff9f7] p-4"><p className="text-sm leading-5 text-[#74544e]">Cancel your seat for this workshop?</p><div className="mt-3 flex gap-2"><button onClick={handleCancel} disabled={registering} className="rounded-full bg-[#a5534a] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">Yes, cancel</button><button onClick={() => setConfirmCancel(false)} disabled={registering} className="rounded-full border border-[#e9d9d6] px-4 py-2 text-xs font-semibold text-[#755b55]">Keep my seat</button></div></div>}</> : <button onClick={handleRegister} disabled={registering || full} className="w-full rounded-full bg-[#1c4836] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#276044] disabled:cursor-not-allowed disabled:bg-[#aab8ad]">{registering ? 'Saving your seat…' : full ? 'Workshop is full' : 'Register for this workshop →'}</button>) : !user ? <Link to="/login" className="block rounded-full bg-[#1c4836] px-5 py-3.5 text-center text-sm font-semibold text-white no-underline hover:bg-[#276044]">Sign in to register →</Link> : <p className="rounded-2xl bg-[#f3f5f1] px-4 py-3 text-sm text-[#647368]">Admin preview · registrations are for members.</p>}
      <p className="mt-3 text-center text-xs leading-5 text-[#929c93]">Registration is subject to availability and the three-workshop limit.</p>
    </aside></div></div>;
}
