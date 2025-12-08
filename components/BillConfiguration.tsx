
import React from 'react';
import { BillConfig } from '../types';
import { Settings, Calculator, CreditCard, Banknote, Calendar, Percent } from 'lucide-react';

interface BillConfigurationProps {
  config: BillConfig;
  onChange: (key: keyof BillConfig, value: string | number) => void;
}

const BillConfiguration: React.FC<BillConfigurationProps> = ({ config, onChange }) => {
  const handleChange = (key: keyof BillConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange(key, val);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 print-break-inside-avoid">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <Settings className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-800">Costs Configuration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date Config - Full width on small, spans full on lg row 1 */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
           <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bill Month</label>
            <select
              value={config.month}
              onChange={handleChange('month')}
              className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
              Date Generated <Calendar className="w-3 h-3" />
            </label>
            <input
              type="date"
              value={config.dateGenerated}
              onChange={handleChange('dateGenerated')}
              className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white"
            />
          </div>
        </div>

        {/* Total Bill */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
            Total Bill Payable <Banknote className="w-3 h-3 text-indigo-500" />
          </label>
          <div className="relative">
            <input
              type="number"
              value={config.totalBillPayable}
              onChange={handleChange('totalBillPayable')}
              className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm font-bold text-slate-900 pr-8"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">BDT</span>
          </div>
        </div>

        {/* Demand Charge */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
            Demand Charge <Calculator className="w-3 h-3" />
          </label>
          <input
            type="number"
            value={config.demandCharge}
            onChange={handleChange('demandCharge')}
            className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Meter Rent */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
            Meter Rent <Calculator className="w-3 h-3" />
          </label>
          <input
            type="number"
            value={config.meterRent}
            onChange={handleChange('meterRent')}
            className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* VAT */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
            VAT (Total) <Percent className="w-3 h-3" />
          </label>
          <input
            type="number"
            value={config.vat}
            onChange={handleChange('vat')}
            className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* bKash Fee */}
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 hover:border-indigo-200 transition-colors">
          <label className="block text-xs font-bold text-indigo-600 uppercase mb-2 flex items-center gap-1">
            bKash Fee <CreditCard className="w-3 h-3" />
          </label>
          <input
            type="number"
            value={config.bkashFee}
            onChange={handleChange('bkashFee')}
            placeholder="0"
            className="w-full rounded-lg border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white text-indigo-700 font-medium"
          />
        </div>
      </div>
    </div>
  );
};

export default BillConfiguration;
