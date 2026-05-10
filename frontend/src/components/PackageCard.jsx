import { Clock, MapPin, DollarSign, ArrowRight, Sparkles } from 'lucide-react';

const PackageCard = ({ pkg, onUse }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={pkg.coverImage} 
          alt={pkg.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/30 flex items-center gap-1">
             <Sparkles className="w-3 h-3 text-yellow-300" />
             Popular Choice
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
            {pkg.title}
          </h3>
        </div>

        <div className="flex items-center text-slate-500 text-sm mb-6 space-x-4">
          <span className="flex items-center font-bold">
            <Clock className="w-4 h-4 mr-1.5 text-blue-500" />
            {pkg.duration} Days
          </span>
          <span className="flex items-center font-bold">
            <MapPin className="w-4 h-4 mr-1.5 text-teal-500" />
            {pkg.destination}
          </span>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Budget</p>
              <p className="text-xl font-black text-slate-900">
                ₹ {new Intl.NumberFormat('en-IN').format(pkg.estimatedBudget)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg/Day</p>
              <p className="text-sm font-bold text-slate-600">
                ₹ {new Intl.NumberFormat('en-IN').format(Math.round(pkg.estimatedBudget / pkg.duration))}
              </p>
            </div>
          </div>

          <button 
            onClick={() => onUse(pkg)}
            className="w-full btn btn-primary py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-100 group/btn"
          >
            <span>Customize & Book</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
