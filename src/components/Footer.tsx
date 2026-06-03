import Link from 'next/link';
import { Mail, Linkedin, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">SD</span>
              </div>
              <span className="text-white text-lg font-bold">Serge Daboule</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Freelance multidisciplinaire. Je transforme vos idées en projets concrets — développement, coaching, photo.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: Mail, href: 'mailto:sergedaboulejunior@gmail.com', label: 'Email' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Github, href: 'https://github.com/6Dabouls', label: 'GitHub' },
                { icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-colors" aria-label={label}>
                  <Icon size={16} className="text-slate-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {['Développement Web', 'Coaching', 'Photographie', 'Stratégie Digitale'].map((s) => (
                <li key={s}>
                  <Link href="#services" className="text-slate-400 hover:text-white transition-colors text-sm">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liens</h4>
            <ul className="space-y-2">
              {[['#portfolio', 'Portfolio'], ['#tarifs', 'Tarifs'], ['#about', 'À propos'], ['/booking', 'Réserver']].map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="text-slate-400 hover:text-white transition-colors text-sm">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Serge Daboule. Tous droits réservés.
          </p>
          <p className="text-slate-600 text-xs">
            Disponible pour de nouveaux projets · <a href="mailto:sergedaboulejunior@gmail.com" className="hover:text-slate-400 transition-colors">sergedaboulejunior@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
