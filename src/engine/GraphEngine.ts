import { radialLayout } from "./layout";
import { getIcon } from "./iconRegistry";
import type {
  GraphEdgeViewModel,
  GraphNodeViewModel,
  PortfolioNodeData,
  ResolvedPortfolioNode,
  SearchMatch,
} from "../types/portfolio";

export class GraphEngine {
  private readonly nodeMap: Map<string, ResolvedPortfolioNode>;
  private readonly rootId: string;

  constructor(nodes: PortfolioNodeData[]) {
    if (!nodes.length) throw new Error("Neuralfolio requires at least one node.");

    const childBuckets = new Map<string, string[]>();
    nodes.forEach((node) => {
      if (node.parent) {
        childBuckets.set(node.parent, [...(childBuckets.get(node.parent) ?? []), node.id]);
      }
      node.children?.forEach((childId) => {
        childBuckets.set(node.id, [...(childBuckets.get(node.id) ?? []), childId]);
      });
    });

    const rawMap = new Map(nodes.map((node) => [node.id, node]));
    this.rootId = nodes.find((node) => !node.parent)?.id ?? nodes[0].id;
    this.nodeMap = new Map();

    const resolveDepth = (id: string, seen = new Set<string>()): number => {
      if (seen.has(id)) return 0;
      const node = rawMap.get(id);
      if (!node?.parent) return 0;
      return 1 + resolveDepth(node.parent, new Set(seen).add(id));
    };

    nodes.forEach((node) => {
      this.nodeMap.set(node.id, {
        ...node,
        parentId: node.parent,
        childrenIds: [...new Set(childBuckets.get(node.id) ?? [])].filter((childId) => rawMap.has(childId)),
        depth: resolveDepth(node.id),
      });
    });
  }

  get root(): ResolvedPortfolioNode {
    return this.getNode(this.rootId);
  }

  get nodes(): ResolvedPortfolioNode[] {
    return Array.from(this.nodeMap.values());
  }

  getNode(id: string): ResolvedPortfolioNode {
    const node = this.nodeMap.get(id);
    if (!node) throw new Error(`Unknown portfolio node: ${id}`);
    return node;
  }

  getPath(id: string): ResolvedPortfolioNode[] {
    const path: ResolvedPortfolioNode[] = [];
    let current: ResolvedPortfolioNode | undefined = this.getNode(id);
    while (current) {
      path.unshift(current);
      current = current.parentId ? this.nodeMap.get(current.parentId) : undefined;
    }
    return path;
  }

  search(query: string): SearchMatch[] {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    return this.nodes
      .filter((node) => {
        const haystack = [node.title, node.description, node.type, node.icon].join(" ").toLowerCase();
        return haystack.includes(term);
      })
      .map((node) => ({ node, path: this.getPath(node.id) }));
  }

  buildView(expandedIds: Set<string>, focusedId: string, searchQuery: string) {
    const matches = this.search(searchQuery);
    const matchedIds = new Set(matches.map((match) => match.node.id));
    const pathIds = new Set<string>();
    matches.forEach((match) => match.path.forEach((node) => pathIds.add(node.id)));

    const visibleIds = new Set<string>([this.rootId, focusedId]);
    expandedIds.forEach((id) => {
      visibleIds.add(id);
      this.getNode(id).childrenIds.forEach((childId) => visibleIds.add(childId));
    });
    this.getPath(focusedId).forEach((node) => {
      visibleIds.add(node.id);
      node.childrenIds.forEach((childId) => visibleIds.add(childId));
    });

    const positions = radialLayout(this.nodes, this.rootId);
    const viewNodes: GraphNodeViewModel[] = this.nodes.map((node) => {
      const highlighted = matchedIds.has(node.id) || node.id === focusedId;
      return {
        node,
        position: positions.get(node.id) ?? { x: 0, y: 0 },
        expanded: expandedIds.has(node.id),
        visible: visibleIds.has(node.id) || pathIds.has(node.id),
        dimmed: Boolean(searchQuery.trim()) && !highlighted && !pathIds.has(node.id),
        highlighted,
        icon: getIcon(node.icon),
      };
    });

    const viewEdges: GraphEdgeViewModel[] = this.nodes
      .filter((node) => node.parentId)
      .map((node) => ({
        id: `${node.parentId}-${node.id}`,
        source: node.parentId as string,
        target: node.id,
        highlighted:
          node.id === focusedId ||
          node.parentId === focusedId ||
          matchedIds.has(node.id) ||
          matchedIds.has(node.parentId as string) ||
          pathIds.has(node.id),
        animated: true,
      }));

    return { nodes: viewNodes, edges: viewEdges, matches };
  }
}
