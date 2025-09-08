import React from 'react';
import { motion } from 'framer-motion';

const GeometricBackground: React.FC = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 1.5 }
    },
  };

  const shapeVariants = {
    animate: (custom: number) => ({
      rotate: [0, 360],
      transition: {
        duration: 40 + custom * 10,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
      }
    })
  };

  return (
    <motion.div 
      className="absolute inset-0 z-0 overflow-hidden"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-islamic-blue-900 to-islamic-blue-800" />
      
      <div className="absolute inset-0 filter blur-3xl opacity-30">
        {/* Shape 1: Large 8-pointed star */}
        <motion.svg 
          variants={shapeVariants}
          animate="animate"
          custom={1}
          className="absolute top-[5%] left-[10%] w-[300px] h-[300px] text-islamic-gold-700" 
          viewBox="0 0 100 100"
        >
          <path fill="currentColor" d="M50 0 L61.2 38.8 L100 50 L61.2 61.2 L50 100 L38.8 61.2 L0 50 L38.8 38.8 Z" />
        </motion.svg>

        {/* Shape 2: Smaller star */}
        <motion.svg 
          variants={shapeVariants}
          animate="animate"
          custom={2}
          className="absolute bottom-[10%] right-[15%] w-[250px] h-[250px] text-islamic-red"
          viewBox="0 0 100 100"
        >
          <path fill="currentColor" d="M50,5 L61.8,38.2 L98.2,38.2 L68,59.8 L79.6,94.5 L50,75 L20.4,94.5 L32,59.8 L1.8,38.2 L38.2,38.2 Z" />
        </motion.svg>
        
        {/* Shape 3: Crescent */}
        <motion.svg
          variants={shapeVariants}
          animate="animate"
          custom={3}
          className="absolute top-[40%] right-[5%] w-[200px] h-[200px] text-islamic-blue-500"
          viewBox="0 0 100 100"
        >
          <path fill="currentColor" d="M 50 0 A 50 50 0 1 0 50 100 A 40 40 0 1 1 50 0 Z" />
        </motion.svg>

        {/* Shape 4: Another star */}
        <motion.svg
          variants={shapeVariants}
          animate="animate"
          custom={4}
          className="absolute bottom-[25%] left-[5%] w-[200px] h-[200px] text-islamic-gold-500"
          viewBox="0 0 100 100"
        >
          <polygon fill="currentColor" points="50,10 60,40 90,40 65,60 75,90 50,70 25,90 35,60 10,40 40,40" />
        </motion.svg>
      </div>
    </motion.div>
  );
};

export default GeometricBackground;
