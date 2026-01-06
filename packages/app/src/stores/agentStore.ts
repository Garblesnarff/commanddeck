import { create } from 'zustand'
import type { CommandDeckEvent } from '../hooks/useWebSocket'

export type AgentType = 'scout' | 'worker' | 'coder' | 'architect' | 'debugger'
export type AgentStatus = 'idle' | 'moving' | 'working' | 'error'

export interface Agent {
  id: string
  type: AgentType
  position: [number, number, number]
  targetPosition: [number, number, number] | null
  status: AgentStatus
  message?: string
  progress?: number
  lastUpdate: number
}

interface AgentStore {
  agents: Map<string, Agent>
  moveIndicators: Map<string, { position: [number, number, number]; timestamp: number }>

  // Actions
  handleEvent: (event: CommandDeckEvent) => void
  addAgent: (id: string, type: AgentType, position: [number, number, number]) => void
  updateAgent: (id: string, updates: Partial<Agent>) => void
  removeAgent: (id: string) => void
  clearMoveIndicator: (id: string) => void
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: new Map(),
  moveIndicators: new Map(),

  handleEvent: (event: CommandDeckEvent) => {
    const { type, agent_id, agent_type, target_pos, progress, message } = event

    switch (type) {
      case 'spawn': {
        const position: [number, number, number] = target_pos ?? [0, 0, 0]
        get().addAgent(agent_id, agent_type, position)
        break
      }

      case 'move': {
        if (target_pos) {
          get().updateAgent(agent_id, {
            targetPosition: target_pos,
            status: 'moving',
            message
          })
          // Add move indicator
          set((state) => {
            const newIndicators = new Map(state.moveIndicators)
            newIndicators.set(agent_id, { position: target_pos, timestamp: Date.now() })
            return { moveIndicators: newIndicators }
          })
        }
        break
      }

      case 'work': {
        get().updateAgent(agent_id, {
          status: 'working',
          progress: progress ?? 0,
          message
        })
        break
      }

      case 'progress': {
        get().updateAgent(agent_id, {
          progress,
          message
        })
        break
      }

      case 'complete': {
        get().updateAgent(agent_id, {
          status: 'idle',
          progress: 100,
          message,
          targetPosition: null
        })
        break
      }

      case 'error': {
        get().updateAgent(agent_id, {
          status: 'error',
          message
        })
        break
      }

      case 'idle': {
        get().updateAgent(agent_id, {
          status: 'idle',
          targetPosition: null,
          message
        })
        break
      }
    }
  },

  addAgent: (id, type, position) => {
    set((state) => {
      const newAgents = new Map(state.agents)
      newAgents.set(id, {
        id,
        type,
        position,
        targetPosition: null,
        status: 'idle',
        lastUpdate: Date.now()
      })
      console.log('[AgentStore] Agent spawned:', id, type)
      return { agents: newAgents }
    })
  },

  updateAgent: (id, updates) => {
    set((state) => {
      const agent = state.agents.get(id)
      if (!agent) {
        // Auto-create agent if it doesn't exist (for late joiners)
        console.warn('[AgentStore] Agent not found, creating:', id)
        const newAgents = new Map(state.agents)
        newAgents.set(id, {
          id,
          type: 'scout',
          position: [0, 0, 0],
          targetPosition: null,
          status: 'idle',
          lastUpdate: Date.now(),
          ...updates
        })
        return { agents: newAgents }
      }

      const newAgents = new Map(state.agents)
      newAgents.set(id, {
        ...agent,
        ...updates,
        lastUpdate: Date.now()
      })
      return { agents: newAgents }
    })
  },

  removeAgent: (id) => {
    set((state) => {
      const newAgents = new Map(state.agents)
      newAgents.delete(id)
      const newIndicators = new Map(state.moveIndicators)
      newIndicators.delete(id)
      console.log('[AgentStore] Agent removed:', id)
      return { agents: newAgents, moveIndicators: newIndicators }
    })
  },

  clearMoveIndicator: (id) => {
    set((state) => {
      const newIndicators = new Map(state.moveIndicators)
      newIndicators.delete(id)
      return { moveIndicators: newIndicators }
    })
  }
}))

// Selector hooks for convenience
export const useAgents = () => useAgentStore((state) => Array.from(state.agents.values()))
export const useAgent = (id: string) => useAgentStore((state) => state.agents.get(id))
export const useMoveIndicators = () => useAgentStore((state) => Array.from(state.moveIndicators.entries()))
