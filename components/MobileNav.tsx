
import React from 'react';
import { Calculator, BarChart3, FileText, Zap, History } from 'lucide-react';
import { useLanguage } from '../i18n';

interface MobileNavProps {
  currentView: 'input' | 'estimator' | 'report' | 'history';
  onChangeView: (view: 'input' | 'estimator' | 'report' | 'history') => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, onChangeView }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 z-50 lg:hidden pb-safe px-2 py-2 shadow-lg print:hidden">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        <button 
          onClick={() => onChangeView('input')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-1 ${currentView === 'input' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <Calculator className="w-6 h-6" />
          <span className="text-[10px] font-medium">{t('input')}</span>
        </button>

        <button 
           onClick={() => onChangeView('estimator')}
           className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-1 ${currentView === 'estimator' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <Zap className="w-6 h-6" />
          <span className="text-[10px] font-medium">{t('bill_estimator')}</span>
        </button>

        <button 
           onClick={() => onChangeView('report')}
           className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-1 ${currentView === 'report' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <FileText className="w-6 h-6" />
          <span className="text-[10px] font-medium">{t('report')}</span>
        </button>

        <button 
           onClick={() => onChangeView('history')}
           className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors flex-1 ${currentView === 'history' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-medium">{t('history')}</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
