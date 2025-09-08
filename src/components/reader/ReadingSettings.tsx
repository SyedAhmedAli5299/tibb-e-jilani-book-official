import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Type } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface ReadingSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReadingSettings: React.FC<ReadingSettingsProps> = ({ isOpen, onClose }) => {
  const { fontSize, brightness, isDarkMode, setFontSize, setBrightness, setDarkMode } = useSettings();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold bg-gold-text bg-clip-text text-transparent">
                  Reading Settings
                </h2>
                <Button variant="ghost" size="sm" icon={X} onClick={onClose} />
              </div>

              <div className="space-y-6">
                {/* Font Size */}
                <div>
                  <div className="flex items-center mb-3">
                    <Type className="w-4 h-4 mr-2 text-islamic-gold-400" />
                    <span className="text-white font-medium">Font Size</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-white/60 text-sm">A</span>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="flex-1 slider"
                    />
                    <span className="text-white/60 text-lg">A</span>
                  </div>
                  <p className="text-white/40 text-sm mt-1">{fontSize}px</p>
                </div>

                {/* Brightness */}
                <div>
                  <div className="flex items-center mb-3">
                    <Sun className="w-4 h-4 mr-2 text-islamic-gold-400" />
                    <span className="text-white font-medium">Brightness</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Sun className="w-4 h-4 text-white/60" />
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="flex-1 slider"
                    />
                    <Sun className="w-5 h-5 text-white/60" />
                  </div>
                  <p className="text-white/40 text-sm mt-1">{brightness}%</p>
                </div>

                {/* Theme Toggle */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {isDarkMode ? (
                        <Moon className="w-4 h-4 mr-2 text-islamic-gold-400" />
                      ) : (
                        <Sun className="w-4 h-4 mr-2 text-islamic-gold-400" />
                      )}
                      <span className="text-white font-medium">Dark Mode</span>
                    </div>
                    <Button
                      variant={isDarkMode ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setDarkMode(!isDarkMode)}
                    >
                      {isDarkMode ? 'On' : 'Off'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReadingSettings;
