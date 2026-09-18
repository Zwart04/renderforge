"use client";

import { useToast } from "@/components/ui/toast-provider";
import { useEffect, useState, useRef } from "react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  GitBranch,
  Plus,
  Trash2,
  Play,
  Square,
  RotateCcw,
  Search,
  Type,
  Hash,
  Box,
  ChevronRight,
} from "lucide-react";

interface GraphNode {
  id: string;
  type: "source" | "compute" | "sink";
  label: string;
  x: number;
  y: number;
  inputs: { id: string; label: string; connected: boolean }[];
  outputs: { id: string; label: string; connected: boolean }[];
}

interface Connection {
  from: string;
  fromOutput: string;
  to: string;
  toInput: string;
}

const NODE_TYPES: Array<{ type: "source" | "compute" | "sink"; label: string; icon: typeof Hash; color: string }> = [
  { type: "source", label: "Source", icon: Hash, color: "text-blue-500" },
  { type: "compute", label: "Compute", icon: Type, color: "text-purple-500" },
  { type: "sink", label: "Sink", icon: Box, color: "text-green-500" },
];

const PRESET_GRAPHS: { name: string; nodes: GraphNode[]; connections: Connection[] }[] = [
  {
    name: "Simple Pipeline",
    nodes: [
      {
        id: "1",
        type: "source",
        label: "Noise Input",
        x: 50,
        y: 200,
        inputs: [],
        outputs: [{ id: "out1", label: "value", connected: false }],
      },
      {
        id: "2",
        type: "compute",
        label: "Transform",
        x: 300,
        y: 200,
        inputs: [{ id: "in1", label: "input", connected: false }],
        outputs: [{ id: "out1", label: "result", connected: false }],
      },
      {
        id: "3",
        type: "sink",
        label: "Canvas Output",
        x: 550,
        y: 200,
        inputs: [{ id: "in1", label: "data", connected: false }],
        outputs: [],
      },
    ],
    connections: [
      { from: "1", fromOutput: "out1", to: "2", toInput: "in1" },
      { from: "2", fromOutput: "out1", to: "3", toInput: "in1" },
    ],
  },
];

