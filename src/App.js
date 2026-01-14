import React, { useState } from 'react';
import { OutsideView } from './components/OutsideView';
import { InsideView } from './components/InsideView';
import { useNavigation } from './hooks/useNavigation';

export default function App() {
  const [view, setView] = useState('outside');
  const navigation = useNavigation();

  return (
    <div className="w-full h-screen font-sans text-slate-900 bg-slate-50">
      {view === 'outside' ? (
        <OutsideView onEnter={() => setView('inside')} />
      ) : (
        <InsideView 
          {...navigation}
          onExit={() => setView('outside')}
        />
      )}
    </div>
  );
}