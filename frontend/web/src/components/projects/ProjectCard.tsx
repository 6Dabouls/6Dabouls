import { Link } from 'react-router-dom'
import { MapPin, TrendingUp, Clock, Users } from 'lucide-react'
import { Project } from '../../types'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'

function fmt(n: number, currency = 'XOF') {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projects/${project.id}`} className="card hover:shadow-md transition-shadow group block">
      <div className="relative mb-4">
        {project.images?.[0] ? (
          <img src={project.images[0]} alt={project.name}
            className="w-full h-44 object-cover rounded-lg" />
        ) : (
          <div className="w-full h-44 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
            <span className="text-4xl">
              {project.energyType === 'solar' ? '☀️' : project.energyType === 'wind' ? '💨' :
               project.energyType === 'hydro' ? '💧' : '🌿'}
            </span>
          </div>
        )}
        {project.isFeatured && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
            À la une
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2">
            {project.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge type="energy" value={project.energyType} />
          <Badge type="risk" value={project.riskLevel} />
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin size={14} /> {project.city}, {project.country}
        </div>

        <ProgressBar value={project.fundingProgress} label="Financement" />

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div>
            <div className="flex items-center justify-center gap-1 text-primary-600">
              <TrendingUp size={13} />
              <span className="font-semibold text-sm">{project.expectedReturn}%</span>
            </div>
            <div className="text-xs text-gray-400">Rendement</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-gray-700">
              <Clock size={13} />
              <span className="font-semibold text-sm">{project.durationMonths}m</span>
            </div>
            <div className="text-xs text-gray-400">Durée</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-gray-700">
              <Users size={13} />
              <span className="font-semibold text-sm">{project.investorCount}</span>
            </div>
            <div className="text-xs text-gray-400">Investisseurs</div>
          </div>
        </div>

        <div className="pt-1 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Objectif</span>
            <span className="font-semibold">{fmt(project.targetAmount, project.currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Min. investissement</span>
            <span className="font-medium text-primary-600">{fmt(project.minimumInvestment, project.currency)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
