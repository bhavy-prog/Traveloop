import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Calendar, MapPin, DollarSign, Clock, ArrowRight, 
  Loader2, Plane, Search, Sparkles, TrendingUp, Compass, 
  ChevronRight, ChevronLeft, Globe
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PackageCard from '../components/PackageCard';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [packages, setPackages] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, upcoming, past
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsRes, packagesRes] = await Promise.all([
          api.get('/trips'),
          api.get('/packages')
        ]);
        setTrips(tripsRes.data);
        setFilteredTrips(tripsRes.data);
        setPackages(packagesRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUsePackage = async (pkg) => {
    try {
      setLoading(true);
      const res = await api.post('/trips/clone-package', { packageData: pkg });
      toast.success(`${pkg.title} added to your trips!`);
      navigate(`/trip/${res.data._id}`);
    } catch (err) {
      toast.error('Failed to clone package');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = trips.filter(trip => 
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.destination && trip.destination.toLowerCase().includes(searchTerm.toLowerCase())) ||
      trip.stops.some(stop => stop.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filterType === 'upcoming') {
      result = result.filter(trip => new Date(trip.startDate) > new Date());
    } else if (filterType === 'past') {
      result = result.filter(trip => new Date(trip.endDate) < new Date());
    }

    setFilteredTrips(result);
  }, [searchTerm, filterType, trips]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateBudget = (trip) => {
    let total = 0;
    trip.stops.forEach(stop => {
      stop.activities.forEach(activity => {
        total += activity.cost || 0;
      });
    });
    return total;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-12 w-64 bg-slate-200 rounded-2xl mb-4"></div>
        <div className="h-6 w-48 bg-slate-100 rounded-xl mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-slate-50 rounded-[32px]"></div>)}
        </div>
        <div className="h-10 w-48 bg-slate-200 rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-50 rounded-[32px]"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Welcome back, {user?.name}!</h1>
          <p className="text-slate-500 mt-3 text-lg font-medium flex items-center">
            <Compass className="w-5 h-5 mr-2 text-blue-500" />
            You have <span className="text-blue-600 font-black mx-1">{trips.length}</span> active loops in your dashboard.
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => toast.success('Search feature coming soon!')} className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all">
            <Search className="w-6 h-6" />
          </button>
          <Link to="/trip/new" className="btn btn-primary px-8 py-4 flex items-center justify-center space-x-3 w-full md:w-auto shadow-2xl shadow-blue-200">
            <Plus className="w-6 h-6" />
            <span className="text-lg">Create New Trip</span>
          </Link>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
         <div className="card p-8 bg-slate-900 text-white shadow-2xl shadow-slate-200 overflow-hidden relative group">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">Total Adventures</p>
            <div className="flex items-end justify-between">
               <h3 className="text-5xl font-black">{trips.length}</h3>
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Plane className="w-6 h-6 text-blue-400" />
               </div>
            </div>
         </div>
         <div className="card p-8 bg-white border-slate-100 shadow-sm">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Budget Planned</p>
            <div className="flex items-end justify-between">
               <h3 className="text-4xl font-black text-slate-900">₹ {new Intl.NumberFormat('en-IN').format(trips.reduce((acc, t) => acc + calculateBudget(t), 0))}</h3>
               <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-teal-500" />
               </div>
            </div>
         </div>
         <div className="card p-8 bg-white border-slate-100 shadow-sm">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Stops Mapped</p>
            <div className="flex items-end justify-between">
               <h3 className="text-4xl font-black text-slate-900">{trips.reduce((acc, t) => acc + t.stops.length, 0)}</h3>
               <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-orange-500" />
               </div>
            </div>
         </div>
      </div>

      {/* Featured Banner */}
      <div className="relative rounded-[40px] overflow-hidden mb-20 h-80 group cursor-pointer">
         <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
         <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent flex flex-col justify-center p-12">
            <div className="bg-yellow-400 text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-6 shadow-xl shadow-yellow-900/20">Summer Sale</div>
            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Island Hopping in Bali</h2>
            <p className="text-white/70 text-lg font-medium max-w-md">Discover hidden beaches and luxury villas with our curated 7-day Bali itinerary.</p>
         </div>
         <div className="absolute bottom-8 right-8">
            <button className="btn bg-white text-slate-900 px-8 py-4 shadow-2xl shadow-black/20 flex items-center gap-2">
               <span>View Package</span>
               <ArrowRight className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Popular Packages Section */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-yellow-400" />
              Predefined Packages
            </h2>
            <p className="text-slate-500 font-medium mt-1">Ready-made itineraries you can fully customize.</p>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <button className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg, idx) => (
            <PackageCard key={idx} pkg={pkg} onUse={handleUsePackage} />
          ))}
        </div>
      </section>

      {/* My Planned Trips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Your Saved Loops</h2>
        
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, city..."
              className="input-field pl-12 py-3.5 bg-white border-slate-100 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
            {['all', 'upcoming', 'past'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filterType === type 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
            <Plane className="w-12 h-12 text-blue-600 opacity-50" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-3">No matching trips</h3>
          <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">Start by creating a new trip or select a package above to begin your journey.</p>
          <Link to="/trip/new" className="btn btn-outline px-10">Start Planning</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip) => (
            <Link 
              key={trip._id} 
              to={`/trip/${trip._id}`}
              className="group card hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={trip.coverImage || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800"} 
                  alt={trip.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-6 left-6 flex gap-2">
                   {trip.isPublic && (
                     <div className="bg-teal-500/90 backdrop-blur-md p-2 rounded-xl text-white shadow-lg">
                        <Globe className="w-4 h-4" />
                     </div>
                   )}
                   <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-900 shadow-lg border border-white/20 uppercase tracking-widest">
                     {trip.stops.length} {trip.stops.length === 1 ? 'Stop' : 'Stops'}
                   </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                   <button className="w-full btn bg-white text-slate-900 text-sm py-2.5">Edit Itinerary</button>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                   <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
                     {trip.theme || 'Adventure'}
                   </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors tracking-tight leading-tight">{trip.title}</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-slate-500 font-bold">
                    <Calendar className="w-5 h-5 mr-3 text-blue-400" />
                    <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center">
                       <span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg text-[10px] font-black mr-3 uppercase tracking-widest border border-teal-100">
                         INR
                       </span>
                       <span className="text-xl font-black text-slate-900">₹ {new Intl.NumberFormat('en-IN').format(calculateBudget(trip))}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
