'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import PostCard from './components/PostCard';
import Footer from './components/Footer';
import { createClient } from '@/utils/supabase/client';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  language: 'ko' | 'en';
  image_url: string;
  created_at: string;
  author_name?: string;
  author_avatar?: string;
}

export default function Home() {
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Categories logic
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Pagination logic
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const POSTS_PER_PAGE = 6;

  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, [supabase]);

  useEffect(() => {
    const loadData = async () => {
      // 1. Fetch categories
      const { data: catData, error: catError } = await supabase
        .from('posts')
        .select('category')
        .eq('language', language);
        
      if (catData && !catError) {
        const uniqueCategories = Array.from(new Set(catData.map(item => item.category)));
        setCategories(uniqueCategories as string[]);
      }

      // 2. Fetch posts
      setLoading(true);
      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('language', language);
        
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      
      const from = (page - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;
      
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
        
      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
        if (count) {
          setTotalPages(Math.ceil(count / POSTS_PER_PAGE));
        } else {
          setTotalPages(1);
        }
      }
      setLoading(false);
    };

    loadData();
  }, [language, selectedCategory, page, supabase, POSTS_PER_PAGE]);

  const handleLanguageChange = (newLang: 'ko' | 'en') => {
    setLanguage(newLang);
    setPage(1);
    setSelectedCategory('all');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black font-sans">
      <Header 
        language={language} 
        onLanguageChange={handleLanguageChange} 
        isAuthenticated={isAuthenticated} 
      />
      
      <main className="flex-1">
        <Hero language={language} />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {language === 'ko' ? '최신 글' : 'Latest Posts'}
            </h2>
          </div>
          
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setPage(1); // Reset to first page on category change
            }}
            language={language}
          />

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600"></div>
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3 mt-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} language={language} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
                  >
                    {language === 'ko' ? '이전' : 'Prev'}
                  </button>
                  <div className="flex items-center px-4 text-sm font-medium text-zinc-500">
                    {page} / {totalPages}
                  </div>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
                  >
                    {language === 'ko' ? '다음' : 'Next'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-zinc-500">
              {language === 'ko' ? '게시글이 없습니다.' : 'No posts found.'}
            </div>
          )}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
