import { useState } from 'react';
import { Sparkles, X, Loader2, Plane, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../api/axios';

const AIGenerator = ({ onItineraryGenerated, onClose }) => {
  const [formData, setFormData] = useState({
    destination: '',
    duration: 3,
    budget: 'Moderate',
    style: 'Balanced'
  });
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await api.post('/ai/generate-itinerary', formData);
      setGenerated(response.data);
    } catch (error) {
      console.error('AI error:', error);
      alert('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    onItineraryGenerated(generated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 animate-pulse text-yellow-300" />
            <h2 className="text-2xl font-bold">AI Trip Architect</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          {!generated ? (
            <div className="space-y-6">
              <p className="text-slate-600">Tell us where you want to go, and our AI will build a complete day-by-day plan for you.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Destination</label>
                  <input
                    type="text"
                    placeholder="e.g. Tokyo, Japan"
                    className="input-field"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Duration (Days)</label>
                    <input
                      type="number"
                      min="1" max="14"
                      className="input-field"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Budget</label>
                    <select 
                      className="input-field"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    >
                      {['Backpacker', 'Moderate', 'Luxury'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Travel Style</label>
                  <div className="flex flex-wrap gap-2">
                    {['Adventurous', 'Relaxing', 'Cultural', 'Foodie', 'Balanced'].map(s => (
                      <button
                        key={s}
                        onClick={() => setFormData({...formData, style: s})}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                          formData.style === s 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !formData.destination}
                className="btn btn-primary w-full py-4 text-lg flex items-center justify-center space-x-3 shadow-lg shadow-blue-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Architecting your trip...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Itinerary</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{generated.title}</h3>
                  <p className="text-slate-500 text-sm">{generated.description}</p>
                </div>
                <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Ready to go
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {generated.stops.map((stop, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 flex items-center mb-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-2">
                        {idx + 1}
                      </div>
                      {stop.city}
                    </h4>
                    <div className="space-y-2">
                      {stop.activities.map((act, aIdx) => (
                        <div key={aIdx} className="flex items-center text-sm text-slate-600 bg-white p-2 rounded-lg shadow-sm">
                          <ChevronRight className="w-4 h-4 text-blue-500 mr-2" />
                          <span>{act.title}</span>
                          <span className="ml-auto font-bold text-teal-600 text-xs">₹ {new Intl.NumberFormat('en-IN').format(act.cost)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setGenerated(null)}
                  className="btn btn-outline flex-1 py-3"
                >
                  Start Over
                </button>
                <button 
                  onClick={handleSave}
                  className="btn btn-primary flex-1 py-3 flex items-center justify-center space-x-2 shadow-md shadow-blue-100"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Apply to Trip</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
