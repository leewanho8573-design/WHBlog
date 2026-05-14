interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  language: 'ko' | 'en';
}

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory, language }: CategoryFilterProps) {
  const allText = language === 'ko' ? '전체' : 'All';

  return (
    <div className="flex flex-wrap gap-2 py-8">
      <button
        onClick={() => onSelectCategory('all')}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selectedCategory === 'all'
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
        }`}
      >
        {allText}
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === category
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
