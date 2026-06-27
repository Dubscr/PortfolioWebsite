import { memo } from "react";
import type { CSSProperties } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { motion } from "framer-motion";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import type { GraphNodeViewModel } from "../types/portfolio";

interface NeuralNodeData {
  view: GraphNodeViewModel;
  onFocus: (id: string) => void;
  onToggle: (id: string) => void;
}

function NeuralNodeComponent({ data }: NodeProps<NeuralNodeData>) {
  const { view, onFocus, onToggle } = data;
  const Icon = view.icon;
  const hasChildren = view.node.childrenIds.length > 0;

  return (
    <motion.article
      className={[
        "neural-node",
        view.highlighted ? "is-focused" : "",
        view.dimmed ? "is-dimmed" : "",
      ].join(" ")}
      style={{ "--node-color": view.node.color ?? "var(--accent)" } as CSSProperties}
      initial={{ opacity: 0, scale: 0.72, y: 24 }}
      animate={{
        opacity: view.visible ? (view.dimmed ? 0.34 : 1) : 0,
        scale: view.highlighted ? 1.08 : 1,
        y: view.visible ? 0 : 18,
      }}
      whileHover={{ scale: view.highlighted ? 1.13 : 1.08, y: -4 }}
      transition={{ type: "spring", stiffness: 40, damping: 18 }}
      onClick={() => onFocus(view.node.id)}
    >
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-aura" />
      <div className="node-head">
        <span className="node-icon">{Icon ? <Icon aria-hidden /> : null}</span>
      </div>
        <h2>{view.node.title}</h2>
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </motion.article>
  );
}

export const NeuralNode = memo(NeuralNodeComponent);
