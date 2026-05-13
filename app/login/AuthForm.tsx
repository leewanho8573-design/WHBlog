'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function AuthForm({ t }: { t: Record<string, string> }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    let result
    if (mode === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password })
    } else {
      result = await supabase.auth.signUp({ email, password })
    }

    if (result.error) {
      setError(result.error.message)
    } else {
      router.push('/')
      router.refresh()
    }
    setIsPending(false)
  }

  return (
    <div className="w-full max-w-[440px] p-10 bg-[#161C2D] border border-[#2A3143] rounded-xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-3 tracking-wide">WHBlog</h1>
        <p className="text-slate-400">
          {mode === 'login' ? t.welcome : t.welcome_signup}
        </p>
      </div>

      <div className="flex border-b border-[#2A3143] mb-8">
        <button
          type="button"
          onClick={() => { setMode('login'); setError(null); }}
          className={`flex-1 pb-3 text-sm transition-colors ${
            mode === 'login'
              ? 'text-white border-b-2 border-white'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {t.login}
        </button>
        <button
          type="button"
          onClick={() => { setMode('signup'); setError(null); }}
          className={`flex-1 pb-3 text-sm transition-colors ${
            mode === 'signup'
              ? 'text-white border-b-2 border-white'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {t.signup}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-950/50 border border-red-900 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm text-slate-300">{t.email}</label>
          <input
            name="email"
            type="email"
            required
            placeholder="developer@whblog.com"
            className="w-full px-4 py-3 bg-[#0B1120] border border-[#2A3143] rounded-md text-white placeholder-slate-600 focus:outline-none focus:border-[#A5B4FC] transition-colors font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-slate-300">{t.password}</label>
            {mode === 'login' && (
              <a href="#" className="text-xs text-[#A5B4FC] hover:text-white transition-colors">
                {t.forgot_password}
              </a>
            )}
          </div>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#0B1120] border border-[#2A3143] rounded-md text-white placeholder-slate-600 focus:outline-none focus:border-[#A5B4FC] transition-colors font-mono text-sm pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-[#C7D2FE] hover:bg-[#A5B4FC] text-[#1E1B4B] font-semibold rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {isPending ? '...' : t.continue}
        </button>
      </form>
    </div>
  )
}
