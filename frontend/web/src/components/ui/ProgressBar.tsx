interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercent?: boolean
  color?: string
}

export default function ProgressBar({ value, max = 100, label, showPercent = true, color = 'bg-primary-500' }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div>
      {(label || showPercent) && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          {label && <span>{label}</span>}
          {showPercent && <span>{pct.toFixed(1)}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
