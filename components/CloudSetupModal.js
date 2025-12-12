import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useLanguage } from '../i18n';
import { X, Cloud, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { firebaseService } from '../services/firebase';
const CloudSetupModal = ({ isOpen, onClose, onConnected }) => {
    const { t } = useLanguage();
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState(null);
    if (!isOpen)
        return null;
    const handleConnect = () => {
        setError(null);
        let input = jsonInput.trim();
        // Robust parsing logic to handle direct copy-paste from Firebase Console
        try {
            // 1. Strip "const firebaseConfig =" and trailing semicolon if present
            if (input.includes('=')) {
                input = input.substring(input.indexOf('=') + 1).trim();
            }
            if (input.endsWith(';')) {
                input = input.slice(0, -1).trim();
            }
            // 2. Use Function constructor to parse valid JS object literal (relaxed JSON)
            // This handles unquoted keys like { apiKey: "..." } which JSON.parse would fail on
            const configObject = new Function('return ' + input)();
            // 3. Validate critical fields
            if (!configObject.apiKey || !configObject.authDomain || !configObject.projectId) {
                throw new Error("Missing required Firebase keys (apiKey, authDomain, or projectId).");
            }
            firebaseService.initialize(configObject);
            onConnected();
            onClose();
        }
        catch (e) {
            setError("Invalid Configuration. Please copy the 'firebaseConfig' object exactly from the Firebase Console.");
            console.error(e);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transition-colors duration-200", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2", children: [_jsx(Cloud, { className: "w-6 h-6 text-indigo-600 dark:text-indigo-400" }), " ", t('cloud_setup')] }), _jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mt-1", children: t('cloud_desc') })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "p-6 space-y-4 overflow-y-auto", children: [error && (_jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 shrink-0" }), error] })), _jsxs("div", { className: "bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800", children: [_jsx("h3", { className: "text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase mb-2", children: "Before Connecting:" }), _jsxs("ul", { className: "space-y-2 text-sm text-slate-700 dark:text-slate-300", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(CheckCircle2, { className: "w-4 h-4 text-green-500 mt-0.5 shrink-0" }), _jsxs("span", { children: ["Enable ", _jsx("strong", { children: "Authentication" }), " (Google Sign-in) in Firebase Console."] })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx(CheckCircle2, { className: "w-4 h-4 text-green-500 mt-0.5 shrink-0" }), _jsxs("span", { children: ["Create ", _jsx("strong", { children: "Firestore Database" }), " (Start in Test Mode)."] })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2", children: t('paste_config') }), _jsx("textarea", { value: jsonInput, onChange: (e) => setJsonInput(e.target.value), className: "w-full h-32 p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", placeholder: 'const firebaseConfig = {\n  apiKey: "...",\n  authDomain: "...",\n  ...\n};' }), _jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-500 mt-2 leading-relaxed", children: ["Copy the entire ", _jsx("code", { children: "const firebaseConfig = ..." }), " block from ", _jsx("strong", { children: "Project Settings > General > Your Apps" }), "."] })] })] }), _jsxs("div", { className: "p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg", children: t('cancel') }), _jsxs("button", { onClick: handleConnect, className: "px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 rounded-lg shadow-sm flex items-center gap-2", children: [_jsx(Save, { className: "w-4 h-4" }), " ", t('connect')] })] })] }) }));
};
export default CloudSetupModal;
