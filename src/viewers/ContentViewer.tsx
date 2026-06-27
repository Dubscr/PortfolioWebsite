import { FiExternalLink } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import ReactPlayer from "react-player";
import type { PortfolioContent, ResolvedPortfolioNode } from "../types/portfolio";

interface ContentViewerProps {
  node: ResolvedPortfolioNode;
}

export function ContentViewer({ node }: ContentViewerProps) {
  if (!node.content) return <TextViewer content={{ kind: "text", body: "" }} />;

  switch (node.content.kind) {
    case "project":
      return <ProjectViewer content={node.content} />;
    case "embed":
      return <EmbedViewer content={node.content} />;
    case "markdown":
      return <MarkdownViewer content={node.content} />;
    case "gallery":
      return <GalleryViewer content={node.content} />;
    case "image":
      return <ImageViewer content={node.content} />;
    case "video":
      return <VideoViewer content={node.content} />;
    case "pdf":
      return <PdfViewer content={node.content} />;
    case "code":
      return <CodeViewer content={node.content} />;
    case "github":
      return <GithubViewer content={node.content} />;
    case "link":
      return <LinkViewer content={node.content} />;
    case "timeline":
      return <TimelineViewer content={node.content} />;
    case "text":
      return <TextViewer content={node.content} />;
    case "achievement":
      return <AchievementViewer content={node.content} />;
    case "quote":
      return <QuoteViewer content={node.content} />;
    case "resume":
      return <ResumeViewer content={node.content} />;
    case "contact":
      return <ContactViewer content={node.content} />;
    default:
      return exhaustive(node.content);
  }
}

function ProjectViewer({ content }: { content: Extract<PortfolioContent, { kind: "project" }> }) {
  return (
    <section className="viewer project-viewer">
      <dl>
        {content.role ? (
          <>
            <dt>Role</dt>
            <dd>{content.role}</dd>
          </>
        ) : null}
        {content.year ? (
          <>
            <dt>Year</dt>
            <dd>{content.year}</dd>
          </>
        ) : null}
      </dl>
      {content.stack?.length ? (
        <div className="chip-row">
          {content.stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : null}
      {content.body ? <p>{content.body}</p> : null}
      <LinkList links={content.links ?? []} />
    </section>
  );
}

function EmbedViewer({ content }: { content: Extract<PortfolioContent, { kind: "embed" }> }) {
  return (
    <section className="viewer media-viewer">
      <ReactPlayer src={content.url} width="100%" height="100%" controls />
    </section>
  );
}

function MarkdownViewer({ content }: { content: Extract<PortfolioContent, { kind: "markdown" }> }) {
  return (
    <section className="viewer markdown-viewer">
      <ReactMarkdown>{content.source}</ReactMarkdown>
    </section>
  );
}

function GalleryViewer({ content }: { content: Extract<PortfolioContent, { kind: "gallery" }> }) {
  return (
    <section className="viewer gallery-viewer">
      {content.images.map((image) => (
        <figure key={image.src}>
          <img src={image.src} alt={image.alt} />
          {image.caption ? <figcaption>{image.caption}</figcaption> : null}
        </figure>
      ))}
    </section>
  );
}

function ImageViewer({ content }: { content: Extract<PortfolioContent, { kind: "image" }> }) {
  return (
    <figure className="viewer image-viewer">
      <img src={content.src} alt={content.alt} />
      {content.caption ? <figcaption>{content.caption}</figcaption> : null}
    </figure>
  );
}

function VideoViewer({ content }: { content: Extract<PortfolioContent, { kind: "video" }> }) {
  return (
    <section className="viewer media-viewer">
      <ReactPlayer src={content.url} width="100%" height="100%" controls />
    </section>
  );
}

function PdfViewer({ content }: { content: Extract<PortfolioContent, { kind: "pdf" }> }) {
  return <iframe className="viewer pdf-viewer" src={content.url} title="Embedded PDF" />;
}

function CodeViewer({ content }: { content: Extract<PortfolioContent, { kind: "code" }> }) {
  return (
    <section className="viewer code-viewer">
      <header>
        <span>{content.language}</span>
        {content.repo ? <a href={content.repo}>Repository</a> : null}
      </header>
      <pre>
        <code>{content.source}</code>
      </pre>
    </section>
  );
}

function GithubViewer({ content }: { content: Extract<PortfolioContent, { kind: "github" }> }) {
  return (
    <section className="viewer github-viewer">
      <FiExternalLink aria-hidden />
      <h2>{content.repo.replace(/^https?:\/\//, "")}</h2>
      {content.description ? <p>{content.description}</p> : null}
      <div className="chip-row">
        {content.language ? <span>{content.language}</span> : null}
        {typeof content.stars === "number" ? <span>{content.stars} stars</span> : null}
      </div>
      <a href={content.repo} target="_blank" rel="noreferrer">
        Open repository
      </a>
    </section>
  );
}

function LinkViewer({ content }: { content: Extract<PortfolioContent, { kind: "link" }> }) {
  return (
    <section className="viewer link-viewer">
      <a href={content.url} target="_blank" rel="noreferrer">
        <FiExternalLink aria-hidden />
        {content.label ?? content.url}
      </a>
    </section>
  );
}

function TimelineViewer({ content }: { content: Extract<PortfolioContent, { kind: "timeline" }> }) {
  return (
    <section className="viewer timeline-viewer">
      {content.items.map((item) => (
        <article key={`${item.date}-${item.title}`}>
          <time>{item.date}</time>
          <h2>{item.title}</h2>
          <p>{item.body}</p>
        </article>
      ))}
    </section>
  );
}

function TextViewer({ content }: { content: Extract<PortfolioContent, { kind: "text" }> }) {
  return <p className="viewer text-viewer">{content.body}</p>;
}

function AchievementViewer({ content }: { content: Extract<PortfolioContent, { kind: "achievement" }> }) {
  return (
    <section className="viewer achievement-viewer">
      <strong>{content.metric}</strong>
      <p>{content.detail}</p>
    </section>
  );
}

function QuoteViewer({ content }: { content: Extract<PortfolioContent, { kind: "quote" }> }) {
  return (
    <figure className="viewer quote-viewer">
      <blockquote>{content.quote}</blockquote>
      {content.attribution ? <figcaption>{content.attribution}</figcaption> : null}
    </figure>
  );
}

function ResumeViewer({ content }: { content: Extract<PortfolioContent, { kind: "resume" }> }) {
  return (
    <section className="viewer resume-viewer">
      <div className="chip-row">
        {content.highlights.map((highlight) => (
          <span key={highlight}>{highlight}</span>
        ))}
      </div>
      <a href={content.url}>Open resume</a>
    </section>
  );
}

function ContactViewer({ content }: { content: Extract<PortfolioContent, { kind: "contact" }> }) {
  return (
    <section className="viewer contact-viewer">
      {content.email ? <a href={`mailto:${content.email}`}>{content.email}</a> : null}
      <LinkList links={content.links} />
    </section>
  );
}

function LinkList({ links }: { links: { label: string; url: string }[] }) {
  if (!links.length) return null;
  return (
    <div className="link-list">
      {links.map((link) => (
        <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
          {link.label}
        </a>
      ))}
    </div>
  );
}

function exhaustive(value: never): never {
  throw new Error(`Unhandled content kind: ${JSON.stringify(value)}`);
}
