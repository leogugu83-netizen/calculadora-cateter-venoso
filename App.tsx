import React from 'react';
import InfusionCalculator from './components/InfusionCalculator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-200 selection:text-rose-900">
      <main className="py-8 md:py-12">
        <InfusionCalculator />
      </main>
      
      <footer className="w-full text-center py-6 text-slate-400 text-sm border-t border-slate-200 mt-auto">
        <p>© {new Date().getFullYear()} HemoCalc. Ferramenta de auxílio clínico.</p>
        <p className="text-xs mt-1">Sempre siga os protocolos institucionais locais.</p>
      </footer>
    </div>
  );
};

export default App;