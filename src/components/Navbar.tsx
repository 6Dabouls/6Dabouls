'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">SD</span>
            </div>
            <span className="text-lg font-bold text-slate-900">Serge Daboule</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[['#services', 'Services'], ['#comment', 'Comment'], ['#portfolio', 'Portfolio'], ['#tarifs', 'Tarifs'], ['#about', 'À propos']].map(([href, label]) => (
              <Link key={href} href={href} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex">
            <Link href="/booking" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 active:scale-95">
              Réserver un appel
            </Link>
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            {isOpen ? <X size={22} className="text-slate-700" /> : <Menu size={22} className="text-slate-700" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            {[['#services', 'Services'], ['#comment', 'Comment ça marche'], ['#portfolio', 'Portfolio'], ['#tarifs', 'Tarifs'], ['#about', 'À propos']].map(([href, label]) => (
              <Link key={href} href={href} className="text-sm font-medium text-slate-700 py-2 hover:text-indigo-600" onClick={() => setIsOpen(false)}>
                {label}
              </Link>
            ))}
            <Link href="/booking" className="mt-2 px-4 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl text-center" onClick={() => setIsOpen(false)}>
              Réserver un appel gratuit
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
