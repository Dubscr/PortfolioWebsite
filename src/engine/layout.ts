import type { GraphNodePosition, ResolvedPortfolioNode } from "../types/portfolio";

const ROOT_RADIUS = 0;
const LEVEL_GAP = 250;

export function radialLayout(nodes: ResolvedPortfolioNode[], rootId: string): Map<string, GraphNodePosition> {
  const byParent = new Map<string, ResolvedPortfolioNode[]>();
  nodes.forEach((node) => {
    if (!node.parentId) return;
    const siblings = byParent.get(node.parentId) ?? [];
    siblings.push(node);
    byParent.set(node.parentId, siblings);
  });

  const positions = new Map<string, GraphNodePosition>();
  positions.set(rootId, { x: 0, y: 0 });

  const placeChildren = (parentId: string, start: number, end: number) => {
    const children = byParent.get(parentId) ?? [];
    const span = end - start;

    children.forEach((child, index) => {
      const sectionStart = start + (span / Math.max(children.length, 1)) * index;
      const sectionEnd = start + (span / Math.max(children.length, 1)) * (index + 1);
      const angle = (sectionStart + sectionEnd) / 2;
      const radius = ROOT_RADIUS + child.depth * LEVEL_GAP + Math.max(0, child.childrenIds.length - 1) * 34;
      positions.set(child.id, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });
      placeChildren(child.id, sectionStart, sectionEnd);
    });
  };

  placeChildren(rootId, -Math.PI * 0.92, Math.PI * 1.08);
  return positions;
}
