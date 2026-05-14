'use client';

import Link from 'next/link';
import { Globe } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface HeaderProps {
  language: 'ko' | 'en';
  onLanguageChange: (lang: 'ko' | 'en') => void;
  isAuthenticated: boolean;
}

export default function Header({ language, onLanguageChange, isAuthenticated }: HeaderProps) {
  const supabase = createClient();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">
            WHBlog<span className="text-blue-600">.</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLanguageChange(language === 'ko' ? 'en' : 'ko')}
            className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            aria-label="Toggle Language"
          >
            <Globe className="h-4 w-4" />
            {language === 'ko' ? 'English' : '한국어'}
          </button>
          
          <nav className="hidden sm:block">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/write"
                  className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                >
                  {language === 'ko' ? '글쓰기' : 'Write'}
                </Link>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut()
                    window.location.reload()
                  }}
                  className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {language === 'ko' ? '로그아웃' : 'Logout'}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                {language === 'ko' ? '로그인' : 'Login'}
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
