
import React from 'react';
import { SavedBill } from '../types';
import { History, RotateCcw, Trash2, Calendar } from 'lucide-react';

interface BillHistoryProps {
  history: SavedBill[];
  onLoad: (bill: SavedBill) => void;
  onDelete: (id: string) => void;
}

const BillHistory: React.FC<BillHistoryProps> = ({ history, onLoad, onDelete }) => {
  if (history.length === 0) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-'); // Expecting yyyy-mm-dd
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    return `${parseInt(day)}/${parseInt(month)}/${year.slice(-2)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 print-break-inside-avoid no-print">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
        <History className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-800">Bill History</h2>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {history.map((bill) => (
          <div key={bill.id} className="group p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-slate-800">{bill.config.month}</h4>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(bill.config.dateGenerated)}
                </div>
              </div>
              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                ৳{bill.config.totalBillPayable}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => onLoad(bill)}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-700 py-1.5 rounded hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Restore
              </button>
              <button
                onClick={() => onDelete(bill.id)}
                className="flex items-center justify-center gap-1.5 text-xs font-medium bg-white border border-slate-200 text-red-600 py-1.5 px-3 rounded hover:bg-red-50 hover:border-red-200 transition-colors"
                title="Delete Record"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <div className="text-[10px] text-slate-400 text-right mt-1">
              Saved: {new Date(bill.savedAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillHistory;
