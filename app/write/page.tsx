'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/app/components/Header';
import { createClient } from '@/utils/supabase/client';

export default function WritePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      setIsAuthenticated(true);
      setUserEmail(session.user.email || 'Author');
      setUserId(session.user.id);
      setLoading(false);
    };
    checkAuth();
  }, [router, supabase]);

  const handlePublish = async () => {
    if (!title || !category || !content) {
      alert('Title, Category, and Content are required.');
      return;
    }

    setPublishing(true);

    // Auto-generate excerpt from content (first 150 chars)
    const excerpt = content.substring(0, 150) + (content.length > 150 ? '...' : '');
    
    // Generate new translation group ID since this is a new post
    const translation_group_id = uuidv4();

    // Determine author name from email or default
    const author_name = userEmail.split('@')[0] || '완호AI 에디터';
    const author_avatar = 'https://github.com/shadcn.png'; // Default avatar

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          content,
          excerpt,
          category,
          language,
          image_url: imageUrl || null,
          author_name,
          author_avatar,
          translation_group_id,
          author_id: userId
        }
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Error publishing:', error);
      alert('Failed to publish post.');
      setPublishing(false);
    } else if (data) {
      // Navigate to the newly created post
      router.push(`/posts/${data.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600"></div>
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

      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-64px)]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {language === 'ko' ? '새 글 작성' : 'Write New Post'}
          </h1>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {publishing 
              ? (language === 'ko' ? '발행 중...' : 'Publishing...') 
              : (language === 'ko' ? '발행하기' : 'Publish')}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 h-full flex-1">
          {/* Left Panel: Inputs and Editor */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 h-full border-r border-zinc-200 dark:border-zinc-800 pr-0 md:pr-6">
            <input
              type="text"
              placeholder={language === 'ko' ? '제목' : 'Post Title'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-3xl font-bold outline-none placeholder:text-zinc-400 dark:text-white"
            />
            
            <div className="flex gap-4">
              <input
                type="text"
                placeholder={language === 'ko' ? '카테고리 (예: Development)' : 'Category (e.g. Development)'}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'ko' | 'en')}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              >
                <option value="ko">Korean</option>
                <option value="en">English</option>
              </select>
            </div>

            <input
              type="text"
              placeholder={language === 'ko' ? '썸네일 이미지 URL (선택사항)' : 'Thumbnail Image URL (Optional)'}
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />

            <textarea
              placeholder={language === 'ko' ? '마크다운으로 내용을 작성하세요...' : 'Write your markdown content here...'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full flex-1 resize-none bg-transparent outline-none font-mono text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 mt-4"
            />
          </div>

          {/* Right Panel: Live Preview */}
          <div className="w-full md:w-1/2 h-full overflow-y-auto rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900/50">
            {content ? (
              <div className="prose prose-zinc max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-400">
                {language === 'ko' ? '실시간 미리보기' : 'Live Preview'}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
