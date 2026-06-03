import Link from 'next/link';
import { ArrowRight, Award, Users, Coffee } from 'lucide-react';

const stats = [
  { icon: Award, value: '5 ans', label: "d'expérience" },
  { icon: Users, value: '50+', label: 'clients accompagnés' },
  { icon: Coffee, value: '100%', label: 'passionné' },
];

const skills = ['Développement Web', 'React & Next.js', 'Coaching', 'Photographie', 'Stratégie Digitale', 'UX/UI Design'];

export default function About() {
  return (
    <section id="about" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl transform rotate-3" />
              <div className="relative bg-slate-200 rounded-3xl overflow-hidden w-full h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-black text-indigo-600">SD</span>
                  </div>
                  <p className="text-slate-400 text-sm">Photo à venir</p>
                </div>
              </div>
            </div>
            {/* Floating stats */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Projet livré</p>
                  <p className="text-sm font-bold text-slate-900">Dans les délais</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content side */}
          <div>
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Qui suis-je</span>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900 leading-tight">
              Bonjour, je suis{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Serge Daboule
              </span>
            </h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              Freelance multidisciplinaire basé en France. Depuis 5 ans, j&apos;aide des entrepreneurs,
              des TPE et des créatifs à concrétiser leurs projets — qu&apos;il s&apos;agisse d&apos;un site web,
              d&apos;une stratégie digitale ou d&apos;un accompagnement personnel.
            </p>
            <p className="mt-3 text-slate-500 leading-relaxed">
              Mon approche ? Aller à l&apos;essentiel. Pas de jargon, pas de superflu.
              Je vous donne les outils et les résultats dont vous avez réellement besoin.
            </p>

            {/* Skills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100">
                  {skill}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <Icon size={20} className="text-indigo-500 mx-auto mb-2" />
                  <div className="text-2xl font-black text-slate-900">{value}</div>
                  <div className="text-xs text-slate-500 mt-1">{label}</div>
                </div>
              ))}
            </div>

            <Link href="/booking" className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all">
              Travaillons ensemble <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
