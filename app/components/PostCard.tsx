import Image from 'next/image';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  language: string;
  image_url: string;
  created_at: string;
  author_name?: string;
  author_avatar?: string;
}

interface PostCardProps {
  post: Post;
  language: 'ko' | 'en';
}

export default function PostCard({ post, language }: PostCardProps) {
  const date = new Date(post.created_at);
  const formattedDate = new Intl.DateTimeFormat(language === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);

  return (
    <article className="group flex flex-col items-start justify-between overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 transition-shadow hover:shadow-md dark:bg-zinc-900 dark:ring-zinc-800">
      <div className="relative w-full pb-[56.25%] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
            No Image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-6 w-full">
        <div className="flex items-center gap-x-4 text-xs">
          <time dateTime={post.created_at} className="text-zinc-500">
            {formattedDate}
          </time>
          <span className="relative z-10 rounded-full bg-zinc-100 px-3 py-1.5 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {post.category}
          </span>
        </div>
        <div className="group relative mt-3">
          <h3 className="text-xl font-semibold leading-6 text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            <Link href={`/posts/${post.id}`}>
              <span className="absolute inset-0" />
              {post.title}
            </Link>
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {post.excerpt || post.content}
          </p>
        </div>
        {post.author_name && (
          <div className="relative mt-4 flex items-center gap-x-3">
            <Image 
              src={post.author_avatar || 'https://github.com/shadcn.png'} 
              alt="" 
              width={32}
              height={32}
              className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800" 
            />
            <div className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                <span className="absolute inset-0" />
                {post.author_name}
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
