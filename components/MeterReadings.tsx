import React from 'react';
import { MeterReading } from '../types';
import { Users, Trash2, Plus, Zap, Lock } from 'lucide-react';

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
          className="no-print flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Meter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[600px]">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
            <tr>
              <th className="px-4 py-3 font-medium rounded-l-lg">Meter Name</th>
              <th className="px-4 py-3 font-medium">Meter No</th>
              <th className="px-4 py-3 font-medium text-right">Previous</th>
              <th className="px-4 py-3 font-medium text-right">Current</th>
              <th className="px-4 py-3 font-medium text-right">Units (kWh)</th>
              <th className="px-4 py-3 font-medium text-center no-print rounded-r-lg">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Main Meter Row */}
            <tr className="bg-indigo-50/30">
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                   <Lock className="w-3 h-3 text-slate-400" />
                   <span className="font-semibold text-slate-900">Main Meter</span>
                </div>
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={mainMeter.meterNo}
                  onChange={(e) => handleMainMeterChange('meterNo', e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-600 p-0"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={mainMeter.previous}
                  onChange={(e) => handleMainMeterChange('previous', parseFloat(e.target.value) || 0)}
                  className="w-full text-right bg-transparent border-b border-indigo-200 focus:border-indigo-500 focus:ring-0 p-1"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={mainMeter.current}
                  onChange={(e) => handleMainMeterChange('current', parseFloat(e.target.value) || 0)}
                  className="w-full text-right bg-transparent border-b border-indigo-200 focus:border-indigo-500 focus:ring-0 p-1 font-medium"
                />
              </td>
              <td className="px-4 py-2 text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                  {mainMeterUnits}
                </span>
              </td>
              <td className="px-4 py-2 text-center no-print">
                 {/* No delete for main meter */}
              </td>
            </tr>

            {/* Separator Row (Optional) */}
            <tr><td colSpan={6} className="h-2 bg-transparent"></td></tr>

            {/* Sub Meters */}
            {readings.map((reading) => {
              const units = Math.max(0, reading.current - reading.previous);
              return (
                <tr key={reading.id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={reading.name}
                      onChange={(e) => handleChange(reading.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 font-medium text-slate-900 placeholder-slate-400 p-0"
                      placeholder="User Name"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={reading.meterNo}
                      onChange={(e) => handleChange(reading.id, 'meterNo', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 text-slate-600 p-0"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={reading.previous}
                      onChange={(e) => handleChange(reading.id, 'previous', parseFloat(e.target.value) || 0)}
                      className="w-full text-right bg-transparent border-b border-transparent focus:border-indigo-300 focus:ring-0 p-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={reading.current}
                      onChange={(e) => handleChange(reading.id, 'current', parseFloat(e.target.value) || 0)}
                      className="w-full text-right bg-transparent border-b border-transparent focus:border-indigo-300 focus:ring-0 p-1 font-medium"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${units > 100 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                      {units}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center no-print">
                    <button
                      onClick={() => handleRemove(reading.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Remove meter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 font-semibold text-slate-900 border-t border-slate-200">
            <tr>
              <td colSpan={4} className="px-4 py-3 text-right uppercase text-xs tracking-wider">Total Units (Users)</td>
              <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {totalUnits}
              </td>
              <td className="no-print"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default MeterReadings;