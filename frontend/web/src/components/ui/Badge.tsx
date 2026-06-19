const energyColors: Record<string, string> = {
  solar: 'bg-yellow-100 text-yellow-800',
  wind: 'bg-blue-100 text-blue-800',
  hydro: 'bg-cyan-100 text-cyan-800',
  biomass: 'bg-green-100 text-green-800',
  geothermal: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
}

const riskColors: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  funded: 'bg-blue-100 text-blue-700',
  pending_review: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  in_progress: 'bg-purple-100 text-purple-700',
}

const labels: Record<string, string> = {
  solar: 'Solaire', wind: 'Éolien', hydro: 'Hydraulique', biomass: 'Biomasse',
  geothermal: 'Géothermie', other: 'Autre',
  low: 'Risque faible', medium: 'Risque moyen', high: 'Risque élevé',
  active: 'Actif', funded: 'Financé', pending_review: 'En révision',
  completed: 'Complété', cancelled: 'Annulé', in_progress: 'En cours',
}

interface BadgeProps {
  type: 'energy' | 'risk' | 'status'
  value: string
}

export default function Badge({ type, value }: BadgeProps) {
  const colorMap = type === 'energy' ? energyColors : type === 'risk' ? riskColors : statusColors
  const color = colorMap[value] || 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {labels[value] || value}
    </span>
  )
}
