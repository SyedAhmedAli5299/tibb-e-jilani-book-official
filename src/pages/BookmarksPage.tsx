import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Trash2, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBook } from '../contexts/BookContext';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookmarks, chapters, removeBookmark } = useBook();

  const getChapterInfo = (chapterId: string) => {
    return chapters.find(c => c.id === chapterId);
  };

  const handleBookmarkClick = (bookmark: typeof bookmarks[0]) => {
    const chapter = getChapterInfo(bookmark.chapterId);
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
      <Header title="Bookmarks" showBack showHome />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-6"
      >
        {bookmarks.length === 0 ? (
          <motion.div variants={itemVariants} className="text-center py-12">
            <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Bookmark className="w-10 h-10 text-white/60" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Bookmarks Yet</h2>
            <p className="text-white/70 mb-6">
              Start reading and save your favorite passages
            </p>
            <Button onClick={() => navigate('/')}>
              Start Reading
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => {
              const chapter = getChapterInfo(bookmark.chapterId);
              if (!chapter) return null;

              return (
                <motion.div key={bookmark.id} variants={itemVariants}>
                  <Card hover onClick={() => handleBookmarkClick(bookmark)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Bookmark className="w-5 h-5 text-islamic-gold-400 mr-2" />
                          <h3 className="font-bold text-white">{chapter.title}</h3>
                        </div>
                        
                        <div className="flex items-center text-white/60 text-sm mb-3">
                          <FileText className="w-4 h-4 mr-1" />
                          <span className="capitalize">{chapter.language} Translation</span>
                          <span className="mx-2">•</span>
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{bookmark.createdAt.toLocaleDateString()}</span>
                        </div>

                        {bookmark.note && (
                          <p className="text-white/80 text-sm italic mb-2">
                            "{bookmark.note}"
                          </p>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(bookmark.id);
                        }}
                        className="text-red-400 hover:text-red-300"
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

export default BookmarksPage;
