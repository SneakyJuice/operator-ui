import { useState } from 'react';
import type { LiveData } from '@/lib/useLiveData';

export default function AgentManagerView({ liveData }: { liveData: LiveData }) {
  const [showModal, setShowModal] = useState(false);

  const AGENT_TASKS: Record<string, string> = {
    Zion:  'Orchestrating P2 sprint',
    Atlas: 'No active task',
    Ark:   'No active task',
  }
  const AGENT_IPS: Record<string, string> = {
    Zion:  '165.245.136.97',
    Atlas: '100.78.163.113',
    Ark:   '100.124.40.44',
  }
  const AGENT_MODELS: Record<string, string> = {
    Zion:  'claude-sonnet-4-6',
    Atlas: 'qwen3-235b',
    Ark:   'qwen3-235b',
  }
  const LIVE_KEY: Record<string, keyof LiveData['agents']> = {
    Zion: 'zion', Atlas: 'atlas', Ark: 'ark',
  }

  const getAgentData = (name: string) => {
    const key = LIVE_KEY[name]
    const live = key ? liveData?.agents?.[key] : undefined
    return {
      status: (live?.status ?? 'offline').toUpperCase(),
      task: AGENT_TASKS[name] ?? 'No active task',
      ip: live?.ip ?? AGENT_IPS[name] ?? '',
      model: AGENT_MODELS[name] ?? '',
    }
  };

  const statusColors = {
    ONLINE: 'bg-emerald-500',
    OFFLINE: 'bg-gray-500',
    SYNC: 'bg-[#ECAB23]',
    DEGRADED: 'bg-yellow-500'
  };

  const agentConfigs = [
    { name: 'Zion', emoji: '⚡', role: 'Orchestrator', canSpawn: true },
    { name: 'Atlas', emoji: '🔵', role: 'Primary Executor', canSpawn: false },
    { name: 'Ark', emoji: '🟢', role: 'Secondary Executor', canSpawn: false }
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agentConfigs.map((config) => {
          const data = getAgentData(config.name);
          return (
            <div key={config.name} className="bg-[#0a2535] rounded-xl p-6 border border-[#1a4a62]">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">{config.emoji}</span>
                <div>
                  <h3 className="text-white font-bold">{config.name}</h3>
                  <p className="text-sm text-[#8aacbc]">{config.role}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <code className="text-xs bg-[#071820] px-2 py-1 rounded text-[#8aacbc]">{data.ip}</code>
              </div>

              <div className="flex items-center mb-4">
                <div className={`w-2.5 h-2.5 rounded-full ${statusColors[data.status as keyof typeof statusColors]} mr-2`}></div>
                <span className="text-sm text-white">{data.status}</span>
              </div>

              <div className="mb-4">
                <p className="text-xs text-[#8aacbc]">Current Task</p>
                <p className="text-sm text-white">{data.task}</p>
              </div>

              <div className="mb-6">
                <p className="text-xs text-[#8aacbc]">Model</p>
                <p className="text-sm text-white bg-[#071820] px-2 py-1 rounded inline-block text-xs">{data.model}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => console.log('Pinged', config.name)}
                  className="text-xs px-3 py-1 bg-[#071820] hover:bg-[#0a2535] border border-[#1a4a62] rounded"
                >
                  Ping
                </button>
                <button 
                  onClick={() => { /* no-op */ }}
                  className="text-xs px-3 py-1 bg-[#071820] hover:bg-[#0a2535] border border-[#1a4a62] rounded"
                >
                  View Logs
                </button>
                {config.canSpawn && (
                  <button 
                    onClick={() => setShowModal(true)}
                    className="text-xs px-3 py-1 bg-[#ECAB23] hover:bg-[#F2C037] text-[#071820] rounded font-medium"
                  >
                    Spawn Sub-Agent
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Spawn Sub-Agent Modal (Zion only) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0a2535] rounded-xl p-6 border border-[#1a4a62] w-96">
            <h3 className="text-white font-bold mb-4">Spawn Sub-Agent</h3>
            
            <div className="mb-4">
              <label className="block text-xs text-[#8aacbc] mb-1">Role</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-[#071820] border border-[#1a4a62] rounded text-white text-sm"
                placeholder="e.g. Research Specialist"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs text-[#8aacbc] mb-1">Model</label>
              <select className="w-full px-3 py-2 bg-[#071820] border border-[#1a4a62] rounded text-white text-sm">
                <option>qwen3-235b</option>
                <option>claude-sonnet-4-6</option>
                <option>gemini-flash</option>
              </select>
            </div>

            <div className="mb-6">
              <p className="text-xs text-[#4a7a94]">Estimated cost: ~$0.01–0.05</p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-[#071820] hover:bg-[#0a2535] border border-[#1a4a62] rounded text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowModal(false);
                }}
                className="flex-1 px-4 py-2 bg-[#ECAB23] hover:bg-[#F2C037] text-[#071820] rounded font-medium text-sm"
              >
                Spawn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Agent Lineage Section */}
      <div className="mt-8">
        <h3 className="text-white font-bold mb-4">Active Sub-Agents</h3>
        <div className="text-sm text-[#8aacbc]">
          <div>Zion →</div>
          <div className="ml-4 mt-2">• Agent 1 — P2 Full Sprint (running)</div>
          <div className="ml-4 mt-1">• Agent 2 — [idle]</div>
        </div>
      </div>
    </div>
  );
}