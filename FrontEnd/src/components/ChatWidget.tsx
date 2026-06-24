'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY = 'serubix_chat_session'

function getOrCreateSessionKey(): string {
  let key = localStorage.getItem(STORAGE_KEY)
  if (!key) {
    key = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, key)
  }
  return key
}

export function ChatWidget() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sessionKeyRef = useRef<string | null>(null)

  // Inicializar sessionKey desde localStorage
  useEffect(() => {
    sessionKeyRef.current = getOrCreateSessionKey()
  }, [])

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus en el textarea al abrir
  useEffect(() => {
    if (isOpen) textareaRef.current?.focus()
  }, [isOpen])

  const loadHistory = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const sessionKey = sessionKeyRef.current
    if (!apiUrl || !sessionKey || hasLoadedHistory) return

    setIsLoadingHistory(true)
    try {
      const token = session?.backendToken
      const params = new URLSearchParams({ sessionKey })
      const res = await fetch(`${apiUrl}/chat/history?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) return
      const data: Array<{ role: 'user' | 'assistant'; content: string }> = await res.json()
      if (data.length > 0) {
        setMessages(data.map((m, i) => ({ id: `history-${i}`, role: m.role, content: m.content })))
      }
    } catch {
      // Historial no disponible — empieza vacío
    } finally {
      setIsLoadingHistory(false)
      setHasLoadedHistory(true)
    }
  }, [session?.backendToken, hasLoadedHistory])

  // Cargar historial al abrir por primera vez
  useEffect(() => {
    if (isOpen && !hasLoadedHistory) {
      loadHistory()
    }
  }, [isOpen, hasLoadedHistory, loadHistory])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isStreaming) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const sessionKey = sessionKeyRef.current
    if (!apiUrl || !sessionKey) return

    setInput('')
    setError(null)

    const userMsgId = `user-${Date.now()}`
    const assistantMsgId = `assistant-${Date.now() + 1}`

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', content: text },
      { id: assistantMsgId, role: 'assistant', content: '' },
    ])
    setIsStreaming(true)

    try {
      const token = session?.backendToken
      const res = await fetch(`${apiUrl}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ message: text, sessionKey }),
      })

      if (!res.ok || !res.body) {
        throw new Error(`Error ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (raw === '[DONE]') break

          try {
            const parsed = JSON.parse(raw) as {
              type: 'session' | 'delta' | 'error'
              content?: string
              sessionKey?: string
            }

            if (parsed.type === 'session' && parsed.sessionKey) {
              sessionKeyRef.current = parsed.sessionKey
              localStorage.setItem(STORAGE_KEY, parsed.sessionKey)
            } else if (parsed.type === 'delta' && parsed.content) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId ? { ...m, content: m.content + parsed.content! } : m,
                ),
              )
            } else if (parsed.type === 'error') {
              setError(parsed.content ?? 'Error desconocido')
              setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId))
            }
          } catch {
            // línea SSE malformada — ignorar
          }
        }
      }
    } catch {
      setError('No se pudo enviar el mensaje. Comprueba tu conexión.')
      setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId))
    } finally {
      setIsStreaming(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function toggleOpen() {
    setIsOpen((o) => !o)
    setError(null)
  }

  return (
    <>
      {/* ── Ventana de chat ── */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 z-50 flex flex-col w-[360px] h-[520px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
          role="dialog"
          aria-label="Asistente Serubix"
          aria-modal="false"
        >
          {/* Cabecera */}
          <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600">
              <BotIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-tight">Asistente Serubix</p>
              <p className="text-xs text-zinc-500 leading-tight">Pregúntame lo que necesites</p>
            </div>
            <button
              onClick={toggleOpen}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Cerrar chat"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
            {isLoadingHistory && (
              <div className="flex justify-center py-4">
                <SpinnerIcon className="text-zinc-600" />
              </div>
            )}

            {!isLoadingHistory && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 mb-3">
                  <BotIcon size={22} className="text-blue-400" />
                </div>
                <p className="text-sm font-medium text-zinc-300 mb-1">¡Hola! Soy el asistente de Serubix</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Puedo ayudarte con información sobre nuestros servicios, planes y herramientas. ¿En qué puedo ayudarte?
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 flex items-end">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600">
                      <BotIcon size={12} />
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-zinc-800 text-zinc-100 rounded-bl-sm border border-zinc-700/50'
                  }`}
                >
                  {msg.role === 'assistant' && msg.content === '' && isStreaming ? (
                    <TypingDots />
                  ) : (
                    <MessageContent content={msg.content} />
                  )}
                </div>
              </div>
            ))}

            {error && (
              <div className="mx-1 px-3 py-2 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 text-xs">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Área de entrada */}
          <div className="flex-shrink-0 px-3 py-3 border-t border-zinc-800 bg-zinc-900">
            <div className="flex gap-2 items-end bg-zinc-800 rounded-xl border border-zinc-700 focus-within:border-blue-500/60 transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                rows={1}
                maxLength={2000}
                disabled={isStreaming}
                aria-label="Mensaje al asistente"
                className="flex-1 bg-transparent resize-none px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50 max-h-28 overflow-y-auto leading-relaxed"
                style={{ fieldSizing: 'content' } as React.CSSProperties}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
                aria-label="Enviar mensaje"
                className="flex-shrink-0 flex items-center justify-center w-8 h-8 mb-1.5 mr-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white transition-colors"
              >
                {isStreaming ? <SpinnerIcon size={14} /> : <SendIcon />}
              </button>
            </div>
            <p className="text-[10px] text-zinc-600 text-center mt-2">
              Enter para enviar · Shift+Enter para nueva línea
            </p>
          </div>
        </div>
      )}

      {/* ── Botón flotante ── */}
      <button
        onClick={toggleOpen}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat con el asistente'}
        aria-expanded={isOpen}
        className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg hover:shadow-blue-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <span className={`transition-all duration-200 ${isOpen ? 'rotate-90 opacity-0 absolute' : 'rotate-0 opacity-100'}`}>
          <ChatIcon />
        </span>
        <span className={`transition-all duration-200 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0 absolute'}`}>
          <CloseIcon />
        </span>
      </button>
    </>
  )
}

// Renderiza saltos de línea del texto del asistente
function MessageContent({ content }: { content: string }) {
  if (!content) return null
  return (
    <>
      {content.split('\n').map((line, i, arr) => (
        <span key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

function TypingDots() {
  return (
    <span className="flex gap-1 items-center h-4 px-1" aria-label="El asistente está escribiendo">
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:300ms]" />
    </span>
  )
}

function BotIcon({ size = 16, className = 'text-white' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" strokeWidth="3" />
      <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-white" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function SpinnerIcon({ size = 16, className = 'text-white' }: { size?: number; className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
