"use client"
import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus, Video } from "lucide-react"
import { formatDate } from "@/lib/utils"

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

const mockScheduled = [
  { id: "1", title: "Routine matinale", date: new Date(2024, 6, 16), time: "07:00", status: "planned" },
  { id: "2", title: "Tips business #5", date: new Date(2024, 6, 18), time: "18:30", status: "planned" },
  { id: "3", title: "Réaction trending", date: new Date(2024, 6, 20), time: "12:00", status: "planned" },
  { id: "4", title: "Tutorial makeup", date: new Date(2024, 6, 22), time: "19:00", status: "planned" },
]

const bestTimes = ["07:00 - 09:00", "12:00 - 14:00", "18:00 - 20:00", "21:00 - 23:00"]

export default function CalendarPage() {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startPad = firstDay === 0 ? 6 : firstDay - 1

  const scheduledOnDay = (day: number) =>
    mockScheduled.filter((s) => {
      const d = new Date(s.date)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })

  const prev = () => setCurrentDate(new Date(year, month - 1))
  const next = () => setCurrentDate(new Date(year, month + 1))

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-tiktok flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Calendrier éditorial</h1>
          </div>
          <p className="text-gray-400">Planifiez et organisez vos publications TikTok</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-tiktok text-white text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Planifier
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">{MONTHS[month]} {year}</h2>
            <div className="flex gap-2">
              <button onClick={prev} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={next} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startPad }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
              const events = scheduledOnDay(day)
              const isSelected = selectedDay?.getDate() === day && selectedDay?.getMonth() === month

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(new Date(year, month, day))}
                  className={`relative aspect-square flex flex-col items-center justify-start p-1 rounded-lg text-sm transition-all ${
                    isSelected ? "bg-[#FE2C55]/20 border border-[#FE2C55]/40" :
                    isToday ? "bg-white/10 border border-white/20" :
                    "hover:bg-white/5"
                  }`}
                >
                  <span className={`text-xs font-medium ${isToday ? "text-[#FE2C55]" : "text-gray-300"}`}>{day}</span>
                  {events.length > 0 && (
                    <div className="mt-0.5 flex gap-0.5">
                      {events.slice(0, 2).map((_, ei) => (
                        <div key={ei} className="w-1 h-1 rounded-full gradient-tiktok" />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Best times */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FE2C55]" /> Meilleurs horaires
            </h3>
            <div className="space-y-2">
              {bestTimes.map((time, i) => (
                <div key={time} className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${i === 0 ? "bg-[#FE2C55]/10 text-[#FE2C55] border border-[#FE2C55]/20" : "text-gray-400 bg-white/5"}`}>
                  <span className="font-bold">#{i + 1}</span> {time}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-semibold text-white mb-3">À venir</h3>
            <div className="space-y-3">
              {mockScheduled.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-9 h-9 rounded-xl gradient-tiktok flex items-center justify-center flex-shrink-0">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.date.toLocaleDateString("fr-FR")} à {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
