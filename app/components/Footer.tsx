interface FooterProps {
  language: 'ko' | 'en';
}

export default function Footer({ language }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const text = language === 'ko' 
    ? `© ${currentYear} WHBlog. 모든 권리 보유.` 
    : `© ${currentYear} WHBlog. All rights reserved.`;

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
        <p className="text-center text-sm leading-5 text-zinc-500 dark:text-zinc-400">
          {text}
        </p>
      </div>
    </footer>
  );
}
