import React from 'react';
import { motion } from 'framer-motion';
import { StickyNote, Trash2, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBook } from '../contexts/BookContext';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const { notes, chapters, removeNote } = useBook();

  const getChapterInfo = (chapterId: string) => {
    return chapters.find(c => c.id === chapterId);
  };

  const handleNoteClick = (note: typeof notes[0]) => {
    const chapter = getChapterInfo(note.chapterId);
    if (chapter) {
      navigate(`/reader/${chapter.language}/${chapter.id}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen">
      <Header title="My Notes" showBack showHome />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-6"
      >
        {notes.length === 0 ? (
          <motion.div variants={itemVariants} className="text-center py-12">
            <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-6 flex items-center justify-center">
              <StickyNote className="w-10 h-10 text-white/60" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Notes Yet</h2>
            <p className="text-white/70 mb-6">
              You can add notes to any chapter while reading.
            </p>
            <Button onClick={() => navigate('/')}>
              Start Reading
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => {
              const chapter = getChapterInfo(note.chapterId);
              if (!chapter) return null;

              return (
                <motion.div key={note.id} variants={itemVariants}>
                  <Card hover onClick={() => handleNoteClick(note)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white/90 italic mb-3">
                          "{note.text}"
                        </p>
                        
                        <div className="flex items-center text-white/60 text-sm">
                          <FileText className="w-4 h-4 mr-2" />
                          <span className="font-medium mr-2">Chapter:</span>
                          <span className="truncate mr-4">{chapter.title}</span>
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{note.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNote(note.id);
                        }}
                        className="text-red-400 hover:text-red-300 ml-4"
                      />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NotesPage;
