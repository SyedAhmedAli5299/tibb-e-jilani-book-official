import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookProvider } from './contexts/BookContext';
import { SettingsProvider } from './contexts/SettingsContext';
import HomePage from './pages/HomePage';
import ReaderPage from './pages/ReaderPage';
import BookmarksPage from './pages/BookmarksPage';
import TestimonialsPage from './pages/TestimonialsPage';
import NotesPage from './pages/NotesPage';
import AdminPortal from './pages/AdminPortal'; // Import the Admin Portal
import GeometricBackground from './components/layout/GeometricBackground';
import { useBook } from './contexts/BookContext';
import { Loader2, RefreshCw } from 'lucide-react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';

const AppContent: React.FC = () => {
  const { loading, error, refreshData } = useBook();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GeometricBackground />
        <div className="relative z-10 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-islamic-gold-400 mx-auto mb-4" />
          <p className="text-white text-lg">Loading Islamic Healthcare Wisdom...</p>
        </div>
      </div>
    );
  }

  if (error) {
    if (error.code === 'PGRST205') {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <GeometricBackground />
          <div className="relative z-10 text-center p-4">
            <Card>
              <h2 className="text-xl font-bold bg-gold-text bg-clip-text text-transparent mb-4">Database Schema Updating</h2>
              <p className="text-white/80 mb-6 max-w-sm">
                The database is synchronizing with the new changes. This can take a moment. Please try again.
              </p>
              <Button onClick={() => refreshData()} icon={RefreshCw}>
                Retry Connection
              </Button>
            </Card>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GeometricBackground />
        <div className="relative z-10 text-center p-4">
          <Card>
            <h2 className="text-xl font-bold text-red-400 mb-4">An Error Occurred</h2>
            <p className="text-white/80 mb-6 max-w-md">
              Failed to load application data. Please check your internet connection and try again.
            </p>
            <pre className="text-left bg-black/20 p-2 rounded-md text-red-300 text-xs overflow-auto max-h-40 mb-6">
              <code>{error.message || JSON.stringify(error)}</code>
            </pre>
            <Button onClick={() => refreshData()} icon={RefreshCw}>
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="relative min-h-screen text-white">
        <GeometricBackground />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reader/:language/:chapterId?" element={<ReaderPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/admin/*" element={<AdminPortal />} /> {/* Add Admin Route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

function App() {
  return (
    <SettingsProvider>
      <BookProvider>
        <AppContent />
      </BookProvider>
    </SettingsProvider>
  );
}

export default App;
