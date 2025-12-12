import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext(undefined);
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('tmss_theme');
        if (saved === 'dark' || saved === 'light')
            return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        }
        else {
            root.classList.remove('dark');
        }
        localStorage.setItem('tmss_theme', theme);
    }, [theme]);
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };
    return (_jsx(ThemeContext.Provider, { value: { theme, toggleTheme }, children: children }));
};
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context)
        throw new Error("useTheme must be used within ThemeProvider");
    return context;
};
