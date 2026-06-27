import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { ContentViewer } from "../viewers/ContentViewer";
import type { ResolvedPortfolioNode } from "../types/portfolio";

interface ContentPanelProps {
  node: ResolvedPortfolioNode;
  path: ResolvedPortfolioNode[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export function ContentPanel({ node, path, onClose, onNavigate }: ContentPanelProps) {
  return (
    <motion.aside
      className="content-panel"
      initial={{ opacity: 0, x: 42, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 42, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      <div className="panel-path">
        {path.map((item, index) => (
          <button key={item.id} type="button" onClick={() => onNavigate(item.id)}>
            {index > 0 ? <span>/</span> : null}
            {item.title}
          </button>
        ))}
      </div>
      <button className="panel-close" type="button" onClick={onClose} title="Close">
        <FiX />
      </button>
      <header>
        <h1>{node.title}</h1>
      </header>
      <p>{node.description}</p>
      <ContentViewer node={node} />
    </motion.aside>
  );
}
