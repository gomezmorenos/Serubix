'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTtsGenerate } from '@/hooks/useTtsGenerate'

const VOICES = [
  { value: 'alloy', label: 'Alloy (neutro)' },
  { value: 'echo', label: 'Echo (masculino)' },
  { value: 'fable', label: 'Fable (narrativo)' },
  { value: 'nova', label: 'Nova (femenino)' },
  { value: 'onyx', label: 'Onyx (profundo)' },
  { value: 'shimmer', label: 'Shimmer (suave)' },
]

export function TtsWidget() {
  const { status, error, generate, isReady } = useTtsGenerate()
  const [text, setText] = useState('')
  const [voice, setVoice] = useState('alloy')

  async function handleGenerate() {
    if (!text.trim()) return
    const success = await generate(text.trim(), voice)
    if (success) setText('')
  }

  const isDisabled = !text.trim() || status === 'generating' || !isReady

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="tts-text" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Texto a convertir{' '}
          <span className="ml-2 text-zinc-500 font-normal">({text.length}/4096)</span>
        </label>
        <textarea
          id="tts-text"
          rows={4}
          maxLength={4096}
          value={text}
          onChange={(e) => { setText(e.target.value); }}
          placeholder="Escribe o pega aquí el texto que quieres convertir a voz..."
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <label htmlFor="tts-voice" className="sr-only">Voz</label>
          <select
            id="tts-voice"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {VOICES.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isDisabled}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          {status === 'generating' ? (
            <>
              <Spinner />
              Generando...
            </>
          ) : (
            <>
              <MicIcon />
              Generar audio
            </>
          )}
        </button>

        {status === 'queued' && (
          <p className="text-sm text-emerald-400 flex items-center gap-1.5">
            <CheckIcon />
            En cola —{' '}
            <Link href="/contenido" className="underline hover:text-emerald-300">
              ver progreso
            </Link>
          </p>
        )}

        {status === 'error' && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
