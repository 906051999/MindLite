import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

export default function EditorPreview({ localTitle, localContent }) {
  return (
    <div className="space-y-4">
      <div className="w-full px-2 text-lg sm:text-xl md:text-2xl font-bold">
        {localTitle || '无标题'}
      </div>
      <div className="h-[calc(100vh-16rem)] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-500 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-400">
        <article className="w-full prose prose-slate dark:prose-invert prose-pre:bg-gray-900 prose-pre:text-gray-100 max-w-none px-2">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {localContent}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
} 