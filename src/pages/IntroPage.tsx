import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export function IntroPage() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/data/Intro/Интро.md')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        if (!cancelled) {
          setContent(text);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(String(e));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <p className='text-muted-foreground text-sm mb-10 md:mb-16 max-w-lg leading-relaxed animate-pulse'>
         Загрузка…
      </p>
    );
  }

  if (error) {
    return <p className='text-sm'>Ошибка загрузки: {error}</p>;
  }

  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className='text-4xl md:text-5xl font-normal tracking-tight mb-4'>Интро</h1>
        <p className='text-muted-foreground mb-10 md:mb-16 max-w-lg leading-relaxed'>
          Видео и текст о проекте
        </p>
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-normal tracking-tight mb-8 mt-0">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl md:text-2xl font-normal mt-10 mb-4">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-normal mt-6 mb-2">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-1 mb-4 text-muted-foreground">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1 mb-4 text-muted-foreground">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="font-normal text-foreground">{children}</strong>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 text-foreground hover:text-muted-foreground transition-colors"
              >
                {children}
              </a>
            ),
            hr: () => <hr className="border-border my-8" />,
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-border pl-4 text-muted-foreground italic my-4">
                {children}
      </blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
    </div>
    </div>
  );
}
