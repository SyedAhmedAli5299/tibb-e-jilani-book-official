import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { useBook } from '../../contexts/BookContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChapterSelect: (chapterId: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onChapterSelect }) => {
  const [query, setQuery] = useState('');
  const { searchChapters } = useBook();
  const [results, setResults] = useState(searchChapters(''));

  useEffect(() => {
    const searchResults = searchChapters(query);
    setResults(searchResults);
  }, [query, searchChapters]);

  const handleChapterClick = (chapterId: string) => {
    onChapterSelect(chapterId);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold bg-gold-text bg-clip-text text-transparent">
                  Search Chapters
                </h2>
                <Button variant="ghost" size="sm" icon={X} onClick={onClose} />
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search chapters and content..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-islamic-gold-400"
                  autoFocus
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {results.map((chapter) => (
                  <motion.div
                    key={chapter.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      hover
                      onClick={() => handleChapterClick(chapter.id)}
                      className="p-3 cursor-pointer"
                    >
                      <h3 className="font-medium text-white mb-1">{chapter.title}</h3>
                      <p className="text-white/60 text-sm capitalize">
                        {chapter.language} • Chapter {chapter.order}
                      </p>
                    </Card>
                  </motion.div>
                ))}
                {results.length === 0 && query && (
                  <p className="text-white/60 text-center py-4">
                    No chapters found matching "{query}"
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
