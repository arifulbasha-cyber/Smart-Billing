import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from 'lucide-react';
const ModalWrapper = ({ isOpen, onClose, title, children }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200", children: _jsxs("div", { className: "bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transition-colors duration-200", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 shrink-0", children: [_jsx("h2", { className: "text-lg font-bold text-slate-900 dark:text-white", children: title }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "p-4 overflow-y-auto custom-scrollbar", children: children })] }) }));
};
export default ModalWrapper;
