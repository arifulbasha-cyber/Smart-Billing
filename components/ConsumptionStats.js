import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart } from 'lucide-react';
import { useLanguage } from '../i18n';
const ConsumptionStats = ({ calculations, totalUnits }) => {
    const { t } = useLanguage();
    return (_jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 print-break-inside-avoid transition-colors duration-200", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4", children: [_jsx(PieChart, { className: "w-5 h-5 text-indigo-600 dark:text-indigo-400" }), _jsx("h2", { className: "text-lg font-semibold text-slate-800 dark:text-slate-100", children: t('consumption_share') })] }), _jsxs("div", { className: "space-y-5", children: [calculations.map((user, index) => {
                        const percentage = totalUnits > 0 ? (user.unitsUsed / totalUnits) * 100 : 0;
                        const colors = ['bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-rose-600', 'bg-emerald-600', 'bg-blue-600'];
                        const colorClass = colors[index % colors.length];
                        return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-2 h-2 rounded-full ${colorClass}` }), _jsx("span", { className: "font-medium text-slate-700 dark:text-slate-300", children: t(user.name) })] }), _jsxs("div", { className: "text-right", children: [_jsxs("span", { className: "font-bold text-slate-900 dark:text-slate-100", children: [percentage.toFixed(1), "%"] }), _jsx("span", { className: "text-slate-400 mx-1", children: "\u2022" }), _jsxs("span", { className: "text-slate-500 dark:text-slate-400", children: [user.unitsUsed, " kWh"] })] })] }), _jsx("div", { className: "w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2", children: _jsx("div", { className: `${colorClass} h-2 rounded-full transition-all duration-500 ease-out`, style: { width: `${percentage}%` } }) })] }, user.id));
                    }), calculations.length === 0 && (_jsx("div", { className: "text-center text-slate-400 dark:text-slate-500 text-sm py-4", children: t('no_active_meters') }))] })] }));
};
export default ConsumptionStats;