export default function GraphEditorPage() {
  const { locale } = useApp();
  const { toast } = useToast();
  const [nodes, setNodes] = useState<GraphNode[]>(() => [...PRESET_GRAPHS[0].nodes]);
  const [connections, setConnections] = useState<Connection[]>(() => [...PRESET_GRAPHS[0].connections]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ nodeId: string; offsetX: number; offsetY: number } | null>(null);
  const [connecting, setConnecting] = useState<{ nodeId: string; outputId: string } | null>(null);
  const [search, setSearch] = useState("");
  const [running, setRunning] = useState(false);

  const t = {
    title: locale === "id" ? "Editor Graf Aliran Data" : "Data Flow Graph Editor",
    subtitle: locale === "id" ? "Buat pipeline komputasi visual dengan node drag-and-drop" : "Build visual compute pipelines with drag-and-drop nodes",
    clear: locale === "id" ? "Hapus Semua" : "Clear All",
    nodeSource: locale === "id" ? "Sumber" : "Source",
    nodeCompute: locale === "id" ? "Komputasi" : "Compute",
    nodeSink: locale === "id" ? "Tujuan" : "Sink",
    input: locale === "id" ? "Masukan" : "Input",
    output: locale === "id" ? "Keluaran" : "Output",
    noNodes: locale === "id" ? "Tambah node untuk memulai" : "Add nodes to get started",
    run: locale === "id" ? "Jalankan" : "Run",
    stop: locale === "id" ? "Berhenti" : "Stop",
  };

  const filteredNodeTypes = NODE_TYPES.filter(
    (nt) =>
      nt.label.toLowerCase().includes(search.toLowerCase()) ||
      nt.type.toLowerCase().includes(search.toLowerCase())
  );

  const addNode = (type: "source" | "compute" | "sink") => {
    const nodeCount = nodes.filter((n) => n.type === type).length + 1;
    const labelKey = type === "source" ? "nodeSource" : type === "compute" ? "nodeCompute" : "nodeSink";
    const newNode: GraphNode = {
      id: Math.random().toString(36).slice(2),
      type,
      label: `${t[labelKey]} ${nodeCount}`,
      x: 100 + Math.random() * 300,
      y: 100 + Math.random() * 200,
      inputs: type === "source" ? [] : [{ id: `in_${Date.now()}`, label: t.input, connected: false }],
      outputs: type === "sink" ? [] : [{ id: `out_${Date.now()}`, label: t.output, connected: false }],
    };
    setNodes((prev) => [...prev, newNode]);
    toast({ title: locale === "id" ? "Node ditambahkan" : "Node added" });
  };

  const deleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setConnections((prev) => prev.filter((c) => c.from !== id && c.to !== id));
    if (selectedNode === id) setSelectedNode(null);
    toast({ title: locale === "id" ? "Node dihapus" : "Node deleted" });
  };

  const startConnecting = (nodeId: string, outputId: string) => {
    setConnecting({ nodeId, outputId });
  };

  const completeConnection = (nodeId: string, inputId: string) => {
    if (!connecting) return;
    const exists = connections.some((c) => c.to === nodeId && c.toInput === inputId);
    if (exists) {
      setConnecting(null);
      return;
    }
    setConnections((prev) => [
      ...prev,
      { from: connecting.nodeId, fromOutput: connecting.outputId, to: nodeId, toInput: inputId },
    ]);
    setConnecting(null);
    toast({ title: locale === "id" ? "Koneksi dibuat" : "Connection made" });
  };

  const clearAll = () => {
    if (nodes.length === 0) return;
    setNodes([]);
    setConnections([]);
    setSelectedNode(null);
    toast({ title: locale === "id" ? "Graf direset" : "Graph reset" });
  };

  const runGraph = () => {
    if (nodes.length === 0) {
      toast({ title: locale === "id" ? "Tambah node dulu" : "Add nodes first", variant: "destructive" });
      return;
    }
    setRunning(true);
    setTimeout(() => setRunning(false), 1500);
    toast({ title: locale === "id" ? "Pipeline berjalan" : "Pipeline running" });
  };

  const handleMouseDown = (e: React.MouseEvent, node: GraphNode) => {
    e.stopPropagation();
    setSelectedNode(node.id);
    setDragging({
      nodeId: node.id,
      offsetX: e.clientX - node.x,
      offsetY: e.clientY - node.y,
    });
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === dragging!.nodeId
            ? { ...n, x: e.clientX - dragging.offsetX, y: e.clientY - dragging.offsetY }
            : n
        )
      );
    };

    const handleMouseUp = () => setDragging(null);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">{t.title}</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={clearAll}
              disabled={nodes.length === 0}
              className="border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
            >
              <RotateCcw size={14} className="mr-1" />
              {t.clear}
            </Button>
            <Button
              size="sm"
              onClick={runGraph}
              disabled={running || nodes.length === 0}
              className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))/90]"
            >
              {running ? (
                <Square size={14} className="mr-1" />
              ) : (
                <Play size={14} className="mr-1" />
              )}
              {running ? t.stop : t.run}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Toolbar */}
          <div className="lg:col-span-1 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Search size={14} className="text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={locale === "id" ? "Cari node..." : "Search nodes..."}
                className="flex-1 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg px-3 py-1.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]"
              />
            </div>

            <div className="space-y-2">
              {filteredNodeTypes.map((nt) => (
                <button
                  key={nt.type}
                  onClick={() => addNode(nt.type)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--background))] border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] transition-colors text-left"
                >
                  <nt.icon size={18} className={`${nt.color} bg-[hsl(var(--muted))/50 rounded-full p-1`} />
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">{nt.label}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {locale === "id" ? `Tambah node ${nt.label}` : `Add ${nt.label.toLowerCase()} node`}
                    </p>
                  </div>
                  <ChevronRight size={14} className="ml-auto text-[hsl(var(--muted-foreground))]" />
                </button>
              ))}
            </div>

            {/* Graph stats */}
            <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
              <h3 className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">
                {locale === "id" ? "Statistik Graf" : "Graph Stats"}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">{t.nodeSource}</span>
                  <span className="text-[hsl(var(--foreground))]">{nodes.filter((n) => n.type === "source").length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">{t.nodeCompute}</span>
                  <span className="text-[hsl(var(--foreground))]">{nodes.filter((n) => n.type === "compute").length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">{t.nodeSink}</span>
                  <span className="text-[hsl(var(--foreground))]">{nodes.filter((n) => n.type === "sink").length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">{locale === "id" ? "Koneksi" : "Connections"}</span>
                  <span className="text-[hsl(var(--foreground))]">{connections.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Graph Canvas */}
          <div className="lg:col-span-3 relative bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
            <div
              className="w-full h-full min-h-[600px] p-4"
              onClick={() => setSelectedNode(null)}
            >
              {nodes.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[hsl(var(--muted-foreground))]">
                  <div className="text-center">
                    <GitBranch size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-lg">{t.noNodes}</p>
                  </div>
                </div>
              ) : (
                <svg className="w-full h-full" viewBox="0 0 800 600">
                  {/* Connections */}
                  <g>
                    {connections.map((conn, idx) => {
                      const fromNode = nodes.find((n) => n.id === conn.from);
                      const toNode = nodes.find((n) => n.id === conn.to);
                      if (!fromNode || !toNode) return null;

                      const x1 = fromNode.x + 120;
                      const y1 = fromNode.y + 20;
                      const x2 = toNode.x;
                      const y2 = toNode.y + 20;

                      return (
                        <g key={idx}>
                          <path
                            d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <circle cx={x1} cy={y1} r="4" fill="hsl(var(--primary))" />
                          <circle cx={x2} cy={y2} r="4" fill="hsl(var(--primary))" />
                        </g>
                      );
                    })}
                  </g>

                  {/* Nodes */}
                  {nodes.map((node) => (
                    <g
                      key={node.id}
                      onMouseDown={(e) => handleMouseDown(e, node)}
                      style={{ cursor: "grab" }}
                    >
                      <rect
                        x={node.x}
                        y={node.y}
                        width={120}
                        height={60}
                        rx={8}
                        fill="hsl(var(--card))"
                        stroke={selectedNode === node.id ? "hsl(var(--primary))" : "hsl(var(--border))"}
                        strokeWidth={selectedNode === node.id ? 2 : 1}
                        className="transition-all"
                      />
                      <text
                        x={node.x + 10}
                        y={node.y + 20}
                        fill="hsl(var(--foreground))"
                        fontSize="11"
                        fontWeight="600"
                      >
                        {node.label}
                      </text>
                      {/* Type badge */}
                      <rect
                        x={node.x + 8}
                        y={node.y + 32}
                        width={50}
                        height={16}
                        rx={4}
                        fill={
                          node.type === "source"
                            ? "hsl(217, 91%, 60% / 20%)"
                            : node.type === "compute"
                            ? "hsl(290, 91%, 60% / 20%)"
                            : "hsl(152, 91%, 60% / 20%)"
                        }
                      />
                      <text x={node.x + 13} y={node.y + 44} fill="hsl(var(--foreground))" fontSize="9">
                        {node.type}
                      </text>
                      {/* Input ports */}
                      {node.inputs.map((input, i) => (
                        <g key={input.id}>
                          <circle
                            cx={node.x - 5}
                            cy={node.y + 15 + i * 15}
                            r="5"
                            fill={input.connected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                            stroke="hsl(var(--card))"
                            strokeWidth={1}
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              completeConnection(node.id, input.id);
                            }}
                          />
                          <text
                            x={node.x - 10}
                            y={node.y + 18 + i * 15}
                            fill="hsl(var(--muted-foreground))"
                            fontSize="8"
                            textAnchor="end"
                          >
                            {input.label}
                          </text>
                        </g>
                      ))}
                      {/* Output ports */}
                      {node.outputs.map((output, i) => (
                        <g key={output.id}>
                          <circle
                            cx={node.x + 120 + 5}
                            cy={node.y + 15 + i * 15}
                            r="5"
                            fill={output.connected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                            stroke="hsl(var(--card))"
                            strokeWidth={1}
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              startConnecting(node.id, output.id);
                            }}
                          />
                          <text
                            x={node.x + 125}
                            y={node.y + 18 + i * 15}
                            fill="hsl(var(--muted-foreground))"
                            fontSize="8"
                          >
                            {output.label}
                          </text>
                        </g>
                      ))}
                    </g>
                  ))}
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
