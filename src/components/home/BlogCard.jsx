import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  return (
    <Link to={`/blog/${blog.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <div className="relative bg-gray-200 h-48 overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
        <div className="p-4">
          <p className="text-primary-600 text-sm font-semibold mb-2">{blog.category}</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{blog.author}</span>
            <span>{blog.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
