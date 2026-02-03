import { Link } from 'react-router-dom';


function Blog() {
  const posts = [
    { id: 1, title: 'Getting Started with React', date: '2026-01-20' },
    { id: 2, title: 'React Router Best Practices', date: '2026-01-25' },
    { id: 3, title: 'State Management Tips', date: '2026-01-28' },
  ];

  return (
    <div className="page-container">
      <h1>Blog</h1>
      <div className="blog-list">
        {posts.map(post => (
          <article key={post.id} className="blog-post">
            <h3>{post.title}</h3>
            <p className="date">{post.date}</p>
            <p>Read our latest insights and tutorials...</p>
          </article>
        ))}
      </div>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default Blog;