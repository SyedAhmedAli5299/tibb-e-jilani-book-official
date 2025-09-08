import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Search, Bookmark, MessageSquare, Home, StickyNote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useScrollDirection } from '../../hooks/useScrollDirection';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showHome?: boolean;
  showSearch?: boolean;
  onSearchClick?: () => void;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  showBookmarks?: boolean;
  showNotes?: boolean; // Add prop for notes
  showTestimonials?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showHome = false,
  showSearch = false,
  onSearchClick,
  showSettings = false,
  onSettingsClick,
  showBookmarks = false,
  showNotes = false, // Add prop for notes
  showTestimonials = false,
}) => {
  const navigate = useNavigate();
  const scrollDirection = useScrollDirection();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const variants = {
    visible: { y: 0 },
    hidden: { y: '-100%' }
  };

  return (
    <motion.header
      variants={variants}
      animate={scrolled && scrollDirection === 'down' ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="bg-islamic-blue-900/50 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-40"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              onClick={handleBack}
              className="flex-shrink-0"
            >
              <span className="hidden md:inline">Back</span>
            </Button>
          )}
          {showHome && (
            <Button
              variant="ghost"
              size="sm"
              icon={Home}
              onClick={() => navigate('/')}
              className="flex-shrink-0"
            >
             <span className="hidden md:inline">Home</span>
            </Button>
          )}
          {title && (
            <h1 className="text-lg md:text-xl font-bold bg-gold-text bg-clip-text text-transparent truncate">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
          {showSearch && (
            <Button
              variant="ghost"
              size="sm"
              icon={Search}
              onClick={onSearchClick}
            />
          )}
          {showBookmarks && (
            <Button
              variant="ghost"
              size="sm"
              icon={Bookmark}
              onClick={() => navigate('/bookmarks')}
            />
          )}
          {showNotes && ( // Add notes button
            <Button
              variant="ghost"
              size="sm"
              icon={StickyNote}
              onClick={() => navigate('/notes')}
            />
          )}
          {showTestimonials && (
            <Button
              variant="ghost"
              size="sm"
              icon={MessageSquare}
              onClick={() => navigate('/testimonials')}
            />
          )}
          {showSettings && (
            <Button
              variant="ghost"
              size="sm"
              icon={Settings}
              onClick={onSettingsClick}
            />
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
