import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useBook } from '../contexts/BookContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { testimonials } = useBook();
  const featuredTestimonials = testimonials.filter(t => t.approved).slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center w-full"
      >
        {/* Title Section from Book Cover */}
        <motion.div variants={itemVariants} className="mb-8 max-w-2xl">
          <h2 className="text-lg md:text-2xl text-white/80 font-arabic" dir="rtl">
            انیسویں صدی میں علم تشریح الابدان (Anatomy)
          </h2>
          <h3 className="text-base md:text-xl text-white/70 font-arabic mb-6" dir="rtl">
            کے ماہر، حکیم محقق ، طبیہ کالج دہلی کے روح رواں
          </h3>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gold-text bg-clip-text text-transparent font-arabic mb-4" dir="rtl">
            سید محمد عبد الرزاق جیلانی
          </h1>
          <p className="text-white/80">(متوفی: 1335ھ/1917ء)</p>
        </motion.div>

        {/* Book Language Selection */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
          <Card 
            hover 
            onClick={() => navigate('/reader/english')}
            className="bg-islamic-blue-900/50 border-islamic-gold-700/50"
          >
            <div className="flex flex-col items-center justify-center h-full p-4">
              <BookOpen className="w-10 h-10 text-islamic-gold-400 mb-4" />
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                English Translation
              </h2>
              <Button variant="secondary" size="sm">
                Start Reading
              </Button>
            </div>
          </Card>

          <Card 
            hover 
            onClick={() => navigate('/reader/urdu')}
            className="bg-islamic-blue-900/50 border-islamic-gold-700/50"
          >
            <div className="flex flex-col items-center justify-center h-full p-4">
              <BookOpen className="w-10 h-10 text-islamic-gold-400 mb-4" />
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 font-urdu" dir="rtl">
                اردو ترجمہ
              </h2>
              <Button variant="secondary" size="sm" className="font-urdu" dir="rtl">
                شروع کریں
              </Button>
            </div>
          </Card>
        </motion.div>
        
        {/* Featured Testimonials Section */}
        {featuredTestimonials.length > 0 && (
          <motion.div variants={itemVariants} className="mt-16 w-full max-w-5xl">
            <h2 className="text-3xl font-bold bg-gold-text bg-clip-text text-transparent mb-8">
              What Our Readers Say
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="flex flex-col text-left">
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating 
                            ? 'text-islamic-gold-400 fill-current' 
                            : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-white/80 italic mb-4 flex-grow">
                    "{testimonial.text}"
                  </p>
                  <p className="font-bold text-white text-right">- {testimonial.name}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="mt-12">
          <Button variant='ghost' onClick={() => navigate('/testimonials')}>View All Testimonials</Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
