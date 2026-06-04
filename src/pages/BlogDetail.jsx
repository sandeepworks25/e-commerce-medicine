import { useParams, useNavigate, Link } from 'react-router-dom';
import { dummyBlogs } from '../data/dummy';
import BlogCard from '../components/home/BlogCard';
import { formatDate } from '../utils/helpers.js';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const blog = dummyBlogs.find(b => b.slug === slug);
  const relatedBlogs = dummyBlogs.filter(b => b.category === blog?.category && b.id !== blog?.id).slice(0, 3);

  if (!blog) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-600 mb-4">Blog not found</p>
        <button onClick={() => navigate('/blogs')} className="btn-primary">
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-3 py-3 text-sm sm:px-4 sm:py-4">
          <Link to="/" className="text-primary-600 hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/blogs" className="text-primary-600 hover:underline">
            Blogs
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600 line-clamp-1 inline-block max-w-[42vw] align-bottom sm:max-w-none">{blog.title}</span>
        </div>
      </div>

      {/* Article */}
      <article className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="px-3 py-1 bg-primary-600 text-white text-sm rounded-full">
                {blog.category}
              </span>
              <span className="text-gray-600 text-sm">{formatDate(blog.publishedAt)}</span>
              <span className="text-gray-600 text-sm">•</span>
              <span className="text-gray-600 text-sm">{blog.readTime}</span>
            </div>
            <h1 className="mb-4 text-2xl font-bold sm:text-4xl">{blog.title}</h1>
            <p className="mb-6 text-base text-gray-600 sm:text-xl">{blog.excerpt}</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                {blog.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{blog.author}</p>
                <p className="text-sm text-gray-600">Health Expert</p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={blog.image}
              alt={blog.title}
              className="h-56 w-full rounded-lg object-cover sm:h-96"
            />
          </div>

          {/* Content */}
          <div className="prose max-w-none mb-8 sm:prose-lg sm:mb-12">
            {blog.content.split('\n').map((paragraph, i) => (
              <p key={i} className={`${paragraph.trim() ? 'text-gray-700 mb-4' : ''}`}>
                {paragraph.trim().startsWith('#') ? (
                  <h2 className="text-2xl font-bold mt-6 mb-4">{paragraph.replace(/^#+\\s/, '').trim()}</h2>
                ) : paragraph.trim().startsWith('*') ? (
                  <li className="ml-4 mb-2">{paragraph.replace(/^\\*\\s/, '').trim()}</li>
                ) : paragraph.trim() ? (
                  paragraph
                ) : null}
              </p>
            ))}
          </div>

          {/* Share */}
          <div className="mb-8 rounded-lg border bg-white p-4 sm:mb-12 sm:p-6">
            <p className="font-semibold mb-4">Share this article</p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 sm:text-base">
                Facebook
              </button>
              <button className="rounded-lg bg-blue-400 px-4 py-2 text-sm text-white hover:bg-blue-500 sm:text-base">
                Twitter
              </button>
              <button className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 sm:text-base">
                WhatsApp
              </button>
            </div>
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div>
              <h2 className="mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">Related Articles</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                {relatedBlogs.map(relatedBlog => (
                  <BlogCard key={relatedBlog.id} blog={relatedBlog} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
