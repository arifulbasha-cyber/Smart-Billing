import React, { useState } from 'react';
import { MeterReading, Tenant } from '../types';
import { Users, Trash2, Plus, Zap, Lock, Hash, History, Gauge, Camera, Phone, Mail, Settings, Activity } from 'lucide-react';
import { useLanguage } from '../i18n';
import OCRModal from './OCRModal';

interface MeterReadingsProps {
  mainMeter: MeterReading;
  onMainMeterUpdate: (reading: MeterReading) => void;
  readings: MeterReading[];
  onUpdate: (readings: MeterReading[]) => void;
  tenants: Tenant[];
  onManageTenants?: () => void;
  maxUnits?: number; // For visualization
}

const MeterReadings: React.FC<MeterReadingsProps> = ({ mainMeter, onMainMeterUpdate, readings, onUpdate, tenants, onManageTenants, maxUnits = 1 }) => {
  const { t } = useLanguage();
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);
  const [scanTarget, setScanTarget] = useState<{ id: string | 'main'; field: 'previous' | 'current' } | null>(null);
  
  const handleChange = (id: string, key: keyof MeterReading, value: string | number) => {
    const updated = readings.map(r => r.id === id ? { ...r, [key]: value } : r);
    onUpdate(updated);
  };

  const handleMainMeterChange = (key: keyof MeterReading, value: string | number) => {
    onMainMeterUpdate({ ...mainMeter, [key]: value });
  };

  const handleRemove = (id: string) => {
    onUpdate(readings.filter(r => r.id !== id));
  };

  const handleAdd = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const nextMeterNo = readings.length > 0 ? (parseInt(readings[readings.length - 1].meterNo) + 1).toString() : '1';
    onUpdate([...readings, { id: newId, name: 'New User', meterNo: nextMeterNo, previous: 0, current: 0 }]);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const startScan = (id: string | 'main', field: 'previous' | 'current') => {
    setScanTarget({ id, field });
    setIsOCRModalOpen(true);
  };

  const handleScanResult = (value: number) => {
    if (!scanTarget) return;

    if (scanTarget.id === 'main') {
      handleMainMeterChange(scanTarget.field, value);
    } else {
      handleChange(scanTarget.id, scanTarget.field, value);
    }
  };

  const totalUnits = readings.reduce((sum, r) => sum + (r.current - r.previous), 0);
  const mainMeterUnits = Math.max(0, mainMeter.current - mainMeter.previous);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 print-break-inside-avoid transition-colors duration-200">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('meter_readings')}</h2>
        </div>
        <button
          onClick={handleAdd}
          className="no-print flex items-center gap-1 text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">{t('add_meter')}</span><span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Main Meter Card - Modern Gradient */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl border border-indigo-400/30 hover:shadow-lg transition-all relative group shadow-md text-white">
           {/* Card Header */}
           <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                 <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                    <Lock className="w-4 h-4 text-white" />
                 </div>
                 <span className="font-bold text-white text-sm uppercase tracking-wide opacity-90">{t('main_meter')}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10 shadow-sm">
                 <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                 <span className="text-xs font-bold text-white">{mainMeterUnits}</span>
              </div>
           </div>
           
           {/* Inputs Grid */}
           <div className="space-y-3">
              {/* Meter No */}
              <div>
                 <label className="block text-[10px] font-bold text-indigo-100 uppercase mb-1 flex items-center gap-1 opacity-80">
                    {t('meter_no')} <Hash className="w-3 h-3" />
                 </label>
                 <input
                    type="text"
                    value={mainMeter.meterNo}
                    onChange={(e) => handleMainMeterChange('meterNo', e.target.value)}
                    onFocus={handleFocus}
                    className="w-full rounded-lg border-white/20 bg-white/10 focus:bg-white/20 text-sm text-white placeholder-indigo-200 focus:border-white focus:ring-1 focus:ring-white transition-all outline-none"
                    placeholder="#"
                 />
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="block text-[10px] font-bold text-indigo-100 uppercase mb-1 flex items-center gap-1 opacity-80">
                       {t('previous')} <History className="w-3 h-3" />
                    </label>
                    <div className="relative">
                      <input
                         type="number"
                         value={mainMeter.previous}
                         onChange={(e) => handleMainMeterChange('previous', parseFloat(e.target.value) || 0)}
                         onFocus={handleFocus}
                         className="w-full rounded-lg border-white/20 bg-white/10 focus:bg-white/20 text-sm text-white placeholder-indigo-200 focus:border-white focus:ring-1 focus:ring-white transition-all outline-none text-right font-medium pr-8"
                      />
                      <button 
                        onClick={() => startScan('main', 'previous')}
                        className="absolute right-1.5 top-1.5 p-1 text-indigo-200 hover:text-white transition-colors"
                        title={t('scan_meter')}
                      >
                         <Camera className="w-4 h-4" />
                      </button>
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-indigo-100 uppercase mb-1 flex items-center gap-1 opacity-80">
                       {t('current')} <Gauge className="w-3 h-3" />
                    </label>
                    <div className="relative">
                      <input
                         type="number"
                         value={mainMeter.current}
                         onChange={(e) => handleMainMeterChange('current', parseFloat(e.target.value) || 0)}
                         onFocus={handleFocus}
                         className="w-full rounded-lg border-white/20 bg-white/10 focus:bg-white/20 text-sm text-white placeholder-indigo-200 focus:border-white focus:ring-1 focus:ring-white transition-all outline-none font-bold text-right pr-8"
                      />
                      <button 
                        onClick={() => startScan('main', 'current')}
                        className="absolute right-1.5 top-1.5 p-1 text-indigo-200 hover:text-white transition-colors"
                        title={t('scan_meter')}
                      >
                         <Camera className="w-4 h-4" />
                      </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Empty State */}
        {readings.length === 0 && (
           <div className="col-span-1 md:col-span-1 lg:col-span-2 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm mb-3">
                 <Zap className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('no_meters_title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 mb-4 max-w-xs">{t('no_meters_desc')}</p>
              <button onClick={handleAdd} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                 {t('add_first_meter')}
              </button>
           </div>
        )}

        {/* Sub Meter Cards */}
        {readings.map((reading) => {
             const units = Math.max(0, reading.current - reading.previous);
             const matchedTenant = tenants.find(t => t.name === reading.name);
             const usagePercent = maxUnits > 0 ? (units / maxUnits) * 100 : 0;
             
             return (
               <div key={reading.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors relative group shadow-sm hover:shadow-md">
                  {/* Remove Button (Absolute top right) */}
                  <button
                      onClick={() => handleRemove(reading.id)}
                      className="absolute top-3 right-3 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                      title={t('remove_meter')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  {/* Header: Name Input with Datalist */}
                  <div className="mb-4 pr-6">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                          {t('user_name')} <Users className="w-3 h-3" />
                        </label>
                        {onManageTenants && (
                           <button onClick={onManageTenants} className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5" title={t('tenant_manager')}>
                             <Settings className="w-3 h-3" /> Manage
                           </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={reading.name}
                        onChange={(e) => handleChange(reading.id, 'name', e.target.value)}
                        onFocus={handleFocus}
                        list={`tenants-${reading.id}`}
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-950"
                        placeholder="Name or Select Tenant"
                      />
                      <datalist id={`tenants-${reading.id}`}>
                        {tenants.map(tenant => (
                            <option key={tenant.id} value={tenant.name}>{tenant.phone || tenant.email || 'Saved Tenant'}</option>
                        ))}
                      </datalist>
                      
                      {/* Matched Tenant Info */}
                      {matchedTenant && (
                        <div className="mt-1 pl-1 flex flex-col gap-0.5">
                           {matchedTenant.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                 <Phone className="w-3 h-3 text-indigo-500" /> {matchedTenant.phone}
                              </div>
                           )}
                           {matchedTenant.email && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                 <Mail className="w-3 h-3 text-indigo-500" /> {matchedTenant.email}
                              </div>
                           )}
                        </div>
                      )}
                  </div>
                  
                  {/* Inputs Grid */}
                  <div className="space-y-3 relative z-0">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
                            {t('meter_no')} <Hash className="w-3 h-3" />
                        </label>
                        <input
                            type="text"
                            value={reading.meterNo}
                            onChange={(e) => handleChange(reading.id, 'meterNo', e.target.value)}
                            onFocus={handleFocus}
                            className="w-full rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                            placeholder="#"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
                                {t('previous')} <History className="w-3 h-3" />
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={reading.previous}
                                    onChange={(e) => handleChange(reading.id, 'previous', parseFloat(e.target.value) || 0)}
                                    onFocus={handleFocus}
                                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-right font-medium pr-8"
                                />
                                <button 
                                  onClick={() => startScan(reading.id, 'previous')}
                                  className="absolute right-1.5 top-1.5 p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                  title={t('scan_meter')}
                                >
                                  <Camera className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
                                {t('current')} <Gauge className="w-3 h-3" />
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={reading.current}
                                    onChange={(e) => handleChange(reading.id, 'current', parseFloat(e.target.value) || 0)}
                                    onFocus={handleFocus}
                                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-right pr-8"
                                />
                                <button 
                                  onClick={() => startScan(reading.id, 'current')}
                                  className="absolute right-1.5 top-1.5 p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                  title={t('scan_meter')}
                                >
                                  <Camera className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                      </div>
                  </div>

                  {/* Visual Consumption Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('consumption')}</span>
                       <div className={`flex items-center gap-1 text-xs font-bold ${units > 100 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                          {units} <span className="text-[10px] font-normal opacity-80 text-slate-400">kWh</span>
                       </div>
                     </div>
                     <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${units > 100 ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        ></div>
                     </div>
                  </div>
               </div>
             );
        })}

        {/* Total Summary Card */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-slate-900 dark:bg-black p-4 rounded-xl text-white flex justify-between items-center shadow-md border border-slate-700">
            <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-sm uppercase tracking-wider">{t('total_user_units')}</span>
            </div>
            <div className="text-2xl font-bold font-mono">
                {totalUnits} <span className="text-sm font-normal text-slate-400">kWh</span>
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

export default MeterReadings;
