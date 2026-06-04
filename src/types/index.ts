export interface User {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  dateNaissance?: string;
  adresse?: string;
  kycStatus: 'non_commence' | 'en_cours' | 'verifie' | 'rejete';
  createdAt: Date;
}

export interface CarteVisa {
  id: string;
  numeroMasque: string;
  numeroComplet: string;
  titulaire: string;
  dateExpiration: string;
  cvv: string;
  solde: number;
  statut: 'active' | 'inactive' | 'bloquee';
  type: 'VISA_PREPAYEE';
  limiteJournaliere: number;
}

export interface Transaction {
  id: string;
  montant: number;
  devise: string;
  type: 'debit' | 'credit';
  description: string;
  marchand?: string;
  date: Date;
  statut: 'completed' | 'pending' | 'failed';
  categorie: 'alimentation' | 'transport' | 'divertissement' | 'sante' | 'shopping' | 'autre' | 'recharge';
}
