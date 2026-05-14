import Link from 'next/link'
import AuthForm from './AuthForm'

const dict = {
  ko: {
    login: "Log In",
    signup: "Sign Up",
    welcome: "터미널에 다시 오신 것을 환영합니다.",
    welcome_signup: "터미널에 오신 것을 환영합니다.",
    email: "Email",
    password: "Password",
    forgot_password: "Forgot password?",
    continue: "Continue",
    english: "English",
    korean: "한국어"
  },
  en: {
    login: "Log In",
    signup: "Sign Up",
    welcome: "Welcome back to the terminal.",
    welcome_signup: "Welcome to the terminal.",
    email: "Email",
    password: "Password",
    forgot_password: "Forgot password?",
    continue: "Continue",
    english: "English",
    korean: "한국어"
  }
}

export default async function LoginPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const langParam = searchParams.lang
  const lang = typeof langParam === 'string' && langParam === 'en' ? 'en' : 'ko'
  const t = dict[lang]

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 flex flex-col items-center justify-center p-4 font-mono relative">
      <div className="absolute top-6 right-6 flex gap-4 text-sm z-10">
        <Link 
          href="?lang=ko" 
          className={`hover:text-white transition-colors ${lang === 'ko' ? 'text-white font-bold' : 'text-slate-400'}`}
        >
          {t.korean}
        </Link>
        <span className="text-slate-600">|</span>
        <Link 
          href="?lang=en" 
          className={`hover:text-white transition-colors ${lang === 'en' ? 'text-white font-bold' : 'text-slate-400'}`}
        >
          {t.english}
        </Link>
      </div>

      <AuthForm t={t} />
    </div>
  )
}
