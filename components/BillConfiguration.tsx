
import React from 'react';
import { BillConfig, TariffConfig } from '../types';
import { Settings, CreditCard, Banknote, Calendar, Clock, CheckCircle2, Circle, Camera } from 'lucide-react';
import { useLanguage } from '../i18n';
import OCRModal from './OCRModal';

interface BillConfigurationProps {
  config: BillConfig;
  onChange: (key: keyof BillConfig, value: string | number | boolean) => void;
  tariffConfig: TariffConfig;
}

const BillConfiguration: React.FC<BillConfigurationProps> = ({ config, onChange, tariffConfig }) => {
  const { t } = useLanguage();
  const [isOCRModalOpen, setIsOCRModalOpen] = React.useState(false);

  const handleChange = (key: keyof BillConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Prevent NaN by defaulting to 0 if parsing fails
    const val = e.target.type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value;
    onChange(key, val);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleScanResult = (value: number) => {
    onChange('totalBillPayable', value);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 print-break-inside-avoid transition-colors duration-200">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('costs_configuration')}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date Config */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
           <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{t('bill_month')}</label>
            <select
              value={config.month}
              onChange={handleChange('month')}
              className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1">
              {t('date_generated')} <Calendar className="w-3 h-3" />
            </label>
            <input
              type="date"
              value={config.dateGenerated}
              onChange={handleChange('dateGenerated')}
              className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm color-scheme-dark"
            />
          </div>
        </div>

        {/* Total Bill */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">{t('total_bill_payable')} <Banknote className="w-3 h-3" /></span>
            <button 
              onClick={() => setIsOCRModalOpen(true)}
              className="text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
            >
               <Camera className="w-3 h-3" /> {t('scan_bill')}
            </button>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              value={config.totalBillPayable}
              onChange={handleChange('totalBillPayable')}
              onFocus={handleFocus}
              className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-indigo-500 text-xl font-bold text-slate-900 dark:text-white pr-8 shadow-inner"
            />
            <span className="absolute right-3 top-3.5 text-xs text-slate-400 font-bold pointer-events-none">৳</span>
          </div>
        </div>

        {/* bKash Fee Toggle */}
        <div 
           className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-center cursor-pointer shadow-sm ${config.includeBkashFee ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600'}`} 
           onClick={() => onChange('includeBkashFee', !config.includeBkashFee)}
        >
          <label className={`block text-xs font-bold uppercase mb-2 flex items-center gap-1 cursor-pointer transition-colors ${config.includeBkashFee ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {t('bkash_fee')} <CreditCard className="w-3 h-3" />
          </label>
          <div className="flex items-center gap-2">
             {config.includeBkashFee ? (
               <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 drop-shadow-sm" />
             ) : (
               <Circle className="w-6 h-6 text-slate-400 dark:text-slate-600" />
             )}
             <span className={`text-sm font-semibold transition-colors ${config.includeBkashFee ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-500'}`}>
               {config.includeBkashFee ? `Included (+${tariffConfig.bkashCharge})` : 'Not Applicable'}
             </span>
          </div>
        </div>

        {/* Late Fee Checkbox */}
        <div 
           className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-center cursor-pointer shadow-sm ${config.includeLateFee ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600'}`} 
           onClick={() => onChange('includeLateFee', !config.includeLateFee)}
        >
          <label className={`block text-xs font-bold uppercase mb-2 flex items-center gap-1 cursor-pointer transition-colors ${config.includeLateFee ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {t('late_fee')} <Clock className="w-3 h-3" />
          </label>
          <div className="flex items-center gap-2">
             {config.includeLateFee ? (
               <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 drop-shadow-sm" />
             ) : (
               <Circle className="w-6 h-6 text-slate-400 dark:text-slate-600" />
             )}
             <span className={`text-sm font-semibold transition-colors ${config.includeLateFee ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-500'}`}>
               {config.includeLateFee ? 'Included (VAT Total)' : 'Not Applicable'}
             </span>
          </div>
        </div>
      </div>
      
      <OCRModal 
         isOpen={isOCRModalOpen} 
         onClose={() => setIsOCRModalOpen(false)} 
         onScan={handleScanResult} 
      />
    </div>
  );
};

export default BillConfiguration;
