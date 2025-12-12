import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronUp, Zap } from 'lucide-react';
import { useLanguage } from '../i18n';
const StickySummary = ({ totalAmount, totalUnits, onExpand }) => {
    const { t } = useLanguage();
    return (_jsx("div", { className: "fixed bottom-[70px] left-4 right-4 z-40 lg:hidden print:hidden", children: _jsxs("div", { onClick: onExpand, className: "bg-slate-900/90 dark:bg-white/10 backdrop-blur-md text-white border border-white/10 shadow-xl rounded-2xl p-4 flex items-center justify-between cursor-pointer ring-1 ring-black/5", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-[10px] uppercase font-bold text-slate-400 dark:text-slate-300 tracking-wider mb-0.5", children: t('est_total_payable') }), _jsxs("div", { className: "text-xl font-bold font-mono", children: ["\u09F3", Math.round(totalAmount)] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "text-right", children: [_jsx("span", { className: "text-[10px] uppercase font-bold text-slate-400 dark:text-slate-300 tracking-wider mb-0.5 block", children: t('total_units') }), _jsxs("div", { className: "text-sm font-bold flex items-center justify-end gap-1", children: [_jsx(Zap, { className: "w-3 h-3 text-yellow-400 fill-yellow-400" }), " ", totalUnits] })] }), _jsx("div", { className: "bg-white/10 rounded-full p-1.5", children: _jsx(ChevronUp, { className: "w-5 h-5 text-white" }) })] })] }) }));
};
export default StickySummary;
