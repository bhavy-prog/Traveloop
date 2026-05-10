import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, DollarSign, Clock, Plus, Trash2, Edit3, 
  CheckCircle2, Circle, ChevronDown, ChevronUp, Share2, 
  Loader2, Plane, Info, Package, StickyNote, BarChart3, Save,
  Download, Sparkles, Map as MapIcon, CloudSun, TrendingUp,
  LayoutGrid, Tag, ShoppingBag, Briefcase
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TravelMap from '../components/TravelMap';
import AIGenerator from '../components/AIGenerator';
import CurrencyBadge from '../components/CurrencyBadge';
import { generateSmartPackingList, packingCategories } from '../utils/packingTemplates';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';

// Drag and Drop Imports
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableStop = ({ stop, sIdx, removeStop, removeActivity, addActivity, weatherData, currency, saveTrip, trip, setNewActivity, newActivity }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: stop._id || sIdx });

  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative pl-16 timeline-item group">
      <div 
        {...attributes} {...listeners}
        className="absolute left-0 top-0 w-14 h-14 bg-white border-4 border-slate-50 rounded-2xl shadow-sm flex items-center justify-center z-10 group-hover:border-blue-100 transition-colors cursor-grab active:cursor-grabbing"
      >
        <div className="flex flex-col items-center">
           <span className="text-[10px] font-black text-slate-400 uppercase">Day</span>
           <span className="text-lg font-black text-blue-600 leading-none">{sIdx + 1}</span>
        </div>
      </div>
      
      <div className="card p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{stop.city}</h2>
                {weatherData[stop.city] && (
                  <div className="bg-blue-50 px-3 py-1.5 rounded-xl flex items-center gap-2">
                    <CloudSun className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold text-blue-700">{weatherData[stop.city].temp}°C</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500 flex items-center mt-2 font-bold">
                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                {stop.arrivalDate ? new Date(stop.arrivalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Set Date'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowNotes(!showNotes)}
              className={`p-2 rounded-xl transition-all ${showNotes ? 'bg-blue-100 text-blue-600' : 'text-slate-300 hover:text-blue-500'}`}
            >
              <StickyNote className="w-5 h-5" />
            </button>
            <button onClick={() => removeStop(sIdx)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showNotes && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2">
            <textarea
              placeholder="Add specific notes for this stop (e.g. Hotel check-in details)..."
              className="input-field text-sm font-medium h-24"
              value={stop.notes || ''}
              onChange={(e) => {
                const updatedStops = [...trip.stops];
                updatedStops[sIdx].notes = e.target.value;
                saveTrip({ ...trip, stops: updatedStops }, false); // silent save
              }}
            />
          </div>
        )}

        <div className="space-y-3 mb-6">
          {stop.activities.map((activity, aIdx) => (
            <div key={aIdx} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl group/item border border-transparent hover:border-slate-100 transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[10px] font-black text-blue-600 uppercase border border-slate-50">
                  {activity.category ? activity.category.substring(0, 2) : 'OT'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 leading-tight">{activity.title}</h4>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">
                    <span>{activity.category}</span>
                    <span>•</span>
                    <span className="text-teal-600">₹ {new Intl.NumberFormat('en-IN').format(activity.cost)}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => removeActivity(sIdx, aIdx)} 
                className="opacity-0 group-hover/item:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {isAddingActivity ? (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Activity Title"
                className="input-field bg-white"
                autoFocus
                value={newActivity.title}
                onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
              />
              <div className="flex gap-2">
                <select 
                  className="input-field bg-white w-1/2"
                  value={newActivity.category}
                  onChange={(e) => setNewActivity({...newActivity, category: e.target.value})}
                >
                  {['Stay', 'Transport', 'Food', 'Activities', 'Other'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Cost"
                  className="input-field bg-white w-1/2"
                  value={newActivity.cost}
                  onChange={(e) => setNewActivity({...newActivity, cost: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsAddingActivity(false)} className="btn text-slate-500 font-bold">Cancel</button>
              <button onClick={() => {
                addActivity(sIdx);
                setIsAddingActivity(false);
              }} className="btn btn-primary px-8">Add to Itinerary</button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAddingActivity(true)}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 transition-all flex items-center justify-center space-x-2 font-black uppercase text-[10px] tracking-[0.2em]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        )}
      </div>
    </div>
  );
};

const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [weatherData, setWeatherData] = useState({});

  const [headerForm, setHeaderForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    theme: 'Adventure',
    coverImage: '',
    destination: '',
    isPublic: false
  });

  const [newStop, setNewStop] = useState({ city: '', arrivalDate: '', departureDate: '' });
  const [newActivity, setNewActivity] = useState({ stopIndex: -1, title: '', category: 'Activities', cost: 0, notes: '' });
  const [newPackingItem, setNewPackingItem] = useState('');
  const [newNote, setNewNote] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTrip();
  }, [id]);

  useEffect(() => {
    if (trip) {
      setHeaderForm({
        title: trip.title,
        startDate: trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : '',
        endDate: trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : '',
        theme: trip.theme || 'Adventure',
        coverImage: trip.coverImage || '',
        destination: trip.destination || '',
        isPublic: trip.isPublic || false
      });
    }
  }, [trip]);

  useEffect(() => {
    const fetchWeatherForStops = async () => {
      if (!trip || !trip.stops) return;
      const data = {};
      for (const stop of trip.stops) {
        try {
          const res = await api.get(`/weather/${stop.city}`);
          data[stop.city] = res.data;
        } catch (err) {
          console.error('Weather fetch error', err);
        }
      }
      setWeatherData(data);
    };
    if (trip && trip.stops.length > 0) fetchWeatherForStops();
  }, [trip?.stops?.length]);

  const fetchTrip = async () => {
    try {
      const response = await api.get(`/trips/${id}`);
      setTrip(response.data);
    } catch (error) {
      console.error('Error fetching trip:', error);
      toast.error('Could not load trip details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const saveTrip = async (updatedTrip, showToast = true) => {
    setSaving(true);
    try {
      const response = await api.put(`/trips/${id}`, updatedTrip || trip);
      setTrip(response.data);
      if (showToast) toast.success('Changes saved successfully');
    } catch (error) {
      console.error('Error saving trip:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleHeaderSave = async () => {
    await saveTrip({ ...trip, ...headerForm });
    setIsEditingHeader(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = trip.stops.findIndex(s => (s._id || trip.stops.indexOf(s)) === active.id);
      const newIndex = trip.stops.findIndex(s => (s._id || trip.stops.indexOf(s)) === over.id);
      const newStops = arrayMove(trip.stops, oldIndex, newIndex);
      saveTrip({ ...trip, stops: newStops });
    }
  };

  const addStop = () => {
    if (!newStop.city) return;
    const updatedStops = [...trip.stops, { ...newStop, activities: [] }];
    saveTrip({ ...trip, stops: updatedStops });
    setNewStop({ city: '', arrivalDate: '', departureDate: '' });
  };

  const removeStop = (index) => {
    const updatedStops = trip.stops.filter((_, i) => i !== index);
    saveTrip({ ...trip, stops: updatedStops });
  };

  const addActivity = (stopIndex) => {
    if (!newActivity.title) return;
    const updatedStops = [...trip.stops];
    updatedStops[stopIndex].activities.push({
      title: newActivity.title,
      category: newActivity.category,
      cost: parseFloat(newActivity.cost) || 0,
      notes: newActivity.notes
    });
    saveTrip({ ...trip, stops: updatedStops });
    setNewActivity({ stopIndex: -1, title: '', category: 'Activities', cost: 0, notes: '' });
  };

  const removeActivity = (stopIndex, activityIndex) => {
    const updatedStops = [...trip.stops];
    updatedStops[stopIndex].activities = updatedStops[stopIndex].activities.filter((_, i) => i !== activityIndex);
    saveTrip({ ...trip, stops: updatedStops });
  };

  const togglePackingItem = (index) => {
    const updatedItems = [...trip.packingItems];
    updatedItems[index].packed = !updatedItems[index].packed;
    saveTrip({ ...trip, packingItems: updatedItems }, false);
  };

  const addPackingItem = () => {
    if (!newPackingItem) return;
    saveTrip({ ...trip, packingItems: [...trip.packingItems, { itemName: newPackingItem, packed: false }] });
    setNewPackingItem('');
  };

  const removePackingItem = (index) => {
    const updatedItems = trip.packingItems.filter((_, i) => i !== index);
    saveTrip({ ...trip, packingItems: updatedItems });
  };

  const addNote = () => {
    if (!newNote) return;
    saveTrip({ ...trip, notes: [...trip.notes, { content: newNote }] });
    setNewNote('');
  };

  const removeNote = (index) => {
    const updatedNotes = trip.notes.filter((_, i) => i !== index);
    saveTrip({ ...trip, notes: updatedNotes });
  };

  const calculateTotals = () => {
    let total = 0;
    const categoryTotals = { Stay: 0, Transport: 0, Food: 0, Activities: 0, Misc: 0 };
    trip?.stops?.forEach(stop => {
      stop.activities.forEach(activity => {
        const cost = parseFloat(activity.cost) || 0;
        total += cost;
        const cat = activity.category || 'Misc';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + cost;
      });
    });
    const start = new Date(trip?.startDate || new Date());
    const end = new Date(trip?.endDate || new Date());
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return { total, categoryTotals, avgPerDay: total / days, days };
  };

  const exportToPDF = async () => {
    const element = document.getElementById('trip-content');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${trip.title}_Itinerary.pdf`);
    toast.success('Itinerary exported as PDF');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-slate-500 font-bold">Refining your journey...</p>
    </div>
  );

  const budget = calculateTotals();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Premium Header */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden mb-8 transition-all duration-500">
        <div className="relative min-h-[400px]">
          <img 
            src={trip.coverImage || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200"} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white">
            {isEditingHeader ? (
              <div className="space-y-6 bg-white/10 backdrop-blur-md p-8 rounded-[32px] border border-white/20 animate-in fade-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 block">Trip Title</label>
                    <input 
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-white font-bold focus:bg-white/20 outline-none transition-all"
                      value={headerForm.title}
                      onChange={(e) => setHeaderForm({...headerForm, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 block">Destination</label>
                    <input 
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-white font-bold focus:bg-white/20 outline-none transition-all"
                      value={headerForm.destination}
                      onChange={(e) => setHeaderForm({...headerForm, destination: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 block">Start Date</label>
                    <input 
                      type="date"
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-white font-bold focus:bg-white/20 outline-none transition-all"
                      value={headerForm.startDate}
                      onChange={(e) => setHeaderForm({...headerForm, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 block">End Date</label>
                    <input 
                      type="date"
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-white font-bold focus:bg-white/20 outline-none transition-all"
                      value={headerForm.endDate}
                      onChange={(e) => setHeaderForm({...headerForm, endDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 block">Travel Theme</label>
                    <select 
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-white font-bold focus:bg-white/20 outline-none transition-all appearance-none"
                      value={headerForm.theme}
                      onChange={(e) => setHeaderForm({...headerForm, theme: e.target.value})}
                    >
                      {['Adventure', 'Luxury', 'Honeymoon', 'Family', 'Backpacking', 'Other'].map(t => (
                        <option key={t} value={t} className="bg-slate-800">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 block">Cover Image URL</label>
                  <input 
                    placeholder="https://unsplash.com/..."
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-white font-bold focus:bg-white/20 outline-none transition-all"
                    value={headerForm.coverImage}
                    onChange={(e) => setHeaderForm({...headerForm, coverImage: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={handleHeaderSave} className="btn bg-white text-slate-900 hover:bg-blue-50 px-8">Save Changes</button>
                  <button onClick={() => setIsEditingHeader(false)} className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex-grow">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500 shadow-lg shadow-blue-900/20">
                      {trip.theme || 'Adventure'}
                    </span>
                    {trip.destination && (
                      <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                        {trip.destination}
                      </span>
                    )}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">{trip.title}</h1>
                  <div className="flex flex-wrap items-center gap-8 text-sm font-bold text-white/80">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-3 text-blue-400" />
                      {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                      {trip.stops.length} Major Stops
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-3 text-teal-400" />
                      ₹ {new Intl.NumberFormat('en-IN').format(budget.total)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0 pb-2">
                  <button 
                    onClick={() => setIsEditingHeader(true)}
                    className="w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-2xl flex items-center justify-center border border-white/20 transition-all"
                    title="Edit Trip Header"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowAIGenerator(true)}
                    className="btn bg-yellow-400 hover:bg-yellow-500 text-slate-900 flex items-center space-x-2 shadow-xl shadow-yellow-900/40"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI Planner</span>
                  </button>
                  <button 
                    onClick={() => {
                      const url = `${window.location.origin}/share/${trip._id}`;
                      navigator.clipboard.writeText(url);
                      toast.success('Share link copied!');
                    }}
                    className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 shadow-xl shadow-blue-900/40"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Trip</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-4 overflow-x-auto scrollbar-hide">
          {[
            { id: 'itinerary', label: 'Itinerary', icon: <MapPin className="w-4 h-4" /> },
            { id: 'map', label: 'Map View', icon: <MapIcon className="w-4 h-4" /> },
            { id: 'budget', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'packing', label: 'Packing', icon: <Package className="w-4 h-4" /> },
            { id: 'notes', label: 'Notes', icon: <StickyNote className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div id="trip-content">
        {activeTab === 'itinerary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Add Stop Form */}
              <div className="card p-6 bg-blue-50/50 border-blue-100 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-grow space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Destination</label>
                  <input
                    type="text"
                    placeholder="Where to next? (e.g. Kyoto)"
                    className="input-field bg-white"
                    value={newStop.city}
                    onChange={(e) => setNewStop({...newStop, city: e.target.value})}
                  />
                </div>
                <div className="w-full md:w-48 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Arrival Date</label>
                  <input
                    type="date"
                    className="input-field bg-white"
                    value={newStop.arrivalDate}
                    onChange={(e) => setNewStop({...newStop, arrivalDate: e.target.value})}
                  />
                </div>
                <button 
                  onClick={addStop}
                  disabled={!newStop.city}
                  className="btn btn-primary h-[52px] px-8"
                >
                  Add Stop
                </button>
              </div>

              {/* Timeline */}
              <div className="space-y-4 relative">
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={trip.stops.map((s, i) => s._id || i)}
                    strategy={verticalListSortingStrategy}
                  >
                    {trip.stops.map((stop, sIdx) => (
                      <SortableStop 
                        key={stop._id || sIdx}
                        stop={stop}
                        sIdx={sIdx}
                        removeStop={removeStop}
                        removeActivity={removeActivity}
                        addActivity={addActivity}
                        weatherData={weatherData}
                        currency={trip.currency}
                        saveTrip={saveTrip}
                        trip={trip}
                        newActivity={newActivity}
                        setNewActivity={setNewActivity}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
                {trip.stops.length === 0 && (
                  <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">Your timeline is empty. Add a stop to begin!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="space-y-6">
              <div className="card p-8 bg-slate-900 text-white shadow-2xl shadow-slate-200">
                <h3 className="text-xl font-black mb-6 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-3 text-blue-400" />
                  Quick Stats
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-slate-400 font-bold">Total Budget</span>
                    <span className="text-xl font-black">₹ {new Intl.NumberFormat('en-IN').format(budget.total)}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-slate-400 font-bold">Daily Average</span>
                    <span className="text-xl font-black">₹ {new Intl.NumberFormat('en-IN').format(budget.avgPerDay)}</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-slate-400 font-bold">Total Days</span>
                    <span className="text-xl font-black">{budget.days} Days</span>
                  </div>
                </div>
                <button 
                  onClick={exportToPDF}
                  className="w-full btn bg-white/10 hover:bg-white/20 text-white border border-white/10 mt-8 flex items-center justify-center gap-3"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>

              <div className="card p-8 border-none bg-blue-50/50">
                 <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                   <Info className="w-4 h-4 mr-2" />
                   Travel Smart
                 </h3>
                 <p className="text-sm text-blue-800/70 font-medium leading-relaxed">
                   Changes to your itinerary are automatically saved to your private dashboard. Share your loop with friends to collaborate!
                 </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="h-[650px] card shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
             <TravelMap stops={trip.stops} />
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Spending', value: budget.total, color: 'bg-blue-600', icon: <DollarSign /> },
                  { label: 'Daily Average', value: budget.avgPerDay, color: 'bg-teal-500', icon: <Clock /> },
                  { label: 'Trip Duration', value: `${budget.days} Days`, color: 'bg-slate-900', icon: <Calendar /> },
                  { label: 'Activities', value: trip.stops.reduce((acc, s) => acc + s.activities.length, 0), color: 'bg-orange-400', icon: <Sparkles /> }
                ].map((stat, i) => (
                  <div key={i} className={`card p-8 ${stat.color} text-white shadow-xl`}>
                    <p className="text-white/60 font-black uppercase tracking-widest text-[10px] mb-2">{stat.label}</p>
                    <h3 className="text-3xl font-black">
                      {typeof stat.value === 'number' ? `₹ ${new Intl.NumberFormat('en-IN').format(stat.value)}` : stat.value}
                    </h3>
                  </div>
                ))}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-8">
                   <h3 className="text-xl font-black mb-8">Category Breakdown</h3>
                   <div className="space-y-6">
                      {Object.entries(budget.categoryTotals).map(([cat, amount]) => (
                        <div key={cat}>
                           <div className="flex justify-between items-center mb-3">
                              <span className="font-bold text-slate-700">{cat}</span>
                              <span className="font-black text-slate-900">₹ {new Intl.NumberFormat('en-IN').format(amount)}</span>
                           </div>
                           <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  cat === 'Stay' ? 'bg-blue-500' : 
                                  cat === 'Transport' ? 'bg-orange-400' : 
                                  cat === 'Food' ? 'bg-teal-500' : 
                                  cat === 'Activities' ? 'bg-purple-500' : 'bg-slate-400'
                                }`}
                                style={{ width: `${budget.total > 0 ? (amount / budget.total) * 100 : 0}%` }}
                              ></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="card p-8 bg-slate-50 border-none">
                  <h3 className="text-xl font-black mb-6">AI Budget Insights</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-5 bg-white rounded-[24px] shadow-sm border border-slate-100">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-sm text-slate-600 font-medium">Your trip is currently focused on {Object.entries(budget.categoryTotals).sort((a,b) => b[1]-a[1])[0][0]}. Consider allocating more to unique activities!</p>
                    </div>
                    <div className="flex gap-4 p-5 bg-white rounded-[24px] shadow-sm border border-slate-100">
                      <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-teal-600" />
                      </div>
                      <p className="text-sm text-slate-600 font-medium">Based on your {budget.days}-day duration, your daily average of ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(budget.avgPerDay)} is within healthy travel bounds.</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'packing' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
             <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black">Packing Gear</h3>
                <button 
                  onClick={() => {
                    const smartItems = generateSmartPackingList(trip.title, trip.destination);
                    const currentItems = trip.packingItems.map(i => i.itemName);
                    const newItems = smartItems
                      .filter(item => !currentItems.includes(item))
                      .map(item => ({ itemName: item, packed: false }));
                    saveTrip({ ...trip, packingItems: [...trip.packingItems, ...newItems] });
                  }}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Suggestions</span>
                </button>
             </div>

             <div className="card p-4 bg-slate-50 border-slate-100 flex gap-3">
                <input
                  type="text"
                  placeholder="Essential item name..."
                  className="input-field bg-white flex-grow"
                  value={newPackingItem}
                  onChange={(e) => setNewPackingItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPackingItem()}
                />
                <button onClick={addPackingItem} className="btn btn-primary px-8">Add Gear</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(packingCategories).map(([category, catItems]) => {
                  const items = trip.packingItems.filter(i => catItems.includes(i.itemName) || (!Object.values(packingCategories).flat().includes(i.itemName) && category === 'Essentials'));
                  if (items.length === 0 && category !== 'Essentials') return null;

                  return (
                    <div key={category} className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{category}</h4>
                      <div className="space-y-2">
                        {items.map((item, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => togglePackingItem(trip.packingItems.indexOf(item))}
                            className={`flex items-center justify-between p-5 rounded-[24px] cursor-pointer transition-all border ${
                              item.packed 
                              ? 'bg-teal-50 border-teal-100 text-teal-800' 
                              : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200 shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {item.packed ? <CheckCircle2 className="w-5 h-5 text-teal-500" /> : <Circle className="w-5 h-5 text-slate-300" />}
                              <span className={`font-bold ${item.packed ? 'line-through opacity-40' : ''}`}>{item.itemName}</span>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                removePackingItem(trip.packingItems.indexOf(item));
                              }}
                              className="text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
            <div className="card p-8 border-none bg-blue-600 text-white shadow-2xl shadow-blue-100">
               <h3 className="text-2xl font-black mb-6">Trip Journal</h3>
               <textarea
                className="w-full bg-white/10 border border-white/20 rounded-[24px] p-6 text-white font-medium focus:bg-white/20 outline-none transition-all mb-4 min-h-[150px]"
                placeholder="Share your thoughts or important travel details..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
               />
               <button onClick={addNote} className="btn bg-white text-blue-600 font-black px-10">Save Journal Entry</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {trip.notes.slice().reverse().map((note, idx) => (
                 <div key={idx} className="card p-8 border-slate-100 hover:border-blue-200 transition-all">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(note.createdAt).toLocaleString()}</span>
                       <button onClick={() => removeNote(trip.notes.length - 1 - idx)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">{note.content}</p>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {showAIGenerator && (
        <AIGenerator 
          onClose={() => setShowAIGenerator(false)}
          onItineraryGenerated={(gen) => {
            const newStops = gen.stops.map(s => ({
              ...s,
              arrivalDate: new Date(),
              departureDate: new Date(),
              activities: s.activities || []
            }));
            saveTrip({ 
              ...trip, 
              title: gen.title, 
              stops: [...trip.stops, ...newStops] 
            });
          }}
        />
      )}
    </div>
  );
};

export default TripDetailsPage;
