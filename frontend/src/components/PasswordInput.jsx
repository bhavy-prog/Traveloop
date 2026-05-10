import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordInput = ({ value, onChange, placeholder = "Password", name = "password" }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        className="input-field input-with-icon pr-12 py-3.5"
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default PasswordInput;
