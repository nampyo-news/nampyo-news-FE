"use client"

import { useEffect, useMemo, useRef, useState } from "react"

export type SSEReadyState = "connecting" | "open" | "closed"

export interface UseSSEOptions<T> {
  // Event name to listen for; default is standard message event
  event?: string
  // Automatically connect on mount
  autoConnect?: boolean
  // Whether to include cookies; defaults to false
  withCredentials?: boolean
  // Optional query params to append to the URL
  query?: Record<string, string | number | boolean | undefined>
  // Initial data to seed into messages state
  initialData?: T[]
  // Max number of messages to keep in memory
  maxMessages?: number
}

export interface UseSSEReturn<T> {
  lastMessage: T | null
  messages: T[]
  error: string | null
  readyState: SSEReadyState
  connect: () => void
  disconnect: () => void
}

function buildUrl(base: string, query?: UseSSEOptions<unknown>["query"]) {
  if (!query || Object.keys(query).length === 0) return base
  const url = new URL(base)
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined) continue
    url.searchParams.set(k, String(v))
  }
  return url.toString()
}

/**
 * Generic SSE hook built on EventSource. Parses event.data as JSON when possible,
 * otherwise returns event.data string.
 */
export function useSSE<T = any>(
  url: string,
  {
    event,
    autoConnect = true,
    withCredentials = false,
    query,
    initialData = [],
    maxMessages = 200,
  }: UseSSEOptions<T> = {},
): UseSSEReturn<T> {
  const [readyState, setReadyState] = useState<SSEReadyState>("connecting")
  const [lastMessage, setLastMessage] = useState<T | null>(null)
  const [messages, setMessages] = useState<T[]>(() => initialData)
  const [error, setError] = useState<string | null>(null)
  const esRef = useRef<EventSource | null>(null)
  const targetUrl = useMemo(() => buildUrl(url, query), [url, query])

  const disconnect = () => {
    if (esRef.current) {
      esRef.current.close()
      esRef.current = null
      setReadyState("closed")
    }
  }

  const connect = () => {
    // Avoid duplicate connections
    if (esRef.current) return
    setError(null)
    setReadyState("connecting")
    const es = new EventSource(targetUrl, { withCredentials })
    esRef.current = es

    const handler = (e: MessageEvent) => {
      let parsed: any
      try {
        parsed = e.data ? JSON.parse(e.data) : null
      } catch {
        parsed = (e.data as unknown) as T
      }
      setLastMessage(parsed)
      setMessages((prev) => {
        const next = [...prev, parsed as T]
        if (next.length > maxMessages) next.shift()
        return next
      })
    }

    if (event) {
      es.addEventListener(event, handler as EventListener)
    } else {
      es.onmessage = handler
    }

    es.onerror = () => {
      setError("SSE 연결 오류가 발생했습니다. 서버 상태를 확인해 주세요.")
      // EventSource will auto-reconnect; we reflect state for UI
      setReadyState("connecting")
    }

    es.onopen = () => {
      setReadyState("open")
    }
  }

  useEffect(() => {
    if (!autoConnect) return
    connect()
    return () => disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUrl])

  return { lastMessage, messages, error, readyState, connect, disconnect }
}
