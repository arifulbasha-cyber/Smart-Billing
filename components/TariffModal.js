import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DEFAULT_TARIFF_CONFIG } from '../constants';
import { useLanguage } from '../i18n';
import { X, Save, RotateCcw, Plus, Trash2 } from 'lucide-react';
const TariffModal = ({ isOpen, onClose, config, onSave }) => {
    const { t } = useLanguage();
    const [tempConfig, setTempConfig] = useState(JSON.parse(JSON.stringify(config)));
    if (!isOpen)
        return null;
    const handleChange = (key, value) => {
        setTempConfig({ ...tempConfig, [key]: parseFloat(value.toString()) || 0 });
    };
    const handleSlabChange = (index, key, value) => {
        const newSlabs = [...tempConfig.slabs];
        newSlabs[index] = { ...newSlabs[index], [key]: parseFloat(value) || 0 };
        setTempConfig({ ...tempConfig, slabs: newSlabs });
    };
    const addSlab = () => {
        const lastSlab = tempConfig.slabs[tempConfig.slabs.length - 1];
        setTempConfig({
            ...tempConfig,
            slabs: [...tempConfig.slabs, { limit: lastSlab ? lastSlab.limit + 100 : 100, rate: lastSlab ? lastSlab.rate : 0 }]
        });
    };
    const removeSlab = (index) => {
        const newSlabs = tempConfig.slabs.filter((_, i) => i !== index);
        setTempConfig({ ...tempConfig, slabs: newSlabs });
    };
    const handleSave = () => {
        onSave(tempConfig);
        onClose();
    };
    const handleReset = () => {
        if (window.confirm('Reset all rates to default?')) {
            setTempConfig(DEFAULT_TARIFF_CONFIG);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transition-colors duration-200", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white", children: t('tariff_settings') }), _jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mt-1", children: t('tariff_desc') })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "p-6 overflow-y-auto space-y-6 custom-scrollbar", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2", children: t('demand_charge') }), _jsx("input", { type: "number", value: tempConfig.demandCharge, onChange: (e) => handleChange('demandCharge', e.target.value), className: "w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 text-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2", children: t('meter_rent') }), _jsx("input", { type: "number", value: tempConfig.meterRent, onChange: (e) => handleChange('meterRent', e.target.value), className: "w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 text-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2", children: t('vat_rate_percent') }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", value: tempConfig.vatRate * 100, onChange: (e) => setTempConfig({ ...tempConfig, vatRate: (parseFloat(e.target.value) || 0) / 100 }), className: "w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 text-sm pr-6" }), _jsx("span", { className: "absolute right-3 top-2 text-slate-400", children: "%" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2", children: t('bkash_charge') }), _jsx("input", { type: "number", value: tempConfig.bkashCharge, onChange: (e) => handleChange('bkashCharge', e.target.value), className: "w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 text-sm" })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase", children: t('slab_rates_config') }), _jsxs("button", { onClick: addSlab, className: "text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded", children: [_jsx(Plus, { className: "w-3 h-3" }), " ", t('add_slab')] })] }), _jsxs("div", { className: "border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden", children: [_jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs uppercase", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 font-semibold", children: t('limit') }), _jsx("th", { className: "px-4 py-2 font-semibold", children: t('rate_per_unit') }), _jsx("th", { className: "px-2 py-2 w-10" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900", children: tempConfig.slabs.map((slab, idx) => (_jsxs("tr", { children: [_jsx("td", { className: "p-2", children: _jsx("input", { type: "number", value: slab.limit, onChange: (e) => handleSlabChange(idx, 'limit', e.target.value), className: "w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm py-1" }) }), _jsx("td", { className: "p-2", children: _jsx("input", { type: "number", value: slab.rate, onChange: (e) => handleSlabChange(idx, 'rate', e.target.value), className: "w-full rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm py-1" }) }), _jsx("td", { className: "p-2 text-center", children: _jsx("button", { onClick: () => removeSlab(idx), className: "text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) }) })] }, idx))) })] }), tempConfig.slabs.length === 0 && (_jsx("div", { className: "p-4 text-center text-slate-400 text-sm italic", children: "No slabs defined. Add one to start." }))] })] })] }), _jsxs("div", { className: "p-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl", children: [_jsxs("button", { onClick: handleReset, className: "flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200", children: [_jsx(RotateCcw, { className: "w-4 h-4" }), " ", t('reset_defaults')] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors", children: t('cancel') }), _jsxs("button", { onClick: handleSave, className: "px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 rounded-lg shadow-sm flex items-center gap-2 transition-colors", children: [_jsx(Save, { className: "w-4 h-4" }), " ", t('save_changes')] })] })] })] }) }));
};
export default TariffModal;
