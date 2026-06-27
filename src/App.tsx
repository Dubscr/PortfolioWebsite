import { AnimatePresence, motion } from "framer-motion";
import { portfolioNodes } from "./data/portfolio";
import { GraphEngine } from "./engine/GraphEngine";
import { ReactFlowAdapter } from "./engine/adapters/ReactFlowAdapter";
import { ContentPanel } from "./components/ContentPanel";
import { usePortfolioGraph } from "./hooks/usePortfolioGraph";

const engine = new GraphEngine(portfolioNodes);

export default function App() {
  const graph = usePortfolioGraph(engine);

  return (
    <main className="app-shell" data-theme="dark">
      <div className="ambient-grid" />
      <motion.header
        className="topbar"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 24 }}
      >
        <div className="brand">
          <img src="/dubscr-logo.png" alt="" aria-hidden />
          <div>
            <strong>Dubscr&apos;s Website</strong>
            <span>Interactive portfolio</span>
          </div>
        </div>
      </motion.header>

      <section className="graph-stage" aria-label="Interactive portfolio graph">
        <ReactFlowAdapter graph={graph} />
      </section>

      <AnimatePresence>
        {graph.selectedNode ? (
          <ContentPanel
            key={graph.selectedNode.id}
            node={graph.selectedNode}
            path={engine.getPath(graph.selectedNode.id)}
            onClose={graph.clearSelection}
            onNavigate={graph.focusNode}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
