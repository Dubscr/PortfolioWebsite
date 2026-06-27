import { useMemo, useState } from "react";
import type { GraphEngine } from "../engine/GraphEngine";

export function usePortfolioGraph(engine: GraphEngine) {
  const [focusedId, setFocusedId] = useState(engine.root.id);
  const [selectedId, setSelectedId] = useState<string | null>(engine.root.id);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set([engine.root.id]));
  const [search, setSearch] = useState("");

  const view = useMemo(
    () => engine.buildView(expandedIds, focusedId, search),
    [engine, expandedIds, focusedId, search],
  );

  const focusNode = (id: string) => {
    setFocusedId(id);
    setSelectedId(id);
    setExpandedIds((current) => {
      const next = new Set(current);
      engine.getPath(id).forEach((node) => next.add(node.id));
      next.add(id);
      return next;
    });
  };

  const toggleNode = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id) && id !== engine.root.id) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return {
    engine,
    focusedId,
    selectedNode: selectedId ? engine.getNode(selectedId) : null,
    graphNodes: view.nodes,
    graphEdges: view.edges,
    matches: view.matches,
    breadcrumbs: selectedId ? engine.getPath(selectedId) : [engine.root],
    search,
    setSearch,
    focusNode,
    toggleNode,
    clearSelection: () => setSelectedId(null),
  };
}
