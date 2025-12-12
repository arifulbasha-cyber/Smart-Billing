import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { FileText, Printer, Image as ImageIcon, Save, Loader2, X, FileDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../i18n';
const CalculationSummary = ({ result, config, mainMeter, meters, onSaveHistory, tariffConfig, isHistorical = false, onClose }) => {
    const { t, formatNumber, translateMonth, formatDateLocalized } = useLanguage();
    const reportRef = useRef(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    // Use Dynamic Config
    const DEMAND_CHARGE = tariffConfig.demandCharge;
    const METER_RENT = tariffConfig.meterRent;
    const VAT_RATE_PCT = tariffConfig.vatRate * 100;
    const handlePrint = () => {
        window.print();
    };
    const getCaptureCanvas = async (scale = 3) => {
        if (!reportRef.current)
            return null;
        // Clone the element to render it in a "tablet" width container
        const element = reportRef.current;
        const clone = element.cloneNode(true);
        // Helper to bump text size classes for the export
        const bumpTextSize = (el) => {
            const classMap = {
                'text-[10px]': 'text-sm',
                'text-xs': 'text-base',
                'text-sm': 'text-lg',
                'text-base': 'text-xl',
                'text-lg': 'text-2xl',
                'text-xl': 'text-3xl',
                'text-2xl': 'text-4xl',
                'text-3xl': 'text-5xl',
                'sm:text-xs': 'sm:text-base',
                'sm:text-sm': 'sm:text-lg',
                'sm:text-base': 'sm:text-xl',
            };
            const classes = el.className.split(' ');
            const newClasses = classes.map(c => classMap[c] || c);
            el.className = newClasses.join(' ');
        };
        const allElements = clone.querySelectorAll('*');
        allElements.forEach(node => {
            if (node instanceof HTMLElement)
                bumpTextSize(node);
        });
        bumpTextSize(clone);
        // Force styles for export
        const scrollables = clone.querySelectorAll('.overflow-x-auto');
        scrollables.forEach(el => {
            el.style.overflow = 'visible';
            el.style.display = 'block';
        });
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = '768px';
        // For images/PDF we usually want a clean white look, regardless of current theme
        container.style.backgroundColor = '#ffffff';
        // Remove dark mode classes from clone
        clone.classList.remove('dark');
        const allDark = clone.querySelectorAll('.dark');
        allDark.forEach(el => el.classList.remove('dark'));
        // Force text colors to dark for white background
        const allText = clone.querySelectorAll('*');
        allText.forEach(el => {
            if (el instanceof HTMLElement) {
                if (el.classList.contains('text-white')) {
                    el.classList.remove('text-white');
                    el.classList.add('text-slate-900');
                }
                if (el.classList.contains('text-slate-200') || el.classList.contains('text-slate-300')) {
                    el.classList.remove('text-slate-200', 'text-slate-300');
                    el.classList.add('text-slate-600');
                }
            }
        });
        container.appendChild(clone);
        document.body.appendChild(container);
        await new Promise(resolve => setTimeout(resolve, 150));
        const canvas = await html2canvas(clone, {
            scale: scale,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
            width: 768,
            windowWidth: 768
        });
        document.body.removeChild(container);
        return canvas;
    };
    const handleSaveImage = async () => {
        try {
            setIsGeneratingImage(true);
            const canvas = await getCaptureCanvas(3);
            if (!canvas)
                return;
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `TMSS-Bill-${config.month}-${config.dateGenerated}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        catch (error) {
            console.error("Failed to generate image", error);
            alert("Failed to save image. Please try again.");
        }
        finally {
            setIsGeneratingImage(false);
        }
    };
    const handleSavePDF = async () => {
        try {
            setIsGeneratingPdf(true);
            // Use lower scale for PDF to keep file size reasonable, usually 2 is plenty for A4
            const canvas = await getCaptureCanvas(2);
            if (!canvas)
                return;
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
            pdf.save(`TMSS-Bill-${config.month}-${config.dateGenerated}.pdf`);
        }
        catch (error) {
            console.error("Failed to generate PDF", error);
            alert("Failed to save PDF. Please try again.");
        }
        finally {
            setIsGeneratingPdf(false);
        }
    };
    const mainMeterUnits = Math.max(0, mainMeter.current - mainMeter.previous);
    // Helper to strip leading zeros
    const formatMeterDisplay = (val) => {
        const num = parseInt(val);
        return isNaN(num) ? val : num.toString();
    };
    return (_jsxs("div", { className: "bg-white dark:bg-slate-900 shadow-xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none print:m-0 print:p-0 w-full transition-colors duration-200", children: [_jsxs("div", { className: "bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-3 justify-between items-center no-print", children: [_jsxs("h2", { className: "font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 text-sm sm:text-base", children: [_jsx(FileText, { className: "w-5 h-5 text-indigo-600 dark:text-indigo-400" }), " ", t('bill_report'), " ", isHistorical && _jsx("span", { className: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full ml-2", children: "Viewing History" })] }), _jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [onClose && isHistorical && (_jsxs("button", { onClick: onClose, className: "flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors shadow-sm", children: [_jsx(X, { className: "w-4 h-4" }), " ", _jsx("span", { className: "sm:hidden lg:inline", children: t('cancel') })] })), !isHistorical && (_jsxs("button", { onClick: onSaveHistory, className: "flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg transition-colors shadow-sm", title: t('save_history'), children: [_jsx(Save, { className: "w-4 h-4" }), " ", _jsx("span", { className: "sm:hidden lg:inline", children: t('save_history') })] })), _jsxs("button", { onClick: handleSaveImage, disabled: isGeneratingImage || isGeneratingPdf, className: "flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50", title: `${t('save_image')} (Tablet View)`, children: [isGeneratingImage ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : _jsx(ImageIcon, { className: "w-4 h-4" }), _jsx("span", { className: "sm:hidden lg:inline", children: t('save_image') })] }), _jsxs("button", { onClick: handleSavePDF, disabled: isGeneratingImage || isGeneratingPdf, className: "flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50", title: "Save as PDF", children: [isGeneratingPdf ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : _jsx(FileDown, { className: "w-4 h-4" }), _jsx("span", { className: "sm:hidden lg:inline", children: "PDF" })] }), _jsxs("button", { onClick: handlePrint, className: "flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm", children: [_jsx(Printer, { className: "w-4 h-4" }), " ", _jsx("span", { className: "sm:hidden lg:inline", children: t('print') })] })] })] }), _jsxs("div", { ref: reportRef, className: "p-4 sm:p-8 space-y-6 sm:space-y-8 print:p-0 print:space-y-6 bg-white dark:bg-slate-900 min-h-[500px] print:min-h-0 transition-colors duration-200", children: [_jsxs("div", { className: "text-center border-b-2 border-slate-800 dark:border-slate-100 pb-4 sm:pb-6 print:pb-4", children: [_jsx("h1", { className: "text-xl sm:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2 sm:mb-4 print:text-2xl print:mb-2", children: t('tmss_house_bill') }), _jsxs("div", { className: "flex justify-between max-w-2xl mx-auto text-sm font-medium text-slate-600 dark:text-slate-300 pt-2 px-1 sm:px-4", children: [_jsxs("div", { className: "flex flex-col items-start", children: [_jsx("span", { className: "text-[10px] sm:text-xs uppercase text-slate-400 dark:text-slate-500 font-bold tracking-wider", children: t('bill_month') }), _jsx("span", { className: "text-slate-900 dark:text-white text-base sm:text-lg print:text-base", children: translateMonth(config.month) })] }), _jsxs("div", { className: "flex flex-col items-end", children: [_jsx("span", { className: "text-[10px] sm:text-xs uppercase text-slate-400 dark:text-slate-500 font-bold tracking-wider", children: t('date_generated') }), _jsx("span", { className: "text-slate-900 dark:text-white text-base sm:text-lg print:text-base", children: formatDateLocalized(config.dateGenerated) })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-bold text-slate-900 dark:text-white uppercase border-b border-slate-200 dark:border-slate-700 pb-2 mb-2 tracking-tight flex items-center gap-2", children: t('costs_configuration') }), _jsxs("div", { className: "text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-slate-900 dark:text-slate-200", children: [_jsxs("div", { className: "flex justify-between items-baseline", children: [_jsx("span", { className: "text-slate-600 dark:text-slate-400", children: t('total_bill_payable') }), _jsx("span", { className: "font-bold", children: formatNumber(config.totalBillPayable) })] }), _jsxs("div", { className: "flex justify-between items-baseline", children: [_jsx("span", { className: "text-slate-600 dark:text-slate-400", children: t('calculated_rate') }), _jsx("span", { className: "font-bold text-indigo-600 dark:text-indigo-400 print:text-slate-900", children: formatNumber(result.calculatedRate.toFixed(2)) })] }), _jsxs("div", { className: "flex justify-between items-baseline", children: [_jsx("span", { className: "text-slate-600 dark:text-slate-400", children: t('demand_charge') }), _jsx("span", { className: "font-medium", children: formatNumber(DEMAND_CHARGE) })] }), _jsxs("div", { className: "flex justify-between items-baseline", children: [_jsx("span", { className: "text-slate-600 dark:text-slate-400", children: t('meter_rent') }), _jsx("span", { className: "font-medium", children: formatNumber(METER_RENT) })] }), _jsxs("div", { className: "flex justify-between items-baseline", children: [_jsxs("div", { className: "flex items-baseline gap-2", children: [_jsx("span", { className: "text-slate-600 dark:text-slate-400", children: t('vat_total') }), _jsx("span", { className: "text-[10px] text-slate-400 dark:text-slate-600 italic font-normal print:text-[9px] hidden sm:inline", children: t('vat_desc_1').replace('5%', `${formatNumber(VAT_RATE_PCT)}%`) })] }), _jsx("span", { className: "font-medium", children: formatNumber(Math.round(result.vatTotal)) })] }), _jsxs("div", { className: "flex justify-between items-baseline", children: [_jsxs("div", { className: "flex items-baseline gap-2", children: [_jsx("span", { className: "text-slate-600 dark:text-slate-400", children: t('vat_distributed') }), _jsx("span", { className: "text-[10px] text-slate-400 dark:text-slate-600 italic font-normal print:text-[9px] hidden sm:inline", children: t('vat_desc_2').replace('5%', `${formatNumber(VAT_RATE_PCT)}%`) })] }), _jsx("span", { className: "font-medium", children: formatNumber(result.vatDistributed.toFixed(2)) })] }), _jsxs("div", { className: "flex justify-between items-baseline", children: [_jsxs("div", { className: "flex items-baseline gap-2", children: [_jsx("span", { className: "text-slate-600 dark:text-slate-400", children: t('vat_fixed') }), _jsx("span", { className: "text-[10px] text-slate-400 dark:text-slate-600 italic font-normal print:text-[9px] hidden sm:inline", children: t('vat_desc_3').replace('5%', `${formatNumber(VAT_RATE_PCT)}%`) })] }), _jsx("span", { className: "font-medium", children: formatNumber(result.vatFixed.toFixed(2)) })] }), _jsxs("div", { className: "flex justify-between items-baseline", children: [_jsx("span", { className: "text-slate-600 dark:text-slate-400", children: t('bkash_fee') }), _jsx("span", { className: "font-medium", children: config.bkashFee ? formatNumber(config.bkashFee) : '-' })] }), _jsxs("div", { className: "flex justify-between items-baseline", children: [_jsx("span", { className: "text-slate-600 dark:text-slate-400", children: t('late_fee') }), _jsx("span", { className: "font-medium", children: result.lateFee > 0 ? formatNumber(Math.round(result.lateFee)) : '-' })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-bold text-slate-900 dark:text-white uppercase border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 tracking-tight flex items-center gap-2", children: t('meter_readings') }), _jsx("div", { className: "overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { className: "bg-slate-50 dark:bg-slate-800 print:bg-slate-100 text-[10px] sm:text-sm", children: _jsxs("tr", { className: "text-slate-500 dark:text-slate-400 uppercase", children: [_jsx("th", { className: "pl-2 pr-1 py-2 sm:px-4 sm:py-3 font-semibold text-left", children: t('name') }), _jsx("th", { className: "hidden sm:table-cell px-4 py-3 font-semibold text-center", children: t('meter_no') }), _jsx("th", { className: "px-1 py-2 sm:px-4 sm:py-3 font-semibold text-right", children: t('previous') }), _jsx("th", { className: "px-1 py-2 sm:px-4 sm:py-3 font-semibold text-right", children: t('current') }), _jsx("th", { className: "px-1 py-2 sm:px-4 sm:py-3 font-semibold text-right", children: t('unit') })] }) }), _jsxs("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-200 text-xs sm:text-sm", children: [_jsxs("tr", { className: "bg-slate-50/50 dark:bg-slate-800/30 font-medium", children: [_jsxs("td", { className: "pl-2 pr-1 py-2 sm:px-4 sm:py-2 text-slate-800 dark:text-slate-200", children: [t(mainMeter.name), _jsxs("div", { className: "sm:hidden text-[10px] text-slate-400 font-normal", children: ["Meter ", formatNumber(formatMeterDisplay(mainMeter.meterNo))] })] }), _jsx("td", { className: "hidden sm:table-cell px-4 py-2 text-center text-slate-600 dark:text-slate-400", children: formatNumber(mainMeter.meterNo) }), _jsx("td", { className: "px-1 py-2 sm:px-4 sm:py-2 text-right text-slate-600 dark:text-slate-400", children: formatNumber(mainMeter.previous) }), _jsx("td", { className: "px-1 py-2 sm:px-4 sm:py-2 text-right text-slate-600 dark:text-slate-400", children: formatNumber(mainMeter.current) }), _jsx("td", { className: "px-1 py-2 sm:px-4 sm:py-2 text-right font-bold text-slate-900 dark:text-white", children: formatNumber(mainMeterUnits) })] }), meters.map((m) => {
                                                    const units = Math.max(0, m.current - m.previous);
                                                    return (_jsxs("tr", { children: [_jsxs("td", { className: "pl-2 pr-1 py-2 sm:px-4 sm:py-2 font-medium text-slate-700 dark:text-slate-300", children: [t(m.name), _jsxs("div", { className: "sm:hidden text-[10px] text-slate-400 font-normal", children: ["Meter ", formatNumber(formatMeterDisplay(m.meterNo))] })] }), _jsx("td", { className: "hidden sm:table-cell px-4 py-2 text-center text-slate-500 dark:text-slate-400", children: formatNumber(m.meterNo) }), _jsx("td", { className: "px-1 py-2 sm:px-4 sm:py-2 text-right text-slate-600 dark:text-slate-400", children: formatNumber(m.previous) }), _jsx("td", { className: "px-1 py-2 sm:px-4 sm:py-2 text-right text-slate-600 dark:text-slate-400", children: formatNumber(m.current) }), _jsx("td", { className: "px-1 py-2 sm:px-4 sm:py-2 text-right font-semibold text-slate-900 dark:text-white", children: formatNumber(units) })] }, m.id));
                                                }), _jsxs("tr", { className: "bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white border-t-2 border-slate-200 dark:border-slate-700 print:bg-slate-50 print:text-slate-900 print:border-slate-300 h-12 leading-none", children: [_jsxs("td", { colSpan: 3, className: "pl-2 pr-1 sm:px-4 text-right uppercase text-[10px] sm:text-xs tracking-wider text-slate-600 dark:text-slate-400 whitespace-nowrap align-middle", style: { verticalAlign: 'middle' }, children: [_jsx("span", { className: "sm:hidden", children: t('total') }), _jsx("span", { className: "hidden sm:inline", children: t('total_user_units') })] }), _jsx("td", { colSpan: 2, className: "px-1 sm:px-4 text-right align-middle py-3", style: { verticalAlign: 'middle' }, children: formatNumber(result.totalUnits) })] })] })] }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-bold text-slate-900 dark:text-white uppercase border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 tracking-tight", children: t('final_split') }), _jsx("div", { className: "overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 print:border-slate-300", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { className: "bg-slate-50 dark:bg-slate-800 print:bg-slate-100 text-[10px] sm:text-sm", children: _jsxs("tr", { className: "text-slate-500 dark:text-slate-400 uppercase", children: [_jsx("th", { className: "pl-2 pr-1 py-2 sm:px-4 sm:py-3 font-semibold text-left", children: t('user') }), _jsx("th", { className: "px-1 py-2 sm:px-4 sm:py-3 font-semibold text-right", children: t('units') }), _jsxs("th", { className: "px-1 py-2 sm:px-4 sm:py-3 font-semibold text-right", children: [_jsx("span", { className: "sm:hidden", children: t('engy') }), _jsx("span", { className: "hidden sm:inline", children: t('energy_cost') })] }), _jsxs("th", { className: "px-1 py-2 sm:px-4 sm:py-3 font-semibold text-right", children: [_jsx("span", { className: "sm:hidden", children: t('fixed') }), _jsx("span", { className: "hidden sm:inline", children: t('fixed_cost') })] }), _jsx("th", { className: "pl-1 pr-2 py-2 sm:px-4 sm:py-3 font-semibold text-right text-indigo-700 dark:text-indigo-400 print:text-black", children: t('bill') })] }) }), _jsxs("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-200 text-xs sm:text-sm", children: [result.userCalculations.map((user) => (_jsxs("tr", { children: [_jsx("td", { className: "pl-2 pr-1 py-2 sm:px-4 sm:py-2 font-medium text-slate-700 dark:text-slate-300", children: t(user.name) }), _jsx("td", { className: "px-1 py-2 sm:px-4 sm:py-2 text-right text-slate-600 dark:text-slate-400", children: formatNumber(user.unitsUsed) }), _jsx("td", { className: "px-1 py-2 sm:px-4 sm:py-2 text-right text-slate-600 dark:text-slate-400", children: formatNumber(Math.round(user.energyCost)) }), _jsx("td", { className: "px-1 py-2 sm:px-4 sm:py-2 text-right text-slate-600 dark:text-slate-400", children: formatNumber(Math.round(user.fixedCost)) }), _jsx("td", { className: "pl-1 pr-2 py-2 sm:px-4 sm:py-2 text-right font-bold text-indigo-700 dark:text-indigo-400 text-sm sm:text-base print:text-black", children: formatNumber(Math.round(user.totalPayable)) })] }, user.id))), _jsxs("tr", { className: "bg-slate-900 dark:bg-black font-bold text-white border-t-2 border-slate-800 dark:border-slate-700 print:bg-slate-50 print:text-slate-900 print:border-slate-300 h-10 sm:h-12 leading-none", children: [_jsxs("td", { colSpan: 4, className: "pl-2 pr-1 sm:px-4 text-right uppercase text-[10px] sm:text-xs tracking-wider text-slate-300 dark:text-slate-500 whitespace-nowrap align-middle", style: { verticalAlign: 'middle' }, children: [_jsx("span", { className: "sm:hidden", children: t('total') }), _jsx("span", { className: "hidden sm:inline", children: t('total_collection') })] }), _jsx("td", { className: "pl-1 pr-2 sm:px-4 text-right text-emerald-400 print:text-slate-900 align-middle py-2 sm:py-3", style: { verticalAlign: 'middle' }, children: formatNumber(Math.round(result.totalCollection)) })] })] })] }) })] })] })] }));
};
export default CalculationSummary;
