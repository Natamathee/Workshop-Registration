import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-[#e6eae3] bg-[#fbfcf8]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/workshops" className="flex items-center gap-3 text-[#1d3329] no-underline">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1c4836] text-lg text-white shadow-md shadow-[#1c4836]/15">✳</span>
          <span className="text-[15px] font-bold tracking-tight">Gather<span className="text-[#6f927c]">space</span><span className="ml-2 hidden text-[10px] font-medium uppercase tracking-[.18em] text-[#839187] sm:inline">Workshop studio</span></span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <Link to="/workshops" className="text-sm font-medium text-[#607167] no-underline hover:text-[#1c4836]">
            Workshops
          </Link>

          {user ? (
            <>
              <Link to="/registrations" className="text-sm font-medium text-[#607167] no-underline hover:text-[#1c4836]">
                My Registrations
              </Link>
              <span className="hidden items-center gap-2 text-sm text-[#607167] sm:flex">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e6efe7] text-xs font-bold text-[#315c45]">{user.name?.slice(0,1)?.toUpperCase()}</span>
                <span>{user.name}<small className="ml-2 rounded-full bg-[#e9eee8] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#607167]">{user.role}</small></span>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-[#e0e6de] px-4 py-2 text-sm font-medium text-[#52645a] transition hover:border-[#c7d4c8] hover:bg-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-[#607167] no-underline hover:text-[#1c4836]">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-[#1c4836] px-5 py-2.5 text-sm font-semibold text-white no-underline shadow-sm hover:-translate-y-0.5 hover:bg-[#276044]"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
