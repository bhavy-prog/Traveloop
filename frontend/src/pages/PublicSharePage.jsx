import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, DollarSign, Plane, Loader2, Globe, 
  Copy, Share2, X, MessageCircle, Send, CheckCircle2
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const PublicSharePage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    const fetchSharedTrip = async () => {
      try {
        const response = await api.get(`/trips/${tripId}`);
        setTrip(response.data);
      } catch (error) {
        console.error('Error fetching shared trip:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSharedTrip();
  }, [tripId]);

  const handleDuplicate = async () => {
    if (!user) {
      toast.error('Please login to copy this trip');
      navigate('/login');
      return;
    }

    setCopying(true);
    try {
      const res = await api.post(`/trips/duplicate/${tripId}`);
      toast.success('Trip copied to your dashboard!');
      navigate(`/trip/${res.data._id}`);
    } catch (err) {
      toast.error('Failed to copy trip');
    } finally {
      setCopying(false);
    }
  };

  const shareSocial = (platform) => {
    const url = window.location.href;
    const text = `Check out this amazing trip itinerary for ${trip.title} on Traveloop!`;
    
    let shareUrl = '';
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    if (platform === 'whatsapp') shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    if (platform === 'telegram') shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-slate-500 font-bold">Opening shared loop...</p>
    </div>
  );

  if (!trip) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center card p-12">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Globe className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Trip Not Found</h1>
        <p className="text-slate-500 font-medium mb-8">The trip you are looking for might have been deleted, is private, or the link is invalid.</p>
        <Link to="/" className="btn btn-primary inline-block w-full">Back to Home</Link>
      </div>
    </div>
  );

  const calculateTotal = () => {
    let total = 0;
    trip.stops.forEach(stop => {
      stop.activities.forEach(activity => {
        total += activity.cost || 0;
      });
    });
    return total;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      {/* Mini Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
              <Plane className="text-white w-5 h-5 -rotate-12 group-hover:rotate-0 transition-transform" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">Traveloop</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center text-[10px] font-black text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-teal-100">
              <Globe className="w-3 h-3 mr-2" />
              <span>Shared Itinerary</span>
            </div>
            {user ? (
              <button 
                onClick={handleDuplicate}
                disabled={copying}
                className="btn btn-primary py-2 px-5 text-sm flex items-center gap-2"
              >
                {copying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                <span>Copy Trip</span>
              </button>
            ) : (
              <Link to="/login" className="btn btn-outline py-2 px-5 text-sm">Sign In to Copy</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-24">
        {/* Hero Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="relative h-[450px]">
            <img 
              src={trip.coverImage || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200"} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white">
              <div className="flex items-center space-x-3 mb-6">
                <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500 shadow-lg shadow-blue-900/20">
                  {trip.theme || 'Adventure'}
                </span>
                <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                  {trip.destination || 'Multiple Cities'}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-none">{trip.title}</h1>
              <div className="flex flex-wrap gap-8 text-sm font-bold text-white/80">
                <span className="flex items-center"><Calendar className="w-5 h-5 mr-3 text-blue-400" /> {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center"><MapPin className="w-5 h-5 mr-3 text-blue-400" /> {trip.stops.length} Major Stops</span>
                <span className="flex items-center"><DollarSign className="w-5 h-5 mr-3 text-teal-400" /> ₹ {new Intl.NumberFormat('en-IN').format(calculateTotal())}</span>
              </div>
            </div>
          </div>
          <div className="p-10 bg-slate-50/50">
             <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                <div className="max-w-xl">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Trip Overview</h3>
                   <p className="text-slate-600 leading-relaxed font-medium text-lg">
                     {trip.description || "This is a curated travel itinerary designed with Traveloop Pro. Explore the timeline below to see all stops and activities."}
                   </p>
                </div>
                <div className="shrink-0 w-full md:w-auto">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Share this loop</h3>
                   <div className="flex gap-3">
                      <button onClick={() => shareSocial('twitter')} className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-400 hover:border-blue-200 transition-all"><X className="w-5 h-5" /></button>
                      <button onClick={() => shareSocial('whatsapp')} className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-teal-500 hover:border-teal-200 transition-all"><MessageCircle className="w-5 h-5" /></button>
                      <button onClick={() => shareSocial('telegram')} className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-500 hover:border-blue-200 transition-all"><Send className="w-5 h-5" /></button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success('Link copied!');
                        }}
                        className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Timeline Itinerary */}
        <div className="mb-12">
           <h2 className="text-4xl font-black text-slate-900 mb-12 px-4 tracking-tight flex items-center">
             <Calendar className="w-10 h-10 mr-4 text-blue-600" />
             Daily Itinerary
           </h2>
           <div className="space-y-4 relative ml-4">
              {trip.stops.map((stop, sIdx) => (
                <div key={sIdx} className="relative pl-16 timeline-item group">
                  <div className="absolute left-0 top-0 w-14 h-14 bg-white border-4 border-slate-50 rounded-2xl shadow-sm flex items-center justify-center z-10">
                    <div className="flex flex-col items-center">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Day</span>
                       <span className="text-lg font-black text-blue-600 leading-none">{sIdx + 1}</span>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm mb-8">
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stop.city}</h3>
                          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{new Date(stop.arrivalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                       </div>
                    </div>

                    {stop.notes && (
                      <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 mb-6 italic text-slate-600 text-sm font-medium">
                        "{stop.notes}"
                      </div>
                    )}

                    <div className="space-y-3">
                      {stop.activities.map((activity, aIdx) => (
                        <div key={aIdx} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-blue-500 shadow-sm border border-slate-50 uppercase">
                              {activity.category ? activity.category.substring(0, 2) : 'OT'}
                            </div>
                            <div>
                              <p className="text-base font-bold text-slate-800 leading-tight">{activity.title}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mt-1">{activity.category}</p>
                            </div>
                          </div>
                          <span className="text-base font-black text-slate-900">₹ {new Intl.NumberFormat('en-IN').format(activity.cost)}</span>
                        </div>
                      ))}
                      {stop.activities.length === 0 && (
                        <p className="text-sm text-slate-400 italic font-medium py-4 text-center border-2 border-dashed border-slate-100 rounded-2xl">Rest day / Flexible activities</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* CTA Footer */}
        <div className="card p-12 bg-slate-900 text-white text-center shadow-2xl shadow-slate-300">
           <h2 className="text-3xl font-black mb-4 tracking-tight">Plan your own adventure?</h2>
           <p className="text-slate-400 font-medium mb-10 max-w-lg mx-auto">Traveloop is the ultimate AI travel planner. Copy this trip to start customizing it, or build a new loop from scratch.</p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleDuplicate}
                disabled={copying}
                className="btn btn-primary px-10 py-4 flex items-center justify-center gap-3"
              >
                {copying ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                <span>{user ? 'Copy to My Dashboard' : 'Sign Up to Copy'}</span>
              </button>
              <Link to="/" className="btn bg-white/10 hover:bg-white/20 text-white px-10 py-4">Explore More Trips</Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PublicSharePage;
