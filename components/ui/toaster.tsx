"use client"
import { useEffect, useState } from "react"
import { CheckCircle, XCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
}

let toastListeners: ((toasts: Toast[]) => void)[] = []
let currentToasts: Toast[] = []

export function toast(message: string, type: ToastType = "info") {
  const id = Date.now().toString()
  currentToasts = [...currentToasts, { id, message, type }]
  toastListeners.forEach((fn) => fn(currentToasts))
  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== id)
    toastListeners.forEach((fn) => fn(currentToasts))
  }, 4000)
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (t: Toast[]) => setToasts([...t])
    toastListeners.push(listener)
    return () => { toastListeners = toastListeners.filter((fn) => fn !== listener) }
  }, [])

  const icons = { success: CheckCircle, error: XCircle, info: Info }
  const colors = {
    success: "border-green-500/30 bg-green-500/10 text-green-400",
    error: "border-red-500/30 bg-red-500/10 text-red-400",
    info: "border-[#FE2C55]/30 bg-[#FE2C55]/10 text-[#FE2C55]",
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => {
        const Icon = icons[t.type]
        return (
          <div
            key={t.id}
            className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg max-w-sm", colors[t.type])}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm flex-1">{t.message}</p>
            <button
              onClick={() => {
                currentToasts = currentToasts.filter((ct) => ct.id !== t.id)
                toastListeners.forEach((fn) => fn(currentToasts))
              }}
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
