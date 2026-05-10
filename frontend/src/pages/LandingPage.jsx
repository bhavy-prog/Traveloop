import { Link } from 'react-router-dom';
import { Plane, MapPin, Share2, ArrowRight, Globe, CheckCircle, Sparkles, TrendingUp, Package } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-white font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-40">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-50 rounded-full blur-[120px] opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center text-center lg:text-left">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center space-x-2 bg-blue-600/10 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-600/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Travel Planner</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
                Your entire trip <br />
                <span className="text-blue-600">in one loop.</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-slate-500 mb-12 max-w-2xl lg:max-w-none mx-auto lg:mx-0 font-medium leading-relaxed">
                The ultimate AI-powered itinerary builder. Plan multi-city routes, 
                manage INR budgets, and discover popular travel packages instantly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/signup" className="btn btn-primary px-10 py-5 text-lg w-full sm:w-auto flex items-center justify-center space-x-3 shadow-2xl shadow-blue-200">
                  <span className="font-black">Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="px-10 py-5 text-lg w-full sm:w-auto font-black text-slate-900 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2">
                  <span>Sign In</span>
                </Link>
              </div>
              <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-teal-500" />
                  <span>No CC Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-teal-500" />
                  <span>Unlimited Trips</span>
                </div>
              </div>
            </div>

            <div className="mt-20 lg:mt-0 relative animate-in fade-in zoom-in duration-1000 delay-300">
               <div className="relative bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 p-4 transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                  <img 
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200" 
                    alt="Travel Planning" 
                    className="rounded-[32px] shadow-inner"
                  />
                  
                  {/* Floating INR Badge */}
                  <div className="absolute -bottom-10 -left-6 md:-left-10 bg-white p-5 md:p-6 rounded-3xl shadow-2xl border border-slate-50 animate-bounce-slow">
                     <div className="flex items-center space-x-3 mb-1">
                        <div className="w-10 h-10 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-100">
                           <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Budget</p>
                          <p className="text-xl md:text-2xl font-black text-slate-900">₹1,95,000</p>
                        </div>
                     </div>
                  </div>

                  {/* Floating Stop Badge */}
                  <div className="absolute -top-10 -right-6 md:-right-10 bg-white p-5 rounded-3xl shadow-2xl border border-slate-50 animate-float">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
                           <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Stop</p>
                          <p className="text-base md:text-lg font-black text-slate-900">Switzerland</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Everything you need to travel smart</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg italic leading-relaxed">
              "Travel is the only thing you buy that makes you richer."
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Architect",
                description: "Build 30-day itineraries in seconds. Our AI handles the stops, activities, and budget planning.",
                icon: <Sparkles className="w-8 h-8 text-blue-600" />,
                bg: "bg-blue-100/50"
              },
              {
                title: "Smart Packages",
                description: "Clone ready-made travel plans for popular destinations like Goa, Bali, and Dubai instantly.",
                icon: <Package className="w-8 h-8 text-teal-600" />,
                bg: "bg-teal-100/50"
              },
              {
                title: "Budget in INR",
                description: "Manage costs with automatic currency conversion. See everything in INR, no matter where you go.",
                icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
                bg: "bg-orange-100/50"
              }
            ].map((feature, i) => (
              <div key={i} className="group bg-white p-10 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${feature.bg} group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[40px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Globe className="w-96 h-96" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10 leading-tight">Ready to loop into <br/> your next trip?</h2>
            <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-xl mx-auto relative z-10 font-medium">
              Join thousands of travelers who use Traveloop to plan their perfect getaways.
            </p>
            <Link to="/signup" className="btn bg-blue-600 hover:bg-blue-700 text-white border-none px-12 py-5 text-xl font-black relative z-10 inline-flex items-center space-x-3 rounded-2xl shadow-xl shadow-blue-900/40">
              <span>Create My First Trip</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
