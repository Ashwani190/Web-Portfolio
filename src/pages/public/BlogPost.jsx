import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Eye } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { supabase } from '../../lib/supabaseClient';
import PageTransition from '../../components/shared/PageTransition';
import Badge from '../../components/shared/Badge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { formatDate, extractHeadings } from '../../lib/helpers';

// Simple markdown renderer
const renderMarkdown = (content) => {
  if (!content) return '';

  let html = content;

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Headers
  html = html.replace(/^#### (.+)$/gm, '<h4 id="$1">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 id="$1">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 id="$1">$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

  // Paragraphs
  html = html.replace(/^(?!<[a-z])(.*\S.*)$/gm, '<p>$1</p>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />');

  return html;
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setPost(data);

        // Increment views
        if (data?.id) {
          supabase.from('blog_posts').update({ views: (data.views || 0) + 1 }).eq('id', data.id).then();
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const headings = useMemo(() => extractHeadings(post?.content), [post?.content]);

  if (loading) return <LoadingSpinner fullScreen />;

  if (!post) {
    return (
      <PageTransition>
        <div className="section-padding text-center">
          <h1 className="text-3xl font-display font-bold text-cocoa mb-4">Post Not Found</h1>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {/* Reading Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-ember z-[60] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero */}
      <section className="relative">
        {post.cover_image_url && (
          <div className="h-64 sm:h-80 lg:h-96 overflow-hidden">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cocoa/80 to-transparent" />
          </div>
        )}

        <div className={`container-custom px-4 sm:px-6 lg:px-8 ${post.cover_image_url ? '-mt-32 relative z-10' : 'pt-20'}`}>
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-body text-canvas/80 hover:text-silk mb-6 transition-colors">
              <ArrowLeft size={16} /> Back to Home
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="ember">{tag}</Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 ${post.cover_image_url ? 'text-silk' : 'text-cocoa'}`}>
              {post.title}
            </h1>

            {/* Meta */}
            <div className={`flex flex-wrap items-center gap-4 text-sm font-body ${post.cover_image_url ? 'text-canvas/70' : 'text-timber'}`}>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {post.reading_time_mins} min read
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={14} />
                {post.views} views
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding pt-12">
        <div className="container-custom">
          <div className="flex gap-12 max-w-6xl mx-auto">
            {/* Table of Contents - Desktop Sidebar */}
            {headings.length > 0 && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-28 p-5 rounded-2xl bg-canvas/20 border border-canvas/30">
                  <h4 className="text-sm font-body font-semibold text-cocoa uppercase tracking-wider mb-3">
                    Table of Contents
                  </h4>
                  <nav className="space-y-2">
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-sm font-body text-timber hover:text-ember transition-colors
                                  ${heading.level === 1 ? 'font-semibold' : ''}
                                  ${heading.level === 3 ? 'pl-4' : heading.level === 4 ? 'pl-6' : ''}`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}

            {/* Blog Content */}
            <article className="flex-1 max-w-3xl">
              <div
                className="blog-content prose prose-lg font-body text-timber"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
              />
            </article>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default BlogPost;
