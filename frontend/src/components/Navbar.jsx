import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, LogOut, User, Map, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-blue-200">
              <Plane className="text-white w-5 h-5 -rotate-12 group-hover:rotate-0 transition-transform" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              Travel<span className="text-blue-600">oop</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all">Home</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="flex items-center space-x-6 pl-8 border-l border-slate-200">
                  <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-black text-slate-900">{user.name}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all">Sign In</Link>
                <Link to="/signup" className="btn btn-primary text-xs font-black uppercase tracking-widest py-3 px-8 shadow-xl shadow-blue-100">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile indicator or simple icon */}
          <div className="md:hidden">
             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <Map className="w-5 h-5 text-slate-400" />
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
