import { useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeTypes,
  useReactFlow,
} from "reactflow";
import { motion } from "framer-motion";
import { NeuralNode } from "../../components/NeuralNode";
import type { usePortfolioGraph } from "../../hooks/usePortfolioGraph";

type GraphController = ReturnType<typeof usePortfolioGraph>;

interface ReactFlowAdapterProps {
  graph: GraphController;
}

export function ReactFlowAdapter({ graph }: ReactFlowAdapterProps) {
  return (
    <ReactFlowProvider>
      <ReactFlowAdapterInner graph={graph} />
    </ReactFlowProvider>
  );
}

function ReactFlowAdapterInner({ graph }: ReactFlowAdapterProps) {
  const flow = useReactFlow();
  const focused = graph.graphNodes.find((item) => item.node.id === graph.focusedId);
  const nodeTypes = useMemo<NodeTypes>(() => ({ neural: NeuralNode }), []);
  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  const nodes = useMemo<Node[]>(
    () =>
      graph.graphNodes.map((item) => ({
        id: item.node.id,
        type: "neural",
        position: item.position,
        hidden: !item.visible,
        data: {
          view: item,
          onFocus: graph.focusNode,
          onToggle: graph.toggleNode,
        },
      })),
    [graph],
  );

  const edges = useMemo<Edge[]>(
    () =>
      graph.graphEdges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        hidden:
          !graph.graphNodes.find((node) => node.node.id === edge.source)?.visible ||
          !graph.graphNodes.find((node) => node.node.id === edge.target)?.visible,
        animated: edge.animated,
        className: edge.highlighted ? "neural-edge is-hot" : "neural-edge",
        style: {
          strokeWidth: edge.highlighted ? 2.4 : 1.2,
        },
      })),
    [graph.graphEdges, graph.graphNodes],
  );

  useEffect(() => {
    if (!focused) return;
    flow.setCenter(focused.position.x + 78, focused.position.y + 38, {
      zoom: 1.3,
      duration: 650,
    });
  }, [flow, focused]);

  return (
    <motion.div
      className="flow-wrap"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.46}
        maxZoom={1.85}
        proOptions={proOptions}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        zoomOnScroll
      >
        <Background color="var(--grid-line)" gap={26} size={1} variant={BackgroundVariant.Dots} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </motion.div>
  );
}
