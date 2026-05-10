import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plane, Calendar, Type, FileText, Image as ImageIcon, ArrowLeft, Loader2, Sparkles, MapPin } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const CreateTripPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    coverImage: '',
    destination: '',
    theme: 'Adventure',
    currency: 'INR'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/trips', formData);
      toast.success('Trip created! Start adding stops.');
      navigate(`/trip/${response.data._id}`);
    } catch (error) {
      console.error('Error creating trip:', error);
      toast.error('Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans">
      <Link 
        to="/dashboard"
        className="flex items-center text-slate-500 hover:text-blue-600 transition-all mb-10 group w-fit"
      >
        <ArrowLeft className="w-5 h-5 mr-3 transform group-hover:-translate-x-1 transition-transform" />
        <span className="font-black uppercase tracking-widest text-xs">Back to Dashboard</span>
      </Link>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 px-10 py-16 text-white relative overflow-hidden">
          <Plane className="absolute -top-10 -right-10 w-64 h-64 opacity-5 rotate-12" />
          <div className="relative z-10 max-w-lg">
             <div className="inline-flex items-center gap-2 bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                <Sparkles className="w-3 h-3" />
                <span>New Loop</span>
             </div>
             <h1 className="text-5xl font-black tracking-tight leading-none mb-4">Plan your next adventure.</h1>
             <p className="text-slate-400 text-lg font-medium">Create a custom itinerary or generate one with AI in the next step.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1">Trip Title</label>
              <div className="relative">
                 <Type className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                 <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Kyoto Cherry Blossoms 2026"
                  className="input-field pl-14 py-4 text-xl font-black tracking-tight"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1">Main Destination</label>
              <div className="relative">
                 <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                 <input
                  type="text"
                  name="destination"
                  required
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g. Japan"
                  className="input-field pl-14 py-4"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1">Travel Theme</label>
              <select 
                name="theme"
                className="input-field py-4 font-bold appearance-none"
                value={formData.theme}
                onChange={handleChange}
              >
                {['Adventure', 'Luxury', 'Honeymoon', 'Family', 'Backpacking', 'Other'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1">Start Date</label>
              <div className="relative">
                 <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                 <input
                  type="date"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="input-field pl-14 py-4"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1">End Date</label>
              <div className="relative">
                 <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                 <input
                  type="date"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  className="input-field pl-14 py-4"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1">Cover Image URL (Unsplash recommended)</label>
              <div className="relative">
                 <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                 <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="input-field pl-14 py-4"
                />
              </div>
            </div>
          </div>

          <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-50">
            <p className="text-slate-400 text-sm font-medium">You can customize all these details later in your dashboard.</p>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary px-12 py-5 text-lg flex items-center space-x-3 w-full md:w-auto shadow-2xl shadow-blue-200"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span className="font-black">Create Trip Itinerary</span>
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTripPage;
