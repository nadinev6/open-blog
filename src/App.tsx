import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Github, Link as LinkIcon, ArrowUpRight, Copy, Check, Mail } from 'lucide-react';
import { AUTHOR_DETAILS } from './constants';

const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function App() {
  const [content, setContent] = useState('');
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    fetch('/content/post.md')
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
        const headingRegex = /^(#{2,3})\s+(.+)$/gm;
        const headings: TocItem[] = [];
        let match;
        while ((match = headingRegex.exec(text)) !== null) {
          const level = match[1].length;
          const title = match[2].trim();
          const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          headings.push({ id, text: title, level });
        }
        setToc(headings);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    const headings = document.querySelectorAll('h2, h3');
    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, [content]);

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <main className="pt-16 pb-20">
        {/* Hero Section */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-[0.2em] mb-6">
              <span>{AUTHOR_DETAILS.blogCategory}</span>
              <ChevronRight size={12} />
              <span>{AUTHOR_DETAILS.blogSeries}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-10">
              {AUTHOR_DETAILS.blogTitle}
            </h1>
            <div className="flex items-center gap-4 p-1 pr-6 w-fit bg-slate-50 rounded-full border border-slate-100">
              <img 
                src={AUTHOR_DETAILS.avatar} 
                alt={AUTHOR_DETAILS.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">{AUTHOR_DETAILS.name}</div>
                <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                  {AUTHOR_DETAILS.blogDate} • {AUTHOR_DETAILS.blogReadTime}
                </div>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">
            {/* Main Article */}
            <article className="max-w-3xl mx-auto lg:mx-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="markdown-body"
              >
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeRaw, rehypeSlug]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const [copied, setCopied] = useState(false);

                      const handleCopy = () => {
                        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      };

                      return !inline && match ? (
                        <div className="relative group my-8">
                          <div className="flex items-center justify-between px-4 py-2 bg-slate-100/50 border-x border-t border-slate-100 rounded-t-2xl">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {match[1]}
                            </span>
                            <button 
                              onClick={handleCopy}
                              className="text-slate-400 hover:text-slate-900 transition-colors"
                            >
                              {copied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                          <SyntaxHighlighter
                            style={oneLight}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              padding: '1.5rem',
                              backgroundColor: '#f8fafc',
                              borderBottomLeftRadius: '1rem',
                              borderBottomRightRadius: '1rem',
                              borderLeft: '1px solid #f1f5f9',
                              borderRight: '1px solid #f1f5f9',
                              borderBottom: '1px solid #f1f5f9',
                              fontSize: '0.875rem',
                              lineHeight: '1.7',
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    img({ node, ...props }: any) {
                      return (
                        <img 
                          {...props} 
                          className="rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 my-12 w-full"
                          referrerPolicy="no-referrer"
                        />
                      );
                    }
                  }}
                >
                  {content}
                </ReactMarkdown>
              </motion.div>

              {/* Footer / Share */}
              <footer className="mt-20 pt-10 border-t border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-3">
                    <a 
                      href={AUTHOR_DETAILS.socials.x} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
                    >
                      <XIcon size={18} />
                    </a>
                    <a 
                      href={AUTHOR_DETAILS.socials.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
                    >
                      <LinkIcon size={18} />
                    </a>
                    <a 
                      href={AUTHOR_DETAILS.socials.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
                    >
                      <Github size={18} />
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
                    <span>Found a typo?</span>
                    <a href={AUTHOR_DETAILS.editUrl} target="_blank" rel="noopener noreferrer" className="text-slate-900 font-bold hover:underline underline-offset-4">Edit on GitHub</a>
                  </div>
                </div>
              </footer>
            </article>

            {/* Sidebar / TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-12">
                <div className="mb-12">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Table of Contents</h4>
                  <nav className="flex flex-col gap-4">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`text-sm transition-all duration-300 relative ${
                          activeId === item.id 
                            ? 'text-blue-600 font-bold' 
                            : 'text-slate-400 hover:text-slate-900'
                        } ${item.level === 3 ? 'pl-4' : ''}`}
                      >
                        {activeId === item.id && (
                          <motion.div 
                            layoutId="active-indicator"
                            className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-blue-600 rounded-full"
                          />
                        )}
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>

                <div className="p-8 bg-slate-900 rounded-[2rem] text-white shadow-2xl shadow-slate-200">
                  <h4 className="font-bold text-lg mb-2">Join the Newsletter</h4>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">{AUTHOR_DETAILS.newsletter.description}</p>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="you@example.com" 
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
                    />
                    <button 
                      onClick={() => {
                        window.location.href = `mailto:${AUTHOR_DETAILS.newsletter.email}?subject=Newsletter Subscription&body=I would like to subscribe. My email is: ${newsletterEmail}`;
                      }}
                      className="w-full bg-white text-slate-900 py-3 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all active:scale-[0.98]"
                    >
                      Email
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <a href={AUTHOR_DETAILS.projectSource} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                        <Github size={20} />
                      </div>
                      <div className="text-sm font-bold text-slate-900">View Source</div>
                    </div>
                    <ArrowUpRight size={16} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <footer className="py-12 border-t border-slate-50 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          Built for those who refuse to be censored.
        </p>
      </footer>
    </div>
  );
}
