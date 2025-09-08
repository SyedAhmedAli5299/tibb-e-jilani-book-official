import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Chapter {
  id: string;
  title: string;
  content: string;
  language: 'english' | 'urdu';
  order: number;
  images?: string[];
}

export interface Bookmark {
  id: string;
  chapterId: string;
  position: number;
  note?: string;
  createdAt: Date;
}

export interface Note {
  id:string;
  chapterId: string;
  position: number;
  text: string;
  createdAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  approved: boolean;
  createdAt: Date;
}

interface BookContextType {
  chapters: Chapter[];
  bookmarks: Bookmark[];
  notes: Note[];
  testimonials: Testimonial[];
  currentChapter: Chapter | null;
  loading: boolean;
  error: any | null;
  setCurrentChapter: (chapter: Chapter) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => Promise<void>;
  updateNote: (id: string, text: string) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'approved'>) => Promise<void>;
  searchChapters: (query: string) => Chapter[];
  // Admin functions
  addChapter: (chapter: Omit<Chapter, 'id'>) => Promise<void>;
  updateChapter: (id: string, chapter: Omit<Chapter, 'id'>) => Promise<void>;
  deleteChapter: (id: string) => Promise<void>;
  updateTestimonial: (id: string, testimonial: Partial<Omit<Testimonial, 'id'>>) => Promise<void>;
  removeTestimonial: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  const refreshData = async () => {
    if (!supabase) {
      console.warn("Supabase not initialized, skipping data refresh.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [chaptersRes, testimonialsRes, bookmarksRes, notesRes] = await Promise.all([
        supabase.from('chapters').select('*').order('order'),
        supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
        supabase.from('bookmarks').select('*').order('created_at', { ascending: false }),
        supabase.from('notes').select('*').order('created_at', { ascending: false })
      ]);

      if (chaptersRes.error) throw chaptersRes.error;
      setChapters(chaptersRes.data?.map(c => ({ ...c, language: c.language as 'english' | 'urdu', images: c.images || [] })) || []);

      if (testimonialsRes.error) throw testimonialsRes.error;
      setTestimonials(testimonialsRes.data?.map(t => ({ ...t, createdAt: new Date(t.created_at) })) || []);

      if (bookmarksRes.error) throw bookmarksRes.error;
      setBookmarks(bookmarksRes.data?.map(b => ({ id: b.id, chapterId: b.chapter_id, position: b.position, note: b.note || undefined, createdAt: new Date(b.created_at) })) || []);

      if (notesRes.error) throw notesRes.error;
      setNotes(notesRes.data?.map(n => ({ id: n.id, chapterId: n.chapter_id, position: n.position, text: n.text, createdAt: new Date(n.created_at) })) || []);

    } catch (error) {
      console.error('Error loading data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    refreshData();
  }, []);

  const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { data, error } = await supabase.from('bookmarks').insert({ chapter_id: bookmark.chapterId, position: bookmark.position, note: bookmark.note }).select().single();
      if (error) throw error;
      const newBookmark: Bookmark = { id: data.id, chapterId: data.chapter_id, position: data.position, note: data.note || undefined, createdAt: new Date(data.created_at) };
      setBookmarks(prev => [...prev, newBookmark]);
    } catch (error) { console.error('Error adding bookmark:', error); throw error; }
  };

  const removeBookmark = async (id: string) => {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id);
      if (error) throw error;
      setBookmarks(prev => prev.filter(b => b.id !== id));
    } catch (error) { console.error('Error removing bookmark:', error); throw error; }
  };

  const addNote = async (note: Omit<Note, 'id' | 'createdAt'>) => {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { data, error } = await supabase.from('notes').insert({ chapter_id: note.chapterId, position: note.position, text: note.text }).select().single();
      if (error) throw error;
      const newNote: Note = { id: data.id, chapterId: data.chapter_id, position: data.position, text: data.text, createdAt: new Date(data.created_at) };
      setNotes(prev => [...prev, newNote]);
    } catch (error) { console.error('Error adding note:', error); throw error; }
  };

  const updateNote = async (id: string, text: string) => {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { error } = await supabase.from('notes').update({ text }).eq('id', id);
      if (error) throw error;
      setNotes(prev => prev.map(n => n.id === id ? { ...n, text } : n));
    } catch (error) { console.error('Error updating note:', error); throw error; }
  };

  const removeNote = async (id: string) => {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (error) { console.error('Error removing note:', error); throw error; }
  };

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'approved'>) => {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      await supabase.from('testimonials').insert({ name: testimonial.name, text: testimonial.text, rating: testimonial.rating, approved: false });
      // No need to add to local state, it will be pending until approved. A refresh can show it in admin.
    } catch (error) { console.error('Error adding testimonial:', error); throw error; }
  };

  const searchChapters = (query: string): Chapter[] => {
    if (!query.trim()) return chapters;
    return chapters.filter(c => c.title.toLowerCase().includes(query.toLowerCase()) || c.content.toLowerCase().includes(query.toLowerCase()));
  };

  const addChapter = async (chapter: Omit<Chapter, 'id'>) => {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { data, error } = await supabase.from('chapters').insert({ ...chapter }).select().single();
      if (error) throw error;
      const newChapter: Chapter = { ...data, language: data.language as 'english' | 'urdu', images: data.images || [] };
      setChapters(prev => [...prev, newChapter].sort((a, b) => a.order - b.order));
    } catch (error) { console.error('Error adding chapter:', error); throw error; }
  };

  const updateChapter = async (id: string, chapter: Omit<Chapter, 'id'>) => {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { error } = await supabase.from('chapters').update({ ...chapter, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
      setChapters(prev => prev.map(c => c.id === id ? { ...chapter, id } : c).sort((a, b) => a.order - b.order));
    } catch (error) { console.error('Error updating chapter:', error); throw error; }
  };

  const deleteChapter = async (id: string) => {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { error } = await supabase.from('chapters').delete().eq('id', id);
      if (error) throw error;
      setChapters(prev => prev.filter(c => c.id !== id));
    } catch (error) { console.error('Error deleting chapter:', error); throw error; }
  };

  const updateTestimonial = async (id: string, testimonialUpdate: Partial<Omit<Testimonial, 'id'>>) => {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { error } = await supabase.from('testimonials').update(testimonialUpdate).eq('id', id);
      if (error) throw error;
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...testimonialUpdate } : t));
    } catch (error) { console.error('Error updating testimonial:', error); throw error; }
  };

  const removeTestimonial = async (id: string) => {
    if (!supabase) throw new Error("Supabase not initialized");
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (error) { console.error('Error removing testimonial:', error); throw error; }
  };

  const value: BookContextType = { chapters, bookmarks, notes, testimonials, currentChapter, loading, error, setCurrentChapter, addBookmark, removeBookmark, addNote, updateNote, removeNote, addTestimonial, searchChapters, addChapter, updateChapter, deleteChapter, updateTestimonial, removeTestimonial, refreshData };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBook = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) throw new Error('useBook must be used within a BookProvider');
  return context;
};
