import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Plane, Loader2, Globe, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';
import authImg from '../assets/auth-illustration.png';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 order-2 lg:order-1">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-teal-100 rotate-3">
              <Plane className="w-8 h-8 text-white -rotate-12" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-3 font-medium">Join 5,000+ travelers planning their next trip.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center space-x-3 border border-red-100">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2 px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="input-field input-with-icon py-3.5"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2 px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="input-field input-with-icon py-3.5"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2 px-1">Create Password</label>
                <PasswordInput 
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-[11px] text-slate-500 font-bold leading-relaxed">
              By signing up, you agree to our <a href="#" className="text-blue-600">Terms of Service</a> and <a href="#" className="text-blue-600">Privacy Policy</a>.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-4 text-lg font-black flex items-center justify-center space-x-3 shadow-xl shadow-blue-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Sign Up Free</span>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-slate-500 font-bold">
              Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 ml-1">Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Left Side: Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-teal-50/30 items-center justify-center p-12 relative overflow-hidden order-1 lg:order-2">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-80 h-80 bg-teal-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-lg text-center z-10">
          <img 
            src={authImg} 
            alt="Travel illustration" 
            className="w-full h-auto mb-12 drop-shadow-2xl animate-in slide-in-from-top-12 duration-1000"
          />
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Start your next <br/> <span className="text-teal-600">adventure</span> today
          </h1>
          <div className="flex flex-col space-y-4 items-center">
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur px-6 py-3 rounded-2xl shadow-sm">
              <Globe className="w-5 h-5 text-blue-500" />
              <span className="text-slate-700 font-black text-sm uppercase tracking-wider">Multi-City Routes</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur px-6 py-3 rounded-2xl shadow-sm">
              <ShieldCheck className="w-5 h-5 text-teal-500" />
              <span className="text-slate-700 font-black text-sm uppercase tracking-wider">Smart Packing Checklists</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
