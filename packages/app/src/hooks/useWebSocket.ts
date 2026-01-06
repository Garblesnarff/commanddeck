import { useEffect, useRef, useState, useCallback } from 'react'

export interface CommandDeckEvent {
  type: 'spawn' | 'move' | 'work' | 'progress' | 'complete' | 'error' | 'idle'
  agent_id: string
  agent_type: 'scout' | 'worker' | 'coder' | 'architect' | 'debugger'
  target?: string
  target_pos?: [number, number, number]
  progress?: number
  message?: string
  timestamp: number
}

interface UseWebSocketResult {
  connected: boolean
  lastEvent: CommandDeckEvent | null
  sendEvent: (event: Partial<CommandDeckEvent> & { type: CommandDeckEvent['type']; agent_id: string; agent_type: CommandDeckEvent['agent_type'] }) => void
}

const WS_URL = 'ws://localhost:8765/ws'
const RECONNECT_DELAY = 2000
const MAX_RECONNECT_DELAY = 30000

export function useWebSocket(onEvent?: (event: CommandDeckEvent) => void): UseWebSocketResult {
  const [connected, setConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<CommandDeckEvent | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const reconnectDelayRef = useRef(RECONNECT_DELAY)
  const onEventRef = useRef(onEvent)

  // Keep callback ref updated
  onEventRef.current = onEvent

  const connect = useCallback(() => {
    // Clean up existing connection
    if (wsRef.current) {
      wsRef.current.close()
    }

    try {
      console.log('[WebSocket] Connecting to', WS_URL)
      const ws = new WebSocket(WS_URL)

      ws.onopen = () => {
        console.log('[WebSocket] Connected')
        setConnected(true)
        reconnectDelayRef.current = RECONNECT_DELAY // Reset delay on successful connection
      }

      ws.onclose = (event) => {
        console.log('[WebSocket] Disconnected', event.code, event.reason)
        setConnected(false)
        wsRef.current = null

        // Auto-reconnect with exponential backoff
        const delay = reconnectDelayRef.current
        console.log(`[WebSocket] Reconnecting in ${delay}ms...`)

        reconnectTimeoutRef.current = window.setTimeout(() => {
          reconnectDelayRef.current = Math.min(delay * 1.5, MAX_RECONNECT_DELAY)
          connect()
        }, delay)
      }

      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as CommandDeckEvent
          console.log('[WebSocket] Event:', data.type, data.agent_id)
          setLastEvent(data)
          onEventRef.current?.(data)
        } catch (err) {
          console.error('[WebSocket] Failed to parse message:', err)
        }
      }

      wsRef.current = ws
    } catch (err) {
      console.error('[WebSocket] Connection failed:', err)
      // Retry connection
      reconnectTimeoutRef.current = window.setTimeout(connect, reconnectDelayRef.current)
    }
  }, [])

  const sendEvent = useCallback((event: Partial<CommandDeckEvent> & { type: CommandDeckEvent['type']; agent_id: string; agent_type: CommandDeckEvent['agent_type'] }) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const fullEvent: CommandDeckEvent = {
        ...event,
        timestamp: event.timestamp ?? Date.now() / 1000
      }
      wsRef.current.send(JSON.stringify(fullEvent))
    } else {
      console.warn('[WebSocket] Cannot send event - not connected')
    }
  }, [])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [connect])

  return { connected, lastEvent, sendEvent }
}
