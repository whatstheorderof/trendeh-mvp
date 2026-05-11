import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { GenerateIdeas } from './components/GenerateIdeas';
import { SavedIdeas } from './components/SavedIdeas';
import { Course } from './components/Course';
import { Upgrade } from './components/Upgrade';
import { ViewState, Idea } from './types';
import { AuthProvider } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [selectedIdeaForCourse, setSelectedIdeaForCourse] = useState<Idea | null>(null);

  const handleSaveIdea = (idea: Idea) => {
    setSavedIdeas(prev => {
      const isAlreadySaved = prev.some(s => s.id === idea.id);
      if (isAlreadySaved) {
        return prev.filter(s => s.id !== idea.id);
      } else {
        return [...prev, idea];
      }
    });
  };

  const handleRemoveIdea = (ideaId: string) => {
    setSavedIdeas(prev => prev.filter(s => s.id !== ideaId));
    if (selectedIdeaForCourse?.id === ideaId) {
      setSelectedIdeaForCourse(null);
    }
  };

  const handleApplyToCourse = (idea: Idea) => {
    setSelectedIdeaForCourse(idea);
    setCurrentView('course');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard savedIdeas={savedIdeas} onNavigate={setCurrentView} onApplyToCourse={handleApplyToCourse} />;
      case 'generate':
        return <GenerateIdeas onSaveIdea={handleSaveIdea} savedIdeas={savedIdeas} />;
      case 'saved':
        return <SavedIdeas savedIdeas={savedIdeas} onRemoveIdea={handleRemoveIdea} onApplyToCourse={handleApplyToCourse} />;
      case 'course':
        return <Course selectedIdea={selectedIdeaForCourse} onSelectIdea={() => setCurrentView('saved')} />;
      case 'upgrade':
        return <Upgrade />;
      default:
        return <Dashboard savedIdeas={savedIdeas} onNavigate={setCurrentView} onApplyToCourse={handleApplyToCourse} />;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center print:p-0 print:block print:bg-white">
      {/* Main App Window */}
      <div className="w-full max-w-[1400px] h-[90vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex border border-white/40 backdrop-blur-sm print:h-auto print:shadow-none print:border-none print:rounded-none print:block">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        
        <main className="flex-1 overflow-y-auto p-8 md:p-12 bg-white print:overflow-visible print:p-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
