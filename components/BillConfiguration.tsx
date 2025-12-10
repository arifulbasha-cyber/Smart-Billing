
import React from 'react';
import { BillConfig } from '../types';
import { Settings, CreditCard, Banknote, Calendar, Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n';

interface BillConfigurationProps {
  config: BillConfig;
  onChange: (key: keyof BillConfig, value: string | number | boolean) => void;
  onNextMonth: () => void;
}

const BillConfiguration: React.FC<BillConfigurationProps> = ({ config, onChange, onNextMonth }) => {
  const { t } = useLanguage();

  const handleChange = (key: keyof BillConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Prevent NaN by defaulting to 0 if parsing fails
    const val = e.target.type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value;
    onChange(key, val);
  };

  const handleCheckboxChange = (key: keyof BillConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(key, e.target.checked);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 print-break-inside-avoid">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-800">{t('costs_configuration')}</h2>
        </div>
        <button
          onClick={onNextMonth}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100"
          title={t('next_month')}
        >
          {t('next_month')} <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date Config - Full width on small, spans full on lg row 1 */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
           <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('bill_month')}</label>
            <select
              value={config.month}
              onChange={handleChange('month')}
              className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white text-slate-900"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
              {t('date_generated')} <Calendar className="w-3 h-3" />
            </label>
            <input
              type="date"
              value={config.dateGenerated}
              onChange={handleChange('dateGenerated')}
              className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white text-slate-900"
            />
          </div>
        </div>

        {/* Total Bill */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
            {t('total_bill_payable')} <Banknote className="w-3 h-3 text-indigo-500" />
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              value={config.totalBillPayable}
              onChange={handleChange('totalBillPayable')}
              onFocus={handleFocus}
              className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm font-bold text-slate-900 pr-8 bg-white"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">{t('bdt')}</span>
          </div>
        </div>

        {/* bKash Fee */}
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 hover:border-indigo-200 transition-colors">
          <label className="block text-xs font-bold text-indigo-600 uppercase mb-2 flex items-center gap-1">
            {t('bkash_fee')} <CreditCard className="w-3 h-3" />
          </label>
          <input
            type="number"
            min="0"
            value={config.bkashFee}
            onChange={handleChange('bkashFee')}
            onFocus={handleFocus}
            placeholder="0"
            className="w-full rounded-lg border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white text-indigo-700 font-medium"
          />
        </div>

        {/* Late Fee Checkbox */}
        <div className={`p-4 rounded-xl border transition-colors flex flex-col justify-center cursor-pointer ${config.includeLateFee ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}`} onClick={() => onChange('includeLateFee', !config.includeLateFee)}>
          <label className={`block text-xs font-bold uppercase mb-2 flex items-center gap-1 cursor-pointer ${config.includeLateFee ? 'text-orange-600' : 'text-slate-500'}`}>
            {t('late_fee')} <Clock className="w-3 h-3" />
          </label>
          <div className="flex items-center gap-2">
             {config.includeLateFee ? (
               <CheckCircle2 className="w-5 h-5 text-orange-500" />
             ) : (
               <Circle className="w-5 h-5 text-slate-300" />
             )}
             <span className={`text-sm font-medium ${config.includeLateFee ? 'text-orange-700' : 'text-slate-400'}`}>
               {config.includeLateFee ? 'Included (= VAT Total)' : 'Not Applicable'}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillConfiguration;
