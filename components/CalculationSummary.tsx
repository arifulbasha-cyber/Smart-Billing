
import React, { useRef, useState } from 'react';
import { BillCalculationResult, BillConfig, MeterReading } from '../types';
import { FileText, Printer, Image as ImageIcon, Save, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface CalculationSummaryProps {
  result: BillCalculationResult;
  config: BillConfig;
  mainMeter: MeterReading;
  meters: MeterReading[];
  onSaveHistory: () => void;
}

const CalculationSummary: React.FC<CalculationSummaryProps> = ({ result, config, mainMeter, meters, onSaveHistory }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveImage = async () => {
    if (!reportRef.current) return;
    
    try {
      setIsGeneratingImage(true);
      
      // Clone the element to render it in a "desktop" width container
      const element = reportRef.current;
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Setup container to simulate desktop view off-screen
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '1024px'; // Force desktop width
      container.style.backgroundColor = '#ffffff';
      
      // Append clone to container and container to body
      container.appendChild(clone);
      document.body.appendChild(container);

      // Wait for rendering to settle
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Generate canvas from the desktop-width clone
      const canvas = await html2canvas(clone, {
        scale: 2, // High resolution
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        width: 1024,
        windowWidth: 1024 // Simulate desktop window
      });
      
      // Clean up DOM
      document.body.removeChild(container);
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `TMSS-Bill-${config.month}-${config.dateGenerated}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate image", error);
      alert("Failed to save image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-'); // Expecting yyyy-mm-dd
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    return `${parseInt(day)}/${parseInt(month)}/${year.slice(-2)}`;
  };

  const mainMeterUnits = Math.max(0, mainMeter.current - mainMeter.previous);

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:m-0 print:p-0 w-full">
       {/* Actions Bar (No Print) */}
       <div className="bg-slate-50/80 backdrop-blur px-6 py-4 border-b border-slate-200 flex flex-wrap gap-3 justify-between items-center no-print">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
             <FileText className="w-5 h-5 text-indigo-600" /> Bill Report
          </h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={onSaveHistory}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 px-3 py-2 rounded-lg transition-colors shadow-sm"
              title="Save to History"
            >
               <Save className="w-4 h-4" /> <span className="sm:hidden lg:inline">Save</span>
            </button>
            <button 
              onClick={handleSaveImage} 
              disabled={isGeneratingImage}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 px-3 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              title="Save as Image"
            >
               {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />} 
               <span className="sm:hidden lg:inline">Image</span>
            </button>
            <button 
              onClick={handlePrint} 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
               <Printer className="w-4 h-4" /> <span className="sm:hidden lg:inline">Print</span>
            </button>
          </div>
       </div>

       {/* Printable Content */}
       <div ref={reportRef} className="p-4 sm:p-8 space-y-8 print:p-0 print:space-y-6 bg-white min-h-[500px] print:min-h-0">
          
          {/* 1. Header */}
          <div className="text-center border-b-2 border-slate-800 pb-6 print:pb-4">
             <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 uppercase tracking-widest mb-4 print:text-2xl print:mb-2">TMSS House Electricity Bill</h1>
             <div className="flex justify-between max-w-2xl mx-auto text-sm font-medium text-slate-600 pt-2 px-2 sm:px-4">
                <div className="flex flex-col items-start">
                   <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Bill Month</span>
                   <span className="text-slate-900 text-lg print:text-base">{config.month}</span>
                </div>
                 <div className="flex flex-col items-end">
                   <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Date Generated</span>
                   <span className="text-slate-900 text-lg print:text-base">{formatDate(config.dateGenerated)}</span>
                </div>
             </div>
          </div>

          {/* 2. Costs Configuration (Two Column Grid) */}
          <div>
             <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-2 mb-2 tracking-tight flex items-center gap-2">
                Costs Configuration
             </h3>
             <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                 <div className="flex justify-between items-baseline">
                    <span className="text-slate-600">Total Bill Payable</span>
                    <span className="font-bold text-slate-900">{config.totalBillPayable}</span>
                 </div>
                 <div className="flex justify-between items-baseline">
                    <span className="text-slate-600">Calculated Rate/Unit</span>
                    <span className="font-bold text-indigo-600 print:text-slate-900">{result.calculatedRate.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-baseline">
                    <span className="text-slate-600">Demand Charge</span>
                    <span className="font-medium text-slate-900">{config.demandCharge}</span>
                 </div>
                 <div className="flex justify-between items-baseline">
                    <span className="text-slate-600">Meter Rent</span>
                    <span className="font-medium text-slate-900">{config.meterRent}</span>
                 </div>
                 <div className="flex justify-between items-baseline">
                    <div className="flex items-baseline gap-2">
                        <span className="text-slate-600">VAT (Total)</span>
                        <span className="text-[10px] text-slate-400 italic font-normal print:text-[9px] hidden sm:inline">Unit Uses Bill+Demand+Rent*5%</span>
                    </div>
                    <span className="font-medium text-slate-900">{result.vatTotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-baseline">
                    <div className="flex items-baseline gap-2">
                        <span className="text-slate-600">VAT Distributed</span>
                        <span className="text-[10px] text-slate-400 italic font-normal print:text-[9px] hidden sm:inline">Unit Uses Bill*5%</span>
                    </div>
                    <span className="font-medium text-slate-900">{result.vatDistributed.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-baseline">
                    <div className="flex items-baseline gap-2">
                        <span className="text-slate-600">VAT Fixed</span>
                        <span className="text-[10px] text-slate-400 italic font-normal print:text-[9px] hidden sm:inline">Demand+Rent*5%</span>
                    </div>
                    <span className="font-medium text-slate-900">{result.vatFixed.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-baseline">
                    <span className="text-slate-600">bKash Fee</span>
                    <span className="font-medium text-slate-900">{config.bkashFee || '-'}</span>
                 </div>
             </div>
          </div>

          {/* 3. Meter Readings */}
          <div>
             <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-2 mb-4 tracking-tight flex items-center gap-2">
                Meter Readings
             </h3>
             <div className="overflow-x-auto rounded-lg border border-slate-200 print:border-slate-300">
               <table className="w-full text-sm min-w-[500px]">
                  <thead className="bg-slate-50 print:bg-slate-100">
                     <tr className="text-slate-500 text-xs uppercase">
                        <th className="px-4 py-3 font-semibold text-left">Meter Name</th>
                        <th className="px-4 py-3 font-semibold text-center">Meter No</th>
                        <th className="px-4 py-3 font-semibold text-right">Previous</th>
                        <th className="px-4 py-3 font-semibold text-right">Current</th>
                        <th className="px-4 py-3 font-semibold text-right">Units (kWh)</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 print:divide-slate-200">
                     {/* Main Meter */}
                     <tr className="bg-slate-50/50 font-medium">
                        <td className="px-4 py-2 text-slate-800">{mainMeter.name}</td>
                        <td className="px-4 py-2 text-center text-slate-600">{mainMeter.meterNo}</td>
                        <td className="px-4 py-2 text-right text-slate-600">{mainMeter.previous}</td>
                        <td className="px-4 py-2 text-right text-slate-600">{mainMeter.current}</td>
                        <td className="px-4 py-2 text-right font-bold text-slate-900">{mainMeterUnits}</td>
                     </tr>
                     
                     {/* Sub Meters */}
                     {meters.map((m) => {
                        const units = Math.max(0, m.current - m.previous);
                        return (
                           <tr key={m.id}>
                              <td className="px-4 py-2 font-medium text-slate-700">{m.name}</td>
                              <td className="px-4 py-2 text-center text-slate-500">{m.meterNo}</td>
                              <td className="px-4 py-2 text-right text-slate-600">{m.previous}</td>
                              <td className="px-4 py-2 text-right text-slate-600">{m.current}</td>
                              <td className="px-4 py-2 text-right font-semibold text-slate-900">{units}</td>
                           </tr>
                        );
                     })}
                     <tr className="bg-slate-800 font-bold text-white border-t border-slate-700 print:bg-slate-800 print:text-white print:border-slate-800 h-12 leading-none">
                        <td colSpan={4} className="px-4 text-right uppercase text-xs tracking-wider text-slate-300 whitespace-nowrap align-middle" style={{ verticalAlign: 'middle' }}>Total Units</td>
                        <td className="px-4 text-right align-middle py-3" style={{ verticalAlign: 'middle' }}>
                           {result.totalUnits}
                        </td>
                     </tr>
                  </tbody>
               </table>
             </div>
          </div>

          {/* 4. Final Split Calculation */}
          <div>
             <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-2 mb-4 tracking-tight">Final Split Calculation</h3>
             <div className="overflow-x-auto rounded-lg border border-slate-200 print:border-slate-300">
               <table className="w-full text-sm min-w-[500px]">
                  <thead className="bg-slate-50 print:bg-slate-100">
                     <tr className="text-slate-500 text-xs uppercase">
                        <th className="px-4 py-3 font-semibold text-left">User</th>
                        <th className="px-4 py-3 font-semibold text-right">Units Used</th>
                        <th className="px-4 py-3 font-semibold text-right">Energy Cost</th>
                        <th className="px-4 py-3 font-semibold text-right">Fixed Costs</th>
                        <th className="px-4 py-3 font-semibold text-right text-indigo-700 print:text-black">Total Payable</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 print:divide-slate-200">
                     {result.userCalculations.map((user) => (
                        <tr key={user.id}>
                           <td className="px-4 py-2 font-medium text-slate-700">{user.name}</td>
                           <td className="px-4 py-2 text-right text-slate-600">{user.unitsUsed}</td>
                           <td className="px-4 py-2 text-right text-slate-600">{Math.round(user.energyCost)}</td>
                           <td className="px-4 py-2 text-right text-slate-600">{Math.round(user.fixedCost)}</td>
                           <td className="px-4 py-2 text-right font-bold text-indigo-700 text-base print:text-black">{Math.round(user.totalPayable)}</td>
                        </tr>
                     ))}
                     <tr className="bg-slate-800 font-bold text-white border-t border-slate-700 print:bg-slate-800 print:text-white print:border-slate-800 h-12 leading-none">
                        <td colSpan={4} className="px-4 text-right uppercase text-xs tracking-wider text-slate-300 whitespace-nowrap align-middle" style={{ verticalAlign: 'middle' }}>
                            Total Collection
                        </td>
                        <td className="px-4 text-right text-white print:text-white align-middle py-3" style={{ verticalAlign: 'middle' }}>{Math.round(result.totalCollection)}</td>
                     </tr>
                  </tbody>
               </table>
             </div>
          </div>
       </div>
    </div>
  );
};

export default CalculationSummary;
