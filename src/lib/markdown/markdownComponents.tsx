import GithubSlugger from "github-slugger";
import type { Components } from "react-markdown";

export function markdownComponents(): Components {
  const slugger = new GithubSlugger();

  return {
    h1: ({ children }) => {
      const text = String(children);
      const id = slugger.slug(text);
      return (
        <h1
          id={id}
          className="mt-4 mb-2 scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance"
        >
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const text = String(children);
      const id = slugger.slug(text);
      return (
        <h2
          id={id}
          className="mt-4 mb-2 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = String(children);
      const id = slugger.slug(text);
      return (
        <h3
          id={id}
          className="mt-4 mb-2 scroll-m-20 text-2xl font-semibold tracking-tight"
        >
          {children}
        </h3>
      );
    },
    ul: ({ children }) => {
      const text = String(children);
      return <ul className="list-inside list-disc">{children}</ul>;
    },
    ol: ({ children }) => {
      const text = String(children);
      return <ul className="list-inside list-decimal">{children}</ul>;
    },
  };
}
