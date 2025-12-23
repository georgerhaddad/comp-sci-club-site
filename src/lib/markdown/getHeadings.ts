import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import GithubSlugger from "github-slugger";

export interface Heading {
  depth: number;
  text: string;
  id: string;
}

export function getHeadings(markdown: string): Heading[] {
  const tree = unified().use(remarkParse).parse(markdown);
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];

  visit(tree, "heading", (node: any) => {
    const text = node.children
      .filter((n: any) => n.type === "text")
      .map((n: any) => n.value)
      .join("");

    if (!text) return;

    headings.push({
      depth: node.depth,
      text,
      id: slugger.slug(text),
    });
  });

  return headings;
}
