import React from 'react';
import { MeterReading } from '../types';
import { Users, Trash2, Plus, Zap, Lock, Hash, History, Gauge } from 'lucide-react';

interface MeterReadingsProps {
  mainMeter: MeterReading;
  onMainMeterUpdate: (reading: MeterReading) => void;
  readings: MeterReading[];
  onUpdate: (readings: MeterReading[]) => void;
}

const MeterReadings: React.FC<MeterReadingsProps> = ({ mainMeter, onMainMeterUpdate, readings, onUpdate }) => {
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

  const totalUnits = readings.reduce((sum, r) => sum + (r.current - r.previous), 0);
  const mainMeterUnits = Math.max(0, mainMeter.current - mainMeter.previous);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 print-break-inside-avoid">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-800">Meter Readings</h2>
        </div>
        <button
          onClick={handleAdd}
          className="no-print flex items-center gap-1 text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Meter</span><span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Main Meter Card */}
        <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100 hover:border-indigo-200 transition-colors relative group shadow-sm">
           {/* Card Header */}
           <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                 <div className="bg-indigo-100 p-1.5 rounded-lg">
                    <Lock className="w-4 h-4 text-indigo-600" />
                 </div>
                 <span className="font-bold text-slate-900 text-sm uppercase">Main Meter</span>
              </div>
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-indigo-100 shadow-sm">
                 <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                 <span className="text-xs font-bold text-slate-900">{mainMeterUnits}</span>
              </div>
           </div>
           
           {/* Inputs Grid */}
           <div className="space-y-3">
              {/* Meter No */}
              <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                    Meter No <Hash className="w-3 h-3" />
                 </label>
                 <input
                    type="text"
                    value={mainMeter.meterNo}
                    onChange={(e) => handleMainMeterChange('meterNo', e.target.value)}
                    onFocus={handleFocus}
                    className="w-full rounded-lg border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white text-slate-900"
                    placeholder="#"
                 />
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                       Previous <History className="w-3 h-3" />
                    </label>
                    <input
                       type="number"
                       value={mainMeter.previous}
                       onChange={(e) => handleMainMeterChange('previous', parseFloat(e.target.value) || 0)}
                       onFocus={handleFocus}
                       className="w-full rounded-lg border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white text-slate-900 text-right font-medium"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                       Current <Gauge className="w-3 h-3" />
                    </label>
                    <input
                       type="number"
                       value={mainMeter.current}
                       onChange={(e) => handleMainMeterChange('current', parseFloat(e.target.value) || 0)}
                       onFocus={handleFocus}
                       className="w-full rounded-lg border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white text-slate-900 font-bold text-right"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Sub Meter Cards */}
        {readings.map((reading) => {
             const units = Math.max(0, reading.current - reading.previous);
             return (
               <div key={reading.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors relative group shadow-sm hover:shadow-md">
                  {/* Remove Button (Absolute top right) */}
                  <button
                      onClick={() => handleRemove(reading.id)}
                      className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Remove meter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  {/* Header: Name Input */}
                  <div className="mb-4 pr-6">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                        User Name <Users className="w-3 h-3" />
                      </label>
                      <input
                        type="text"
                        value={reading.name}
                        onChange={(e) => handleChange(reading.id, 'name', e.target.value)}
                        onFocus={handleFocus}
                        className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm font-bold text-slate-900 bg-white"
                        placeholder="Name"
                      />
                  </div>
                  
                  {/* Inputs Grid */}
                  <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                            Meter No <Hash className="w-3 h-3" />
                        </label>
                        <input
                            type="text"
                            value={reading.meterNo}
                            onChange={(e) => handleChange(reading.id, 'meterNo', e.target.value)}
                            onFocus={handleFocus}
                            className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white text-slate-900"
                            placeholder="#"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                Previous <History className="w-3 h-3" />
                            </label>
                            <input
                                type="number"
                                value={reading.previous}
                                onChange={(e) => handleChange(reading.id, 'previous', parseFloat(e.target.value) || 0)}
                                onFocus={handleFocus}
                                className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white text-slate-900 text-right font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                Current <Gauge className="w-3 h-3" />
                            </label>
                            <input
                                type="number"
                                value={reading.current}
                                onChange={(e) => handleChange(reading.id, 'current', parseFloat(e.target.value) || 0)}
                                onFocus={handleFocus}
                                className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white text-slate-900 font-bold text-right"
                            />
                        </div>
                      </div>
                  </div>

                  {/* Footer Stats */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consumption</span>
                     <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${units > 100 ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}`}>
                        {units} <span className="text-[10px] font-normal opacity-80">kWh</span>
                     </div>
                  </div>
               </div>
             );
        })}

        {/* Total Summary Card */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-slate-900 p-4 rounded-xl text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-sm uppercase tracking-wider">Total User Units</span>
            </div>
            <div className="text-2xl font-bold font-mono">
                {totalUnits} <span className="text-sm font-normal text-slate-400">kWh</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MeterReadings;