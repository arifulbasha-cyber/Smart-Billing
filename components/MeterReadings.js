import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Users, Trash2, Plus, Zap, Lock, ChevronDown, ChevronUp, AlertTriangle, Settings } from 'lucide-react';
import { useLanguage } from '../i18n';
const MeterReadings = ({ mainMeter, onMainMeterUpdate, readings, onUpdate, tenants, onManageTenants, maxUnits = 1, calculatedRate = 0, tariffConfig }) => {
    const { t, formatNumber } = useLanguage();
    const [expandedCards, setExpandedCards] = useState(new Set());
    // Swipe State
    const [swipedCardId, setSwipedCardId] = useState(null);
    const touchStartRef = useRef(null);
    const toggleExpand = (id) => {
        const newSet = new Set(expandedCards);
        if (newSet.has(id))
            newSet.delete(id);
        else
            newSet.add(id);
        setExpandedCards(newSet);
    };
    const handleChange = (id, key, value) => {
        const updated = readings.map(r => r.id === id ? { ...r, [key]: value } : r);
        onUpdate(updated);
    };
    const handleMainMeterChange = (key, value) => {
        onMainMeterUpdate({ ...mainMeter, [key]: value });
    };
    const handleRemove = (id) => {
        if (window.confirm(t('confirm_delete_meter'))) {
            onUpdate(readings.filter(r => r.id !== id));
        }
    };
    const handleAdd = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        const nextMeterNo = readings.length > 0 ? (parseInt(readings[readings.length - 1].meterNo) + 1).toString() : '1';
        const newMeters = [...readings, { id: newId, name: 'New User', meterNo: nextMeterNo, previous: 0, current: 0 }];
        onUpdate(newMeters);
        // Auto expand new card
        setExpandedCards(prev => new Set(prev).add(newId));
    };
    const handleFocus = (e) => {
        e.target.select();
    };
    // Swipe Handlers
    const onTouchStart = (e, id) => {
        touchStartRef.current = e.targetTouches[0].clientX;
    };
    const onTouchMove = (e, id) => {
        if (touchStartRef.current === null)
            return;
        const currentX = e.targetTouches[0].clientX;
        const diff = touchStartRef.current - currentX;
        if (diff > 50)
            setSwipedCardId(id); // Swipe Left
        if (diff < -50)
            setSwipedCardId(null); // Swipe Right to reset
    };
    const onTouchEnd = () => {
        touchStartRef.current = null;
    };
    // Slab Border Logic
    const getSlabColor = (units, isNegative) => {
        if (isNegative)
            return 'border-red-400 dark:border-red-700 hover:border-red-500 bg-red-50 dark:bg-red-900/10';
        if (!tariffConfig)
            return 'border-slate-100 dark:border-slate-700';
        const slabs = tariffConfig.slabs;
        if (units <= slabs[0].limit)
            return 'border-green-200 dark:border-green-800 hover:border-green-300 shadow-sm shadow-green-100/50 dark:shadow-none';
        if (units <= slabs[1].limit)
            return 'border-yellow-200 dark:border-yellow-800 hover:border-yellow-300 shadow-sm shadow-yellow-100/50 dark:shadow-none';
        return 'border-orange-200 dark:border-orange-800 hover:border-red-300 shadow-sm shadow-orange-100/50 dark:shadow-none';
    };
    const getBarColor = (units) => {
        if (!tariffConfig)
            return 'bg-slate-300';
        const slabs = tariffConfig.slabs;
        if (units <= slabs[0].limit)
            return 'bg-green-500';
        if (units <= slabs[1].limit)
            return 'bg-yellow-500';
        return 'bg-orange-500';
    };
    const totalUnits = readings.reduce((sum, r) => sum + Math.max(0, r.current - r.previous), 0);
    const mainMeterUnits = Math.max(0, mainMeter.current - mainMeter.previous);
    const diffUnits = mainMeterUnits - totalUnits;
    // SVG Gauge Calculator
    const gaugeAngle = Math.min(180, (mainMeterUnits / (maxUnits * 1.5 || 200)) * 180);
    // Helper to strip leading zeros for display (e.g. "03" -> "3")
    const formatMeterDisplay = (val) => {
        const num = parseInt(val);
        return isNaN(num) ? val : num.toString();
    };
    return (_jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 print-break-inside-avoid transition-colors duration-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-5 h-5 text-indigo-600 dark:text-indigo-400" }), _jsx("h2", { className: "text-lg font-semibold text-slate-800 dark:text-slate-100", children: t('meter_readings') })] }), _jsxs("button", { onClick: handleAdd, className: "no-print flex items-center gap-1 text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-md transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), " ", _jsx("span", { className: "hidden sm:inline", children: t('add_meter') }), _jsx("span", { className: "sm:hidden", children: "Add" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: [_jsxs("div", { className: "bg-slate-900 dark:bg-black p-4 rounded-xl border border-slate-700 shadow-lg text-white relative overflow-hidden group", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" }), _jsx("div", { className: "flex justify-between items-start mb-2 relative z-10", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "bg-indigo-500/20 p-1.5 rounded-lg backdrop-blur-sm", children: _jsx(Lock, { className: "w-4 h-4 text-indigo-300" }) }), _jsxs("div", { children: [_jsx("div", { className: "font-bold text-sm uppercase tracking-wide text-slate-200", children: t('main_meter') }), _jsxs("div", { className: "text-[10px] text-slate-400 font-mono", children: ["Meter ", formatNumber(mainMeter.meterNo || '0')] })] })] }) }), _jsx("div", { className: "relative h-32 flex flex-col items-center justify-end mb-2", children: _jsxs("svg", { viewBox: "0 0 200 110", className: "w-48 h-28 overflow-visible", children: [_jsx("path", { d: "M 20 100 A 80 80 0 0 1 180 100", fill: "none", stroke: "#334155", strokeWidth: "12", strokeLinecap: "round" }), _jsx("defs", { children: _jsxs("linearGradient", { id: "gaugeGradient", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#22c55e" }), _jsx("stop", { offset: "50%", stopColor: "#eab308" }), _jsx("stop", { offset: "100%", stopColor: "#ef4444" })] }) }), _jsx("path", { d: "M 20 100 A 80 80 0 0 1 180 100", fill: "none", stroke: "url(#gaugeGradient)", strokeWidth: "12", strokeLinecap: "round", strokeDasharray: "251.2", strokeDashoffset: 251.2 - (251.2 * (gaugeAngle / 180)), className: "transition-all duration-1000 ease-out" }), _jsxs("g", { transform: `rotate(${gaugeAngle - 90}, 100, 100)`, className: "transition-transform duration-1000 ease-out", children: [_jsx("circle", { cx: "100", cy: "100", r: "4", fill: "white" }), _jsx("path", { d: "M 100 100 L 100 35", stroke: "white", strokeWidth: "2", strokeLinecap: "round" })] }), _jsx("text", { x: "100", y: "85", textAnchor: "middle", fill: "white", className: "text-3xl font-bold font-mono", children: formatNumber(mainMeterUnits) }), _jsx("text", { x: "100", y: "100", textAnchor: "middle", fill: "#94a3b8", className: "text-[10px] uppercase font-bold tracking-widest", children: "Units (kWh)" })] }) }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mt-2", children: [_jsxs("div", { className: "relative group/input", children: [_jsx("input", { type: "number", value: mainMeter.previous, onChange: (e) => handleMainMeterChange('previous', parseFloat(e.target.value) || 0), onFocus: handleFocus, className: "w-full bg-slate-800/50 border border-slate-700 rounded-lg px-2 py-1.5 text-right text-sm text-slate-300 focus:text-white focus:bg-slate-800 focus:border-indigo-500 outline-none transition-colors" }), _jsx("span", { className: "absolute left-2 top-2 text-[10px] text-slate-500 uppercase font-bold pointer-events-none", children: "Prev" })] }), _jsxs("div", { className: "relative group/input", children: [_jsx("input", { type: "number", value: mainMeter.current, onChange: (e) => handleMainMeterChange('current', parseFloat(e.target.value) || 0), onFocus: handleFocus, className: "w-full bg-slate-800/50 border border-slate-700 rounded-lg px-2 py-1.5 text-right text-sm font-bold text-white focus:bg-slate-800 focus:border-indigo-500 outline-none transition-colors" }), _jsx("span", { className: "absolute left-2 top-2 text-[10px] text-slate-500 uppercase font-bold pointer-events-none", children: "Curr" })] })] })] }), readings.length === 0 && (_jsxs("div", { className: "col-span-1 md:col-span-1 lg:col-span-2 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center", children: [_jsx("div", { className: "bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm mb-3", children: _jsx(Zap, { className: "w-8 h-8 text-slate-300 dark:text-slate-600" }) }), _jsx("h3", { className: "text-sm font-bold text-slate-700 dark:text-slate-300", children: t('no_meters_title') }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-500 mt-1 mb-4 max-w-xs", children: t('no_meters_desc') }), _jsx("button", { onClick: handleAdd, className: "text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors", children: t('add_first_meter') })] })), readings.map((reading) => {
                        const units = Math.max(0, reading.current - reading.previous);
                        const matchedTenant = tenants.find(t => t.name === reading.name);
                        const isExpanded = expandedCards.has(reading.id);
                        const isSwiped = swipedCardId === reading.id;
                        const estimatedCost = units * calculatedRate;
                        const isNegative = reading.current < reading.previous && reading.current > 0;
                        const slabBorderClass = getSlabColor(units, isNegative);
                        const consumptionPercent = maxUnits > 0 ? (units / maxUnits) * 100 : 0;
                        const barColor = getBarColor(units);
                        return (_jsxs("div", { className: "relative overflow-hidden rounded-xl", children: [_jsx("div", { className: "absolute inset-0 bg-red-500 flex items-center justify-center pr-6 rounded-xl justify-end", children: _jsx(Trash2, { className: "text-white w-6 h-6" }) }), _jsxs("div", { className: `bg-white dark:bg-slate-900 border ${slabBorderClass} p-0 rounded-xl transition-transform duration-300 relative z-10 shadow-sm`, style: { transform: isSwiped ? 'translateX(-80px)' : 'translateX(0)' }, onTouchStart: (e) => onTouchStart(e, reading.id), onTouchMove: (e) => onTouchMove(e, reading.id), onTouchEnd: onTouchEnd, children: [_jsx("button", { onClick: () => handleRemove(reading.id), className: `absolute top-0 bottom-0 right-[-80px] w-[80px] bg-red-500 flex items-center justify-center text-white z-20 md:hidden`, children: _jsx(Trash2, { className: "w-6 h-6" }) }), _jsx("button", { onClick: () => handleRemove(reading.id), className: "hidden md:block absolute top-2 right-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20", children: _jsx(Trash2, { className: "w-4 h-4" }) }), _jsx("div", { className: "pt-3 px-3 pb-2 cursor-pointer relative", onClick: () => toggleExpand(reading.id), children: _jsxs("div", { className: "flex justify-between items-start relative z-10 mb-2", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0 ${isNegative ? 'bg-red-500' : (units > 100 ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-gradient-to-br from-indigo-400 to-purple-500')}`, children: isNegative ? _jsx(AlertTriangle, { className: "w-4 h-4" }) : (reading.name ? reading.name.substring(0, 2).toUpperCase() : '??') }), _jsxs("div", { className: "min-w-0", children: [_jsx("h3", { className: "font-bold text-slate-800 dark:text-slate-200 text-sm truncate", children: t(reading.name) || t('user_name') }), _jsxs("div", { className: "text-[10px] text-slate-500 dark:text-slate-400 font-mono leading-none", children: ["Meter ", formatNumber(formatMeterDisplay(reading.meterNo))] })] })] }), _jsx("div", { className: "text-right shrink-0", children: isNegative ? (_jsx("div", { className: "text-xs font-bold text-red-500 flex flex-col items-end", children: _jsx("span", { children: t('negative_consumption') }) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-0.5 border border-slate-200 dark:border-slate-700 inline-block", children: ["\u2248 \u09F3", formatNumber(Math.round(estimatedCost))] }), _jsxs("div", { className: `text-xs font-bold flex items-center justify-end gap-1 leading-tight ${units > 100 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`, children: [_jsx(Zap, { className: "w-3 h-3 fill-current" }), " ", formatNumber(units), " kWh"] })] })) })] }) }), _jsxs("div", { className: "px-3 pb-3 grid grid-cols-2 gap-3", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1 h-9 group-focus-within:border-indigo-500 relative", children: [_jsx("span", { className: "text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0 mr-1", children: t('previous').substring(0, 4) }), _jsx("input", { type: "number", value: reading.previous, onChange: (e) => handleChange(reading.id, 'previous', parseFloat(e.target.value) || 0), onFocus: handleFocus, className: `w-full bg-transparent border-none p-0 text-right text-sm font-medium text-slate-700 dark:text-slate-300 outline-none leading-tight ${isNegative ? 'text-red-500' : ''}` })] }), _jsxs("div", { className: "flex items-center justify-between bg-white dark:bg-slate-900 rounded-lg border border-indigo-200 dark:border-indigo-900/50 px-3 py-1 h-9 shadow-sm group-focus-within:border-indigo-500 relative", children: [_jsx("span", { className: "text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0 mr-1", children: t('current').substring(0, 4) }), _jsx("input", { type: "number", value: reading.current, onChange: (e) => handleChange(reading.id, 'current', parseFloat(e.target.value) || 0), onFocus: handleFocus, className: `w-full bg-transparent border-none p-0 text-right text-sm font-bold text-slate-900 dark:text-white outline-none leading-tight ${isNegative ? 'text-red-500' : ''}` })] })] }), _jsxs("div", { className: "relative cursor-pointer", onClick: () => toggleExpand(reading.id), children: [!isExpanded && (_jsx("div", { className: "flex justify-center pb-0.5", children: _jsx(ChevronDown, { className: "w-3 h-3 text-slate-300 dark:text-slate-600" }) })), !isNegative && !isExpanded && (_jsx("div", { className: "absolute bottom-0 left-0 h-1 bg-slate-100 dark:bg-slate-800 w-full", children: _jsx("div", { className: `h-full ${barColor} transition-all duration-500 ease-out`, style: { width: `${consumptionPercent}%` } }) }))] }), isExpanded && (_jsxs("div", { className: "px-3 pb-3 animate-in slide-in-from-top-2 duration-200 relative", children: [_jsxs("div", { className: "mb-2 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800", children: [_jsxs("div", { className: "relative flex-1", children: [_jsxs("select", { value: tenants.some(t => t.name === reading.name) ? reading.name : '', onChange: (e) => handleChange(reading.id, 'name', e.target.value), className: "w-full rounded-md border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs px-2 py-1.5 appearance-none focus:ring-1 focus:ring-indigo-500 outline-none", children: [_jsx("option", { value: "", disabled: true, children: t('select_tenant') }), tenants.map(t => (_jsx("option", { value: t.name, children: t.name }, t.id))), !tenants.some(t => t.name === reading.name) && reading.name && (_jsxs("option", { value: reading.name, children: [reading.name, " (Legacy)"] }))] }), _jsx(ChevronDown, { className: "absolute right-2 top-2 w-3 h-3 text-slate-400 pointer-events-none" })] }), _jsx("button", { onClick: onManageTenants, className: "p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors", title: t('tenant_manager'), children: _jsx(Settings, { className: "w-3.5 h-3.5" }) })] }), isNegative && (_jsxs("div", { className: "mt-2 bg-red-50 dark:bg-red-900/20 p-1.5 rounded text-[10px] text-red-600 dark:text-red-300 flex items-center gap-1.5", children: [_jsx(AlertTriangle, { className: "w-3 h-3" }), t('check_readings')] })), _jsxs("div", { className: "mt-2 pt-1 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsxs("span", { children: ["Meter ", formatNumber(formatMeterDisplay(reading.meterNo))] }) }), _jsxs("span", { className: "md:hidden flex items-center gap-1", children: [_jsx(Trash2, { className: "w-3 h-3" }), " ", t('swipe_hint')] }), _jsx("div", { className: "flex justify-center", onClick: () => toggleExpand(reading.id), children: _jsx(ChevronUp, { className: "w-3 h-3 text-slate-300 cursor-pointer" }) })] })] }))] })] }, reading.id));
                    }), _jsxs("div", { className: "col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900 dark:bg-black p-4 rounded-xl text-white shadow-md border border-slate-700 mt-2", children: [_jsxs("div", { className: "flex flex-col items-center sm:items-start p-2 bg-slate-800 dark:bg-slate-900/50 rounded-lg", children: [_jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1", children: t('main_meter') }), _jsxs("div", { className: "text-lg font-bold font-mono", children: [formatNumber(mainMeterUnits), " ", _jsx("span", { className: "text-[10px] font-normal text-slate-500", children: "kWh" })] })] }), _jsxs("div", { className: "flex flex-col items-center sm:items-start p-2 bg-slate-800 dark:bg-slate-900/50 rounded-lg border border-indigo-900/30", children: [_jsx("span", { className: "text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1", children: t('total_user_units') }), _jsxs("div", { className: "text-lg font-bold font-mono text-indigo-400", children: [formatNumber(totalUnits), " ", _jsx("span", { className: "text-[10px] font-normal text-indigo-300/50", children: "kWh" })] })] }), _jsxs("div", { className: "flex flex-col items-center sm:items-start p-2 bg-slate-800 dark:bg-slate-900/50 rounded-lg border border-slate-700", children: [_jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1", children: diffUnits >= 0 ? t('system_loss') : t('reading_error') }), _jsxs("div", { className: `text-lg font-bold font-mono flex items-center gap-2 ${diffUnits < 0 ? 'text-red-400' : 'text-orange-400'}`, children: [formatNumber(diffUnits), " ", _jsx("span", { className: "text-[10px] font-normal text-slate-500", children: "kWh" }), diffUnits < 0 && _jsx(AlertTriangle, { className: "w-4 h-4 text-red-500" })] })] })] })] })] }));
};
export default MeterReadings;
