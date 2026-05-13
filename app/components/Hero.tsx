interface HeroProps {
  language: 'ko' | 'en';
}

export default function Hero({ language }: HeroProps) {
  const content = {
    ko: {
      title: "환영합니다!",
      highlight: "WHBlog입니다",
      subtitle: "최신 개발 트렌드, 디자인 인사이트, 그리고 생산성을 높이는 다양한 팁을 한 곳에서 만나보세요.",
    },
    en: {
      title: "Welcome to",
      highlight: "WHBlog",
      subtitle: "Discover the latest development trends, design insights, and productivity tips all in one place.",
    }
  };

  const text = content[language];

  return (
    <section className="relative w-full overflow-hidden bg-zinc-50 py-24 dark:bg-black sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
            {text.title} <br />
            <span className="text-blue-600 dark:text-blue-500">{text.highlight}</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {text.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
