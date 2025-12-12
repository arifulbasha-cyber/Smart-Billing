import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useLanguage } from '../i18n';
import { X, Save, Plus, Trash2, Phone, Mail, Edit2 } from 'lucide-react';
const TenantManager = ({ isOpen, onClose, tenants, onUpdateTenants }) => {
    const { t } = useLanguage();
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    if (!isOpen)
        return null;
    const startAdd = () => {
        setEditingId(null);
        setForm({});
        setIsAdding(true);
    };
    const startEdit = (tenant) => {
        setEditingId(tenant.id);
        setForm(tenant);
        setIsAdding(true);
    };
    const cancelEdit = () => {
        setIsAdding(false);
        setEditingId(null);
        setForm({});
    };
    const handleDelete = (id) => {
        if (window.confirm('Delete this tenant?')) {
            onUpdateTenants(tenants.filter(x => x.id !== id));
        }
    };
    const handleSave = () => {
        if (!form.name)
            return;
        if (editingId) {
            // Update
            const updated = tenants.map(t => t.id === editingId ? { ...t, ...form } : t);
            onUpdateTenants(updated);
        }
        else {
            // Create
            const newTenant = {
                id: Date.now().toString(),
                name: form.name,
                phone: form.phone,
                email: form.email
            };
            onUpdateTenants([...tenants, newTenant]);
        }
        cancelEdit();
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transition-colors duration-200", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white", children: t('tenant_manager') }), _jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mt-1", children: t('tenant_desc') })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "p-6 overflow-y-auto flex-1 space-y-6", children: isAdding ? (_jsxs("div", { className: "space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700", children: [_jsx("h3", { className: "font-bold text-slate-700 dark:text-slate-200 text-sm uppercase mb-2", children: editingId ? 'Edit Tenant' : 'Add New Tenant' }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1", children: t('name') }), _jsx("input", { type: "text", value: form.name || '', onChange: e => setForm({ ...form, name: e.target.value }), className: "w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-indigo-500", placeholder: "e.g. Uttom", autoFocus: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1", children: t('phone') }), _jsx("input", { type: "text", value: form.phone || '', onChange: e => setForm({ ...form, phone: e.target.value }), className: "w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-indigo-500", placeholder: "017..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1", children: t('email') }), _jsx("input", { type: "email", value: form.email || '', onChange: e => setForm({ ...form, email: e.target.value }), className: "w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-indigo-500", placeholder: "example@gmail.com" })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsxs("button", { onClick: handleSave, className: "flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm", children: [_jsx(Save, { className: "w-4 h-4 inline mr-1" }), " Save"] }), _jsx("button", { onClick: cancelEdit, className: "flex-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors", children: "Cancel" })] })] })) : (_jsxs("div", { className: "space-y-3", children: [_jsxs("button", { onClick: startAdd, className: "w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2 group", children: [_jsx("div", { className: "bg-slate-100 dark:bg-slate-800 p-1 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors", children: _jsx(Plus, { className: "w-4 h-4" }) }), t('add_tenant')] }), tenants.length === 0 && (_jsx("div", { className: "text-center text-slate-400 text-sm py-8", children: t('no_tenants') })), _jsx("div", { className: "space-y-2", children: tenants.map(tenant => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-sm transition-colors group", children: [_jsxs("div", { className: "flex items-center gap-3 overflow-hidden", children: [_jsx("div", { className: "w-10 h-10 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm", children: tenant.name.substring(0, 2).toUpperCase() }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-bold text-slate-800 dark:text-slate-200 text-sm truncate", children: tenant.name }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:gap-3 text-xs text-slate-500 dark:text-slate-400", children: [tenant.phone && _jsxs("span", { className: "flex items-center gap-1 truncate", children: [_jsx(Phone, { className: "w-3 h-3" }), " ", tenant.phone] }), tenant.email && _jsxs("span", { className: "flex items-center gap-1 truncate", children: [_jsx(Mail, { className: "w-3 h-3" }), " ", tenant.email] })] })] })] }), _jsxs("div", { className: "flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2", children: [_jsx("button", { onClick: () => startEdit(tenant), className: "p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(tenant.id), className: "p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, tenant.id))) })] })) })] }) }));
};
export default TenantManager;
