import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Plane, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';
import authImg from '../assets/auth-illustration.png';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side: Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-50/50 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-lg text-center z-10">
          <img 
            src={authImg} 
            alt="Travel illustration" 
            className="w-full h-auto mb-12 drop-shadow-2xl animate-in slide-in-from-bottom-12 duration-1000"
          />
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Explore the world <br/> with <span className="text-blue-600">Traveloop</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Your personal AI-powered travel assistant for <br/> multi-city adventures and budget planning.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-200 rotate-3">
              <Plane className="w-8 h-8 text-white -rotate-12" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 mt-3 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center space-x-3 border border-red-100 animate-shake">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2 px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    className="input-field input-with-icon py-3.5"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2 px-1">Password</label>
                <PasswordInput 
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-500 font-bold group-hover:text-slate-700">Remember me</span>
              </label>
              <a href="#" className="text-sm font-black text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-4 text-lg font-black flex items-center justify-center space-x-3 shadow-xl shadow-blue-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-slate-500 font-bold">
              Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-blue-700 ml-1">Join Traveloop</Link>
            </p>
          </div>

          {/* Social Proof / Hackathon Badge */}
          <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-center lg:justify-start space-x-6">
            <div className="flex items-center space-x-2 grayscale opacity-40">
               <Sparkles className="w-5 h-5" />
               <span className="text-xs font-black uppercase tracking-widest">AI Enhanced</span>
            </div>
            <div className="flex items-center space-x-2 grayscale opacity-40">
               <CheckCircle2 className="w-5 h-5" />
               <span className="text-xs font-black uppercase tracking-widest">Hackathon Pro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
