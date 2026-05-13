'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import PostCard from '@/app/components/PostCard';
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
  author_name: string;
  author_avatar: string;
}

export default function UserProfile() {
  const params = useParams();
  const authorName = decodeURIComponent(params.name as string);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');

  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, [supabase]);

  useEffect(() => {
    if (!authorName) return;
    
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_name', authorName)
        .order('created_at', { ascending: false });
        
      if (data && !error) {
        setPosts(data);
      }
      setLoading(false);
    };
    
    fetchPosts();
  }, [authorName, supabase]);

  // Derived profile info from the first post
  const authorAvatar = posts.length > 0 && posts[0].author_avatar 
    ? posts[0].author_avatar 
    : 'https://github.com/shadcn.png';
    
  // Filter posts by current selected UI language
  const displayedPosts = posts.filter(p => p.language === language);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black font-sans">
        <Header language={language} onLanguageChange={setLanguage} isAuthenticated={isAuthenticated} />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black font-sans">
      <Header 
        language={language} 
        onLanguageChange={setLanguage} 
        isAuthenticated={isAuthenticated} 
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Profile Header Section */}
        <section className="mb-16 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6 inline-block">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-70 blur-md dark:opacity-50"></div>
            <img 
              src={authorAvatar} 
              alt={authorName} 
              className="relative h-32 w-32 rounded-full object-cover shadow-lg ring-4 ring-white dark:ring-black"
            />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            {authorName}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            {language === 'ko' 
              ? '전문 지식과 통찰력을 바탕으로 다양한 주제의 글을 작성하고 공유합니다.' 
              : 'Writing and sharing articles on various topics based on expertise and insights.'}
          </p>
          
          <div className="mt-8 flex gap-4">
            <div className="flex flex-col items-center rounded-2xl bg-zinc-50 px-8 py-4 dark:bg-zinc-900">
              <span className="text-3xl font-bold text-zinc-900 dark:text-white">{posts.length}</span>
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {language === 'ko' ? '총 작성 글' : 'Total Posts'}
              </span>
            </div>
          </div>
        </section>

        {/* Authored Posts Grid */}
        <section>
          <div className="mb-8 border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {language === 'ko' ? '작성한 글 목록' : 'Published Articles'}
            </h2>
          </div>
          
          {displayedPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {displayedPosts.map((post) => (
                <PostCard key={post.id} post={post} language={language} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 py-24 dark:border-zinc-800">
              <p className="text-lg text-zinc-500 dark:text-zinc-400">
                {language === 'ko' 
                  ? '해당 언어로 작성된 글이 없습니다.' 
                  : 'No articles written in this language.'}
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer language={language} />
    </div>
  );
}
