'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Share2, User } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
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
  translation_group_id: string;
}

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, [supabase]);

  useEffect(() => {
    if (!id) return;
    
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (data && !error) {
        setPost(data);
      }
      setLoading(false);
    };
    
    fetchPost();
  }, [id, supabase]);

  const handleLanguageSwitch = async (targetLang: 'ko' | 'en') => {
    if (!post) return;
    if (post.language === targetLang) return; // Already in target language

    // Find the localized version of this post
    const { data, error } = await supabase
      .from('posts')
      .select('id')
      .eq('translation_group_id', post.translation_group_id)
      .eq('language', targetLang)
      .single();

    if (data && !error) {
      // Navigate to the localized post
      router.push(`/posts/${data.id}`);
    } else {
      alert(targetLang === 'ko' ? '한국어 번역본이 없습니다.' : 'No English translation available.');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus(post?.language === 'ko' ? '주소가 복사되었습니다!' : 'Link copied!');
      setTimeout(() => setShareStatus(''), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black font-sans">
        <Header language="ko" onLanguageChange={() => {}} isAuthenticated={isAuthenticated} />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600"></div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black font-sans">
        <Header language="ko" onLanguageChange={() => {}} isAuthenticated={isAuthenticated} />
        <main className="flex-1 flex items-center justify-center text-zinc-500">
          Post not found.
        </main>
      </div>
    );
  }

  const date = new Date(post.created_at);
  const formattedDate = new Intl.DateTimeFormat(post.language === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black font-sans">
      <Header 
        language={post.language} 
        onLanguageChange={handleLanguageSwitch} 
        isAuthenticated={isAuthenticated} 
      />
      
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <span className="rounded-full bg-zinc-100 px-3 py-1.5 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {post.category}
            </span>
            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <time dateTime={post.created_at}>{formattedDate}</time>
            </div>
          </div>

          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            {post.title}
          </h1>

          <div className="mt-8 flex items-center justify-between border-b border-t border-zinc-200 py-6 dark:border-zinc-800">
            <div className="flex items-center gap-x-4">
              <Image 
                src={post.author_avatar} 
                alt="" 
                width={40}
                height={40}
                className="h-10 w-10 rounded-full bg-zinc-100 ring-2 ring-white dark:bg-zinc-800 dark:ring-black" 
              />
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50">{post.author_name}</p>
                <p className="text-sm text-zinc-500">{post.language === 'ko' ? '에디터' : 'Editor'}</p>
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">{post.language === 'ko' ? '공유하기' : 'Share'}</span>
              </button>
              {shareStatus && (
                <div className="absolute right-0 top-full mt-2 whitespace-nowrap rounded bg-zinc-900 px-3 py-1 text-xs text-white shadow-lg dark:bg-white dark:text-zinc-900">
                  {shareStatus}
                </div>
              )}
            </div>
          </div>

          {post.image_url && (
            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-sm dark:bg-zinc-800">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}

          <div className="mt-12 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>
          
          {/* Enhanced Author Profile Section at the bottom */}
          <div className="mt-16 rounded-3xl bg-zinc-50 p-8 dark:bg-zinc-900/50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Image 
                src={post.author_avatar} 
                alt={post.author_name} 
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover shadow-sm ring-4 ring-white dark:ring-zinc-800" 
              />
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {post.author_name}
                </h3>
                <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                  {post.language === 'ko' 
                    ? '최신 트렌드와 기술을 분석하여 독자들에게 가치 있는 인사이트를 전달합니다.'
                    : 'Analyzing the latest trends and technologies to deliver valuable insights to readers.'}
                </p>
                <div className="mt-4 flex gap-4">
                  <Link 
                    href={`/profile/${encodeURIComponent(post.author_name)}`}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <User className="h-4 w-4" />
                    {post.language === 'ko' ? '프로필 보기' : 'View Profile'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer language={post.language} />
    </div>
  );
}
