import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Calculator, Zap, Info, Banknote } from 'lucide-react';
import { useLanguage } from '../i18n';
const BillEstimator = ({ tariffConfig }) => {
    const { t } = useLanguage();
    const [mode, setMode] = useState('forward');
    const [units, setUnits] = useState('');
    const [targetBill, setTargetBill] = useState('');
    // Use Dynamic Config
    const DEMAND_CHARGE = tariffConfig.demandCharge;
    const METER_RENT = tariffConfig.meterRent;
    const VAT_RATE = tariffConfig.vatRate;
    const SLABS = tariffConfig.slabs;
    // --- Forward Calculation ---
    const calculateBill = (u) => {
        let remainingUnits = u;
        let energyCost = 0;
        let previousLimit = 0;
        for (const slab of SLABS) {
            const slabSize = slab.limit - previousLimit;
            const unitsInSlab = Math.min(remainingUnits, slabSize);
            if (unitsInSlab > 0) {
                energyCost += unitsInSlab * slab.rate;
                remainingUnits -= unitsInSlab;
            }
            previousLimit = slab.limit;
            if (remainingUnits <= 0)
                break;
        }
        if (remainingUnits > 0 && SLABS.length > 0) {
            const lastRate = SLABS[SLABS.length - 1].rate;
            energyCost += remainingUnits * lastRate;
        }
        const totalSubjectToVat = energyCost + DEMAND_CHARGE + METER_RENT;
        const vatAmount = totalSubjectToVat * VAT_RATE;
        const totalPayable = totalSubjectToVat + vatAmount;
        return {
            energyCost,
            totalSubjectToVat,
            vatAmount,
            totalPayable
        };
    };
    // --- Reverse Calculation ---
    const calculateUnitsDetailed = (bill) => {
        const vatAmount = (bill * VAT_RATE) / (1 + VAT_RATE);
        const taxableBase = bill - vatAmount;
        const energyCost = taxableBase - (DEMAND_CHARGE + METER_RENT);
        const logicSteps = [];
        logicSteps.push({
            title: t('step1_title'),
            description: t('step1_desc'),
            subSteps: [
                {
                    label: t('step1a_label'),
                    text: t('step1a_text'),
                    calculation: `VAT = (${bill.toFixed(2)} × ${VAT_RATE}) ÷ ${(1 + VAT_RATE).toFixed(2)} = ${vatAmount.toFixed(2)}\nBase = ${bill.toFixed(2)} - ${vatAmount.toFixed(2)} = ${taxableBase.toFixed(2)}`
                },
                {
                    label: t('step1b_label'),
                    text: t('step1b_text'),
                    calculation: `${taxableBase.toFixed(2)} - ${(DEMAND_CHARGE + METER_RENT).toFixed(2)} = ${energyCost.toFixed(2)}`
                }
            ]
        });
        let remainingCost = energyCost;
        let totalUnits = 0;
        let previousLimit = 0;
        const slabSubSteps = [];
        if (energyCost > 0) {
            for (let i = 0; i < SLABS.length; i++) {
                const slab = SLABS[i];
                const slabSize = slab.limit - previousLimit;
                const maxCostForSlab = slabSize * slab.rate;
                const stepBase = {
                    slabIndex: i + 1,
                    range: `${previousLimit}-${slab.limit}`,
                    rate: slab.rate,
                    startCost: remainingCost,
                };
                if (remainingCost >= maxCostForSlab) {
                    totalUnits += slabSize;
                    remainingCost -= maxCostForSlab;
                    slabSubSteps.push({
                        label: `${t('test_slab')} ${stepBase.slabIndex}`,
                        text: t('test_slab_text'),
                        calculation: `${stepBase.startCost.toFixed(2)} - ${maxCostForSlab.toFixed(2)} = ${remainingCost.toFixed(2)}`,
                        note: `Since remaining cost (${remainingCost.toFixed(2)}) is > 0, consumption is over ${slab.limit} units.`
                    });
                }
                else {
                    const unitsInSlab = remainingCost / slab.rate;
                    totalUnits += unitsInSlab;
                    slabSubSteps.push({
                        label: `${t('calc_slab')} (${t('test_slab')} ${stepBase.slabIndex})`,
                        text: t('calc_slab_text'),
                        calculation: `${stepBase.startCost.toFixed(2)} / ${slab.rate} = ${unitsInSlab.toFixed(2)} ${t('units')}`
                    });
                    remainingCost = 0;
                    break;
                }
                previousLimit = slab.limit;
            }
            if (remainingCost > 0.01 && SLABS.length > 0) {
                const lastRate = SLABS[SLABS.length - 1].rate;
                const extraUnits = remainingCost / lastRate;
                totalUnits += extraUnits;
                slabSubSteps.push({
                    label: t('above_slab_limit'),
                    text: t('above_slab_text'),
                    calculation: `${remainingCost.toFixed(2)} / ${lastRate} = ${extraUnits.toFixed(2)} ${t('units')}`
                });
            }
        }
        else {
            slabSubSteps.push({
                label: t('no_usage'),
                text: t('no_usage_text'),
                calculation: "0 units"
            });
        }
        logicSteps.push({
            title: t('step2_title'),
            description: t('step2_desc'),
            tableHeader: true,
            subSteps: slabSubSteps
        });
        logicSteps.push({
            title: t('step3_title'),
            description: t('step3_desc'),
            subSteps: [{
                    label: t('final_sum'),
                    text: t('final_sum_text'),
                    calculation: `= ${totalUnits.toFixed(2)} kWh`
                }]
        });
        return { totalUnits, logicSteps, energyCost, taxableBase };
    };
    const handleFocus = (e) => {
        e.target.select();
    };
    const currentUnits = typeof units === 'number' ? units : 0;
    const forwardResult = calculateBill(currentUnits);
    const reverseResult = calculateUnitsDetailed(typeof targetBill === 'number' ? targetBill : 0);
    // Helper for Slab Visualization
    const renderSlabBar = () => {
        if (mode !== 'forward')
            return null;
        // Determine current slab index
        let currentSlabIdx = -1;
        let prevLimit = 0;
        for (let i = 0; i < SLABS.length; i++) {
            if (currentUnits > prevLimit && currentUnits <= SLABS[i].limit) {
                currentSlabIdx = i;
                break;
            }
            prevLimit = SLABS[i].limit;
        }
        if (currentSlabIdx === -1 && currentUnits > 0)
            currentSlabIdx = SLABS.length; // Above max
        const colors = ['bg-green-500', 'bg-lime-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];
        return (_jsxs("div", { className: "mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-xs font-bold uppercase text-slate-500 dark:text-slate-400", children: t('current_tier') }), _jsxs("span", { className: "text-xs font-bold text-slate-900 dark:text-white", children: [currentUnits, " kWh"] })] }), _jsxs("div", { className: "h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex", children: [SLABS.map((slab, idx) => {
                            // Simple equal width segments for visualization since slab sizes vary wildly
                            // Or we can highlight just the active one
                            const isActive = idx === currentSlabIdx || (idx === SLABS.length - 1 && currentSlabIdx >= idx);
                            const isPassed = idx < currentSlabIdx;
                            return (_jsx("div", { className: `flex-1 border-r border-white/20 last:border-0 relative group transition-all duration-300 ${isPassed ? colors[idx % colors.length] : (isActive ? colors[idx % colors.length] : 'bg-slate-300 dark:bg-slate-600')}`, children: _jsx("div", { className: "absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/90 opacity-0 group-hover:opacity-100 transition-opacity", children: slab.rate }) }, idx));
                        }), _jsx("div", { className: `flex-1 relative ${currentSlabIdx >= SLABS.length ? 'bg-red-600' : 'bg-slate-300 dark:bg-slate-600'}` })] }), _jsxs("div", { className: "flex justify-between mt-1 text-[10px] text-slate-400 font-mono", children: [_jsx("span", { children: "0" }), SLABS.map((s, i) => _jsx("span", { children: s.limit }, i)), _jsx("span", { children: "+" })] }), currentUnits > 0 && (_jsxs("div", { className: "mt-2 text-center text-xs font-medium text-indigo-600 dark:text-indigo-400", children: ["You are paying ", _jsxs("span", { className: "font-bold", children: ["\u09F3", currentSlabIdx < SLABS.length ? SLABS[currentSlabIdx]?.rate : SLABS[SLABS.length - 1]?.rate] }), " per unit for current consumption."] }))] }));
    };
    return (_jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 print-break-inside-avoid no-print transition-colors duration-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calculator, { className: "w-5 h-5 text-indigo-600 dark:text-indigo-400" }), _jsx("h2", { className: "text-lg font-semibold text-slate-800 dark:text-slate-100", children: t('bill_estimator') })] }), _jsxs("div", { className: "flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0", children: [_jsxs("button", { onClick: () => setMode('forward'), className: `px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${mode === 'forward'
                                    ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`, children: [_jsx(Zap, { className: "w-3 h-3" }), _jsx("span", { className: "hidden sm:inline", children: t('units_to_cost') }), _jsx("span", { className: "sm:hidden", children: t('units') })] }), _jsxs("button", { onClick: () => setMode('reverse'), className: `px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${mode === 'reverse'
                                    ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`, children: [_jsx(Banknote, { className: "w-3 h-3" }), _jsx("span", { className: "hidden sm:inline", children: t('cost_to_units') }), _jsx("span", { className: "sm:hidden", children: t('cost') })] })] })] }), mode === 'forward' ? (_jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-right-2 duration-200", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1", children: [t('enter_units_used'), " ", _jsx(Zap, { className: "w-3 h-3 text-yellow-500 fill-yellow-500" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", min: "0", value: units, onChange: (e) => setUnits(e.target.value === '' ? '' : parseFloat(e.target.value)), onFocus: handleFocus, placeholder: "e.g. 205", className: "w-full rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 text-lg font-bold text-slate-900 dark:text-white pr-12 bg-white dark:bg-slate-950" }), _jsx("span", { className: "absolute right-4 top-3 text-sm text-slate-400 font-medium pointer-events-none", children: "kWh" })] })] }), renderSlabBar(), _jsxs("div", { className: "bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsx("span", { className: "text-slate-600 dark:text-slate-400", children: t('energy_cost_slab') }), _jsx("span", { className: "font-medium text-slate-900 dark:text-white", children: forwardResult.energyCost.toFixed(2) })] }), _jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsx("span", { className: "text-slate-600 dark:text-slate-400", children: t('demand_charge') }), _jsx("span", { className: "font-medium text-slate-900 dark:text-white", children: DEMAND_CHARGE })] }), _jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsx("span", { className: "text-slate-600 dark:text-slate-400", children: t('meter_rent') }), _jsx("span", { className: "font-medium text-slate-900 dark:text-white", children: METER_RENT })] }), _jsx("div", { className: "border-t border-slate-200 dark:border-slate-700 my-2" }), _jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "text-slate-600 dark:text-slate-400", children: t('total_base') }), _jsx("span", { className: "text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 rounded border border-slate-200 dark:border-slate-700", children: t('subject_to_vat') })] }), _jsx("span", { className: "font-medium text-slate-900 dark:text-white", children: forwardResult.totalSubjectToVat.toFixed(2) })] }), _jsxs("div", { className: "flex justify-between items-center text-sm text-slate-600 dark:text-slate-400", children: [_jsxs("span", { children: [t('vat_total'), " (", VAT_RATE * 100, "%)"] }), _jsx("span", { children: forwardResult.vatAmount.toFixed(2) })] }), _jsxs("div", { className: "border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between items-center", children: [_jsx("span", { className: "font-bold text-indigo-900 dark:text-indigo-300 uppercase text-xs tracking-wider", children: t('est_total_payable') }), _jsxs("span", { className: "font-bold text-indigo-700 dark:text-indigo-400 text-xl", children: ["\u09F3", Math.round(forwardResult.totalPayable)] })] })] }), _jsxs("div", { className: "flex gap-2 items-start bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 p-3 rounded-md text-xs", children: [_jsx(Info, { className: "w-4 h-4 mt-0.5 shrink-0" }), _jsx("p", { className: "opacity-90 leading-relaxed", children: t('forward_explainer') })] })] })) : (_jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-left-2 duration-200", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1", children: [t('enter_total_bill'), " ", _jsx(Banknote, { className: "w-3 h-3 text-indigo-500 dark:text-indigo-400" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", min: "0", value: targetBill, onChange: (e) => setTargetBill(e.target.value === '' ? '' : parseFloat(e.target.value)), onFocus: handleFocus, placeholder: "e.g. 1497.77", className: "w-full rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 text-lg font-bold text-slate-900 dark:text-white pr-12 bg-white dark:bg-slate-950" }), _jsx("span", { className: "absolute right-4 top-3 text-sm text-slate-400 font-medium pointer-events-none", children: t('bdt') })] })] }), _jsxs("div", { className: "bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 space-y-2", children: [_jsx("p", { className: "font-medium text-slate-800 dark:text-slate-200 uppercase tracking-wide text-xs", children: t('est_unit_uses') }), _jsx("p", { className: "text-sm", children: t('reverse_intro_1') }), _jsx("p", { className: "text-sm", children: t('reverse_intro_2') })] }), (typeof targetBill === 'number' && targetBill > 0) ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase", children: _jsxs("tr", { children: [_jsx("th", { className: "p-3 border-b border-slate-200 dark:border-slate-700", children: t('component') }), _jsx("th", { className: "p-3 border-b border-slate-200 dark:border-slate-700", children: t('value') })] }) }), _jsxs("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900", children: [_jsxs("tr", { children: [_jsx("td", { className: "p-3", children: t('total_bill_payable') }), _jsx("td", { className: "p-3 font-medium", children: targetBill.toFixed(2) })] }), _jsxs("tr", { children: [_jsx("td", { className: "p-3", children: t('fixed_charges') }), _jsx("td", { className: "p-3 font-medium", children: (DEMAND_CHARGE + METER_RENT).toFixed(2) })] }), _jsxs("tr", { children: [_jsx("td", { className: "p-3", children: t('vat_rate') }), _jsxs("td", { className: "p-3 font-medium", children: [VAT_RATE * 100, "% (", VAT_RATE, ")"] })] }), _jsxs("tr", { children: [_jsx("td", { className: "p-3", children: t('slab_rates') }), _jsx("td", { className: "p-3 font-medium", children: SLABS.map(s => s.rate).join(', ') })] })] })] }) }), _jsxs("div", { className: "bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800 text-center", children: [_jsx("div", { className: "text-xs text-indigo-600 dark:text-indigo-400 uppercase font-bold tracking-wider mb-1", children: t('estimated_consumption') }), _jsxs("div", { className: "text-3xl font-bold text-slate-900 dark:text-white", children: [reverseResult.totalUnits.toFixed(2), " ", _jsx("span", { className: "text-lg text-slate-500 dark:text-slate-400 font-medium", children: "kWh" })] })] }), _jsx("div", { className: "space-y-6", children: reverseResult.logicSteps.map((step, idx) => (_jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2", children: step.title }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed", children: step.description }), step.tableHeader && (_jsx("div", { className: "overflow-x-auto mb-2 rounded border border-slate-200 dark:border-slate-700", children: _jsxs("table", { className: "w-full text-xs text-left", children: [_jsx("thead", { className: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium", children: _jsxs("tr", { children: [_jsx("th", { className: "p-2 border-b border-slate-200 dark:border-slate-700", children: t('slab_range') }), _jsx("th", { className: "p-2 border-b border-slate-200 dark:border-slate-700", children: t('units_in_slab') }), _jsx("th", { className: "p-2 border-b border-slate-200 dark:border-slate-700", children: t('rate') }), _jsx("th", { className: "p-2 border-b border-slate-200 dark:border-slate-700", children: t('cost_full_slab') })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900", children: SLABS.map((s, i) => {
                                                            const prev = i === 0 ? 0 : SLABS[i - 1].limit;
                                                            const size = s.limit - prev;
                                                            const cost = size * s.rate;
                                                            return (_jsxs("tr", { children: [_jsxs("td", { className: "p-2", children: [i + 1, " (", prev, "-", s.limit, ")"] }), _jsx("td", { className: "p-2", children: size }), _jsx("td", { className: "p-2", children: s.rate }), _jsx("td", { className: "p-2", children: cost.toFixed(2) })] }, i));
                                                        }) })] }) })), _jsx("div", { className: "space-y-3 pl-2 border-l-2 border-indigo-100 dark:border-indigo-900", children: step.subSteps.map((sub, sIdx) => (_jsxs("div", { className: "bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm", children: [_jsx("div", { className: "text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1", children: sub.label }), _jsx("div", { className: "text-sm text-slate-700 dark:text-slate-300 mb-2", children: sub.text }), _jsx("div", { className: "bg-slate-50 dark:bg-slate-900 p-2 rounded text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 whitespace-pre-wrap", children: sub.calculation }), sub.note && (_jsx("div", { className: "mt-2 text-xs text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded", children: sub.note }))] }, sIdx))) })] }, idx))) }), _jsxs("div", { className: "bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800 text-xs text-green-800 dark:text-green-300 font-medium leading-relaxed", children: [_jsxs("strong", { children: [t('key_takeaway'), ":"] }), " ", t('key_takeaway_text')] })] })) : (_jsx("div", { className: "text-center py-8 text-slate-400 dark:text-slate-500 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700", children: t('enter_bill_prompt') }))] }))] }));
};
export default BillEstimator;
