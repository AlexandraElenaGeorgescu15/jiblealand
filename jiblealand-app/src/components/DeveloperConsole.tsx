import React, { useState } from 'react';
import { X, Terminal, Cpu, Network, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';
import { McpCallLog, N8nWebhookLog } from '../types';

interface DeveloperConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  mcpLogs: McpCallLog[];
  n8nLogs: N8nWebhookLog[];
  onTriggerMcp: () => void;
  isMcpLoading: boolean;
}

export const DeveloperConsole: React.FC<DeveloperConsoleProps> = ({
  isOpen,
  onClose,
  mcpLogs,
  n8nLogs,
  onTriggerMcp,
  isMcpLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'mcp' | 'n8n'>('mcp');
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (logId: string, content: unknown) => {
    navigator.clipboard?.writeText?.(JSON.stringify(content, null, 2));
    setCopiedLogId(logId);
    setTimeout(() => setCopiedLogId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl p-6 text-slate-900 max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-black text-slate-900 flex items-center gap-2">
                Consolă Integrări (MCP & n8n)
                <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">
                  Dev Mode
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Inspecție prototip pentru simulare conexiuni backend
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Închide consola"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-2 my-4 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('mcp')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'mcp'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>MCP Tool Calls ({mcpLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('n8n')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'n8n'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>n8n Webhooks ({n8nLogs.length})</span>
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {activeTab === 'mcp' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">Model Context Protocol (MCP)</p>
                  <p className="text-xs text-slate-500">
                    Tool: <code className="text-red-600 font-bold">get_wait_times</code> · Senzori turnichet live
                  </p>
                </div>
                <button
                  onClick={onTriggerMcp}
                  disabled={isMcpLoading}
                  className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isMcpLoading ? 'Se apelează...' : 'Apelează Tool Acum'}
                </button>
              </div>

              {mcpLogs.length === 0 ? (
                <div className="p-6 text-center text-slate-400 font-mono text-xs">
                  Niciun apel MCP înregistrat încă.
                </div>
              ) : (
                mcpLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs shadow-inner"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                        tool: {log.tool}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          {log.durationMs}ms · {log.responseCount} atracții
                        </span>
                        <button
                          onClick={() => handleCopy(log.id, log)}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Copiază JSON"
                        >
                          {copiedLogId === log.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-400 text-[11px] mb-2 font-sans">
                      Server: <span className="text-white font-mono">{log.server}</span> · {log.timestamp}
                    </p>
                    <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 overflow-x-auto text-[11px] border border-slate-800">
                      {JSON.stringify(log.arguments, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'n8n' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="font-bold text-slate-900">n8n Automation Flow</p>
                <p className="text-xs text-slate-500">
                  Endpoint: <code className="text-red-600 font-bold">https://n8n.jiblealand.ro/webhook/feedback</code>
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-600">
                  <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-bold">
                    Webhook POST
                  </span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 font-semibold">
                    Sentiment & Prioritate
                  </span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    Dispecerat Parc
                  </span>
                </div>
              </div>

              {n8nLogs.length === 0 ? (
                <div className="p-6 text-center text-slate-400 font-mono text-xs">
                  Niciun request n8n înregistrat. Trimite un mesaj din ecranul Portofel & Profil!
                </div>
              ) : (
                n8nLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs shadow-inner"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {log.method} {log.payload.ticketId}
                      </span>
                      <button
                        onClick={() => handleCopy(log.id, log)}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Copiază JSON"
                      >
                        {copiedLogId === log.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-slate-400 text-[11px] mb-2 font-sans">
                      {log.endpoint} · {log.timestamp}
                    </p>
                    <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 overflow-x-auto text-[11px] border border-slate-800">
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
