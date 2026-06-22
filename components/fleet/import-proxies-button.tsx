"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

type ImportResult = {
  imported?: number
  error?: string
}

export function ImportProxiesButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()

  async function importFile(file: File) {
    setMessage("")
    const form = new FormData()
    form.append("file", file)

    const res = await fetch("/api/fleet/proxies/import", {
      method: "POST",
      body: form,
    })
    const data = (await res.json().catch(() => ({}))) as ImportResult
    if (!res.ok || data.error) {
      throw new Error(data.error || `Import failed (${res.status})`)
    }

    setMessage(`Imported ${data.imported ?? 0} proxies`)
    startTransition(() => router.refresh())
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv,.txt"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.currentTarget.value = ""
          if (!file) return
          importFile(file).catch((error) => {
            setMessage(error instanceof Error ? error.message : "Import failed")
          })
        }}
      />
      <button
        type="button"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
        className="rounded-md bg-orange-500 px-3 py-2 text-sm font-medium text-black hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Importing..." : "Import proxies"}
      </button>
      {message ? <span className="max-w-48 text-right text-xs text-white/60">{message}</span> : null}
    </div>
  )
}
