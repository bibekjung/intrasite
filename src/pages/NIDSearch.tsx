import { useMemo, useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import Modal from '@/components/Modal';

export default function NIDSearch() {
  const [nid, setNid] = useState('');
  const [open, setOpen] = useState(false);

  const digits = useMemo(() => nid.replace(/\D/g, '').slice(0, 10), [nid]);
  const formatted = useMemo(() => {
    const a = digits.slice(0, 3);
    const b = digits.slice(3, 6);
    const c = digits.slice(6, 9);
    const d = digits.slice(9, 10);
    return [a, b, c, d].filter(Boolean).join('-');
  }, [digits]);

  const isValid = digits.length === 10;

  const handleInput = (value: string) => {
    const onlyDigits = value.replace(/\D/g, '').slice(0, 10);
    const a = onlyDigits.slice(0, 3);
    const b = onlyDigits.slice(3, 6);
    const c = onlyDigits.slice(6, 9);
    const d = onlyDigits.slice(9, 10);
    const next = [a, b, c, d].filter(Boolean).join('-');
    setNid(next);
  };

  const handleSearch = () => {
    if (!isValid) return;
    setOpen(true);
  };

  const handleClear = () => {
    setNid('');
    setOpen(false);
  };

  return (
    <div>
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-600 to-sky-600 text-white rounded-2xl shadow mb-6 p-5 flex items-center gap-4">
        <div className="bg-white/20 rounded-xl w-14 h-14 flex items-center justify-center">
          <Search size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold leading-tight">
            National ID Search
          </h2>
          <p className="text-sm text-blue-100">
            Credit Information Bureau of Nepal
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-sky-100">
        <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wide">
          NATIONAL ID NUMBER <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="XXX-XXX-XXX-X"
            value={formatted}
            onChange={(e) => handleInput(e.target.value)}
          />
          <button
            onClick={handleSearch}
            disabled={!isValid}
            className={`px-5 py-3 rounded-xl text-white flex items-center gap-2 shadow ${
              isValid
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <Search size={18} />
            Search
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-3 rounded-xl bg-white border shadow text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Clear
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-10 flex items-center justify-center text-center text-slate-700">
        <div>
          <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center bg-sky-100">
            <Search size={36} className="text-sky-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">National ID Search</h3>
          <p className="max-w-2xl text-sm mx-auto">
            Enter a valid 10-digit National ID number in the format{' '}
            <span className="font-semibold">xxx-xxx-xxx-x</span> to retrieve
            verified citizen information.
          </p>
        </div>
      </div>

      <Modal open={open} title="NID Details" onClose={() => setOpen(false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Full Name</p>
            <p className="font-medium">Sita Sharma</p>
          </div>
          <div>
            <p className="text-gray-500">NID</p>
            <p className="font-medium">{formatted}</p>
          </div>
          <div>
            <p className="text-gray-500">DOB</p>
            <p className="font-medium">1992-08-15</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">+977-9800000000</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500">Address</p>
            <p className="font-medium">Kathmandu-10, Nepal</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500">Notes</p>
            <p className="font-medium">
              Static sample for office NID search workflow.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
