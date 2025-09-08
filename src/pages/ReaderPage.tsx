import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, StickyNote } from 'lucide-react';
import { useBook } from '../contexts/BookContext';
import { useSettings } from '../contexts/SettingsContext';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ReadingSettings from '../components/reader/ReadingSettings';
import SearchModal from '../components/reader/SearchModal';

const ReaderPage: React.FC = () => {
  const { language, chapterId } = useParams<{ language: string; chapterId: string }>();
  const navigate = useNavigate();
  const { chapters, bookmarks, notes, addBookmark, removeBookmark, addNote, setCurrentChapter } = useBook();
  const { fontSize, brightness, isDarkMode } = useSettings();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');

  const filteredChapters = chapters.filter(c => c.language === language).sort((a, b) => a.order - b.order);
  
  // If no chapterId is provided, default to the first chapter of the selected language
  const currentChapterId = chapterId || (filteredChapters.length > 0 ? filteredChapters[0].id : undefined);
  
  const currentChapter = currentChapterId 
    ? chapters.find(c => c.id === currentChapterId)
    : undefined;
  
  const currentIndex = filteredChapters.findIndex(c => c.id === currentChapter?.id);
  const hasNext = currentIndex !== -1 && currentIndex < filteredChapters.length - 1;
  const hasPrev = currentIndex > 0;

  const isBookmarked = currentChapter ? bookmarks.some(b => b.chapterId === currentChapter.id) : false;
  const chapterNotes = currentChapter ? notes.filter(n => n.chapterId === currentChapter.id) : [];

  useEffect(() => {
    if (currentChapter) {
      setCurrentChapter(currentChapter);
    }
  }, [currentChapter, setCurrentChapter]);

  const handleNext = () => {
    if (hasNext) {
      const nextChapter = filteredChapters[currentIndex + 1];
      navigate(`/reader/${language}/${nextChapter.id}`);
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      const prevChapter = filteredChapters[currentIndex - 1];
      navigate(`/reader/${language}/${prevChapter.id}`);
    }
  };

  const handleBookmark = () => {
    if (!currentChapter) return;
    
    if (isBookmarked) {
      const bookmark = bookmarks.find(b => b.chapterId === currentChapter.id);
      if (bookmark) removeBookmark(bookmark.id);
    } else {
      addBookmark({ chapterId: currentChapter.id, position: 0 });
    }
  };

  const handleAddNote = () => {
    if (!currentChapter || !noteText.trim()) return;
    addNote({ chapterId: currentChapter.id, position: 0, text: noteText.trim() });
    setNoteText('');
    setShowNoteInput(false);
  };

  const handleChapterSelect = (selectedChapterId: string) => {
    navigate(`/reader/${language}/${selectedChapterId}`);
  };

  if (!currentChapter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Header title="Not Found" showBack showHome />
        <p className="text-white text-lg mt-8">Chapter not found or book has no chapters.</p>
        <Button onClick={() => navigate('/')} className="mt-4">Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        title={currentChapter.title}
        showBack
        showHome
        showSearch
        onSearchClick={() => setShowSearch(true)}
        showSettings
        onSettingsClick={() => setShowSettings(true)}
        showBookmarks
        showNotes
      />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="secondary" size="sm" onClick={() => setShowChapterList(true)}>
            Chapters ({currentIndex + 1}/{filteredChapters.length})
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" icon={isBookmarked ? BookmarkCheck : Bookmark} onClick={handleBookmark} />
            <Button variant="ghost" size="sm" icon={StickyNote} onClick={() => setShowNoteInput(true)} />
          </div>
        </div>

        <motion.div key={currentChapter.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
          <Card className="mb-6 bg-transparent border-0 shadow-none p-0">
            <div 
              className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert' : ''}`}
              style={{ fontSize: `${fontSize}px`, filter: `brightness(${brightness}%)`, fontFamily: language === 'urdu' ? 'Noto Nastaliq Urdu, serif' : 'inherit', direction: language === 'urdu' ? 'rtl' : 'ltr' }}
            >
              <h1 className="text-2xl md:text-3xl font-bold bg-gold-text bg-clip-text text-transparent mb-6">{currentChapter.title}</h1>
              {currentChapter.images && currentChapter.images.length > 0 ? (
                <div className="space-y-4">
                  {currentChapter.images.map((image, index) => (
                    <img key={index} src={image} alt={`${currentChapter.title} - Image ${index + 1}`} className="w-full h-auto rounded-lg shadow-lg" />
                  ))}
                </div>
              ) : (
                <div className="text-white/90 leading-relaxed whitespace-pre-line">{currentChapter.content}</div>
              )}
              {currentChapter.images && currentChapter.images.length > 0 && currentChapter.content && (
                <div className="mt-6 text-white/90 leading-relaxed whitespace-pre-line">{currentChapter.content}</div>
              )}
            </div>
          </Card>
        </motion.div>

        {chapterNotes.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h3 className="text-lg font-bold bg-gold-text bg-clip-text text-transparent mb-4">Your Notes for this Chapter</h3>
            <div className="space-y-3">{chapterNotes.map((note) => (<Card key={note.id} className="p-4"><p className="text-white/80 text-sm italic">"{note.text}"</p><p className="text-white/50 text-xs mt-2">{note.createdAt.toLocaleDateString()}</p></Card>))}</div>
          </motion.div>
        )}

        <div className="flex items-center justify-between mt-8">
          <Button variant="secondary" icon={ChevronLeft} onClick={handlePrev} disabled={!hasPrev}>Previous</Button>
          <Button variant="secondary" onClick={handleNext} disabled={!hasNext}>Next<ChevronRight className="w-4 h-4 ml-2" /></Button>
        </div>
      </div>

      <AnimatePresence>
        {showChapterList && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowChapterList(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md max-h-[80vh] overflow-y-auto"><Card>
              <h2 className="text-xl font-bold bg-gold-text bg-clip-text text-transparent mb-4">{language === 'english' ? 'Chapters' : 'ابواب'}</h2>
              <div className="space-y-2">{filteredChapters.map((chapter, index) => (<motion.div key={chapter.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}><Card hover onClick={() => { handleChapterSelect(chapter.id); setShowChapterList(false); }} className={`p-3 ${chapter.id === currentChapter.id ? 'bg-islamic-gold-400/20 border-islamic-gold-400' : ''}`}><div className="flex items-center justify-between"><span className="font-medium text-white">{chapter.title}</span><span className="text-islamic-gold-400 text-sm">{index + 1}</span></div></Card></motion.div>))}</div>
            </Card></motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNoteInput && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNoteInput(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md"><Card>
              <h2 className="text-lg font-bold bg-gold-text bg-clip-text text-transparent mb-4">Add Note</h2>
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Write your personal insight or reflection..." className="w-full h-32 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-islamic-gold-400" autoFocus />
              <div className="flex items-center justify-end space-x-3 mt-4"><Button variant="ghost" size="sm" onClick={() => setShowNoteInput(false)}>Cancel</Button><Button size="sm" onClick={handleAddNote} disabled={!noteText.trim()}>Add Note</Button></div>
            </Card></motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReadingSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} onChapterSelect={handleChapterSelect} />
    </div>
  );
};

export default ReaderPage;
