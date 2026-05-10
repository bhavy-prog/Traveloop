import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const CurrencyBadge = ({ amount, currency = 'USD' }) => {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        // Free keyless API
        const response = await fetch(`https://open.er-api.com/v6/latest/${currency.toUpperCase()}`);
        const data = await response.json();
        if (data && data.rates && data.rates.INR) {
          setRate(data.rates.INR);
        }
      } catch (error) {
        console.error('Exchange rate error:', error);
        // Fallback rates if API fails
        const fallbacks = { 'USD': 83.5, 'EUR': 90.2, 'AED': 22.7, 'INR': 1 };
        setRate(fallbacks[currency.toUpperCase()] || 1);
      } finally {
        setLoading(false);
      }
    };

    if (currency.toUpperCase() === 'INR') {
      setRate(1);
      setLoading(false);
    } else {
      fetchRate();
    }
  }, [currency]);

  if (loading || currency.toUpperCase() === 'INR') return null;

  const inrAmount = amount * rate;

  return (
    <div className="inline-flex items-center bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100 animate-in fade-in zoom-in duration-300">
      <TrendingUp className="w-3 h-3 text-teal-600 mr-1" />
      <span className="text-[10px] font-black text-teal-700 uppercase tracking-tighter">
        ≈ ₹{Math.round(inrAmount).toLocaleString('en-IN')}
      </span>
    </div>
  );
};

export default CurrencyBadge;
