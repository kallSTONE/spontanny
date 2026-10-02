import { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { HomePage } from '@/pages/HomePage';
import { TrainPage } from '@/pages/TrainPage';
import { ScenariosPage } from '@/pages/ScenariosPage';
import { ReplayPage } from '@/pages/ReplayPage';  
import { ProgressPage } from '@/pages/ProgressPage';  

export type PageId = 'home' | 'train' | 'scenarios' | 'replay' | 'progress';

function App() {
  const [page, setPage] = useState<PageId>('home');

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <NavBar current={page} onNavigate={setPage} />
      <main className="md:pl-64">
        <div className="mx-auto max-w-3xl px-5 pb-24 pt-6 md:px-8 md:pb-12">
          {page === 'home' && <HomePage onNavigate={setPage} />}
          {page === 'train' && <TrainPage />}
          {page === 'scenarios' && <ScenariosPage />}
          {page === 'replay' && <ReplayPage />}
          {page === 'progress' && <ProgressPage />}
        </div>
      </main>
    </div>
  );
}

export default App;
