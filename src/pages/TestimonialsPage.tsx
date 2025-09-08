import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Plus, Send } from 'lucide-react';
import { useBook } from '../contexts/BookContext';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const TestimonialsPage: React.FC = () => {
  const { testimonials, addTestimonial } = useBook();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    rating: 5
  });

  const approvedTestimonials = testimonials.filter(t => t.approved);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim()) return;

    addTestimonial(formData);
    setFormData({ name: '', text: '', rating: 5 });
    setShowAddForm(false);
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
      <Header title="Reader Testimonials" showBack showHome />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-6"
      >
        {/* Add Testimonial Button */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gold-text bg-clip-text text-transparent">
              Community Reviews
            </h2>
            <Button
              icon={Plus}
              onClick={() => setShowAddForm(true)}
            >
              Add Review
            </Button>
          </div>
        </motion.div>

        {/* Testimonials List */}
        {approvedTestimonials.length === 0 ? (
          <motion.div variants={itemVariants} className="text-center py-12">
            <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-6 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Reviews Yet</h3>
            <p className="text-white/70 mb-6">
              Be the first to share your thoughts about this book
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              Write First Review
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {approvedTestimonials.map((testimonial) => (
              <motion.div key={testimonial.id} variants={itemVariants}>
                <Card>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-white mb-1">{testimonial.name}</h3>
                      <div className="flex items-center">
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
                    </div>
                    <span className="text-white/50 text-sm">
                      {testimonial.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-white/80 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Add Testimonial Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card>
                <h2 className="text-xl font-bold bg-gold-text bg-clip-text text-transparent mb-6">
                  Share Your Review
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-islamic-gold-400"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Rating</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              rating <= formData.rating
                                ? 'text-islamic-gold-400 fill-current'
                                : 'text-white/30'
                            } hover:text-islamic-gold-400 transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Your Review</label>
                    <textarea
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      className="w-full h-32 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-islamic-gold-400"
                      placeholder="Share your thoughts about this book..."
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" icon={Send}>
                      Submit Review
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestimonialsPage;
