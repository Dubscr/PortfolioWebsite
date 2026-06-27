import type { IconType } from "react-icons";

export type PortfolioNodeType =
  | "category"
  | "project"
  | "youtube"
  | "soundcloud"
  | "markdown"
  | "gallery"
  | "image"
  | "video"
  | "pdf"
  | "code"
  | "github"
  | "external-link"
  | "timeline"
  | "text"
  | "achievement"
  | "quote"
  | "resume"
  | "contact";

export type ThemeName = "cyber" | "blueprint" | "glass" | "minimal" | "dark";

export type PortfolioContent =
  | { kind: "project"; role?: string; year?: string; stack?: string[]; body?: string; links?: ContentLink[] }
  | { kind: "embed"; url: string }
  | { kind: "markdown"; source: string }
  | { kind: "gallery"; images: GalleryImage[] }
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "video"; url: string }
  | { kind: "pdf"; url: string }
  | { kind: "code"; language: string; source: string; repo?: string }
  | { kind: "github"; repo: string; description?: string; stars?: number; language?: string }
  | { kind: "link"; url: string; label?: string }
  | { kind: "timeline"; items: TimelineItem[] }
  | { kind: "text"; body: string }
  | { kind: "achievement"; metric: string; detail: string }
  | { kind: "quote"; quote: string; attribution?: string }
  | { kind: "resume"; url: string; highlights: string[] }
  | { kind: "contact"; email?: string; links: ContentLink[] };

export interface ContentLink {
  label: string;
  url: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  body: string;
}

export interface PortfolioNodeData {
  id: string;
  parent?: string;
  type: PortfolioNodeType;
  title: string;
  description: string;
  color?: string;
  icon?: string;
  thumbnail?: string;
  children?: string[];
  content?: PortfolioContent;
}

export interface ResolvedPortfolioNode extends PortfolioNodeData {
  depth: number;
  childrenIds: string[];
  parentId?: string;
}

export interface GraphNodePosition {
  x: number;
  y: number;
}

export interface GraphNodeViewModel {
  node: ResolvedPortfolioNode;
  position: GraphNodePosition;
  expanded: boolean;
  visible: boolean;
  dimmed: boolean;
  highlighted: boolean;
  icon?: IconType;
}

export interface GraphEdgeViewModel {
  id: string;
  source: string;
  target: string;
  highlighted: boolean;
  animated: boolean;
}

export interface SearchMatch {
  node: ResolvedPortfolioNode;
  path: ResolvedPortfolioNode[];
}
