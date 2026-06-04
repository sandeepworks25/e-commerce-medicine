import { useState } from 'react';
import { dummyBlogs } from '../data/dummy';
import BlogCard from '../components/home/BlogCard';

const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categories = [...new Set(dummyBlogs.map(b => b.category))];

  const filteredBlogs = selectedCategory
    ? dummyBlogs.filter(b => b.category === selectedCategory)
    : dummyBlogs;

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <h1 className="mb-2 text-2xl font-bold md:text-3xl">Health & Wellness Blog</h1>
        <p className="mb-6 text-sm text-gray-600 sm:mb-8 sm:text-base">Expert tips and guides for your health</p>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 sm:mb-8 sm:flex-wrap sm:overflow-visible sm:pb-0">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm transition sm:text-base ${
              selectedCategory === null
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 hover:border-primary-600'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm transition sm:text-base ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-300 hover:border-primary-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filteredBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
