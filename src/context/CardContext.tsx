import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CarteVisa, Transaction } from '../types';

interface CardContextType {
  carte: CarteVisa;
  transactions: Transaction[];
  soldeVisible: boolean;
  toggleSoldeVisibility: () => void;
  recharger: (montant: number) => Promise<void>;
}

const mockCarte: CarteVisa = {
  id: '1',
  numeroMasque: '**** **** **** 4872',
  numeroComplet: '4532 1234 5678 4872',
  titulaire: 'JEAN DUPONT',
  dateExpiration: '12/27',
  cvv: '394',
  solde: 247.50,
  statut: 'active',
  type: 'VISA_PREPAYEE',
  limiteJournaliere: 500,
};

const mockTransactions: Transaction[] = [
  { id: '1', montant: -45.80, devise: 'EUR', type: 'debit', description: 'Courses alimentaires', marchand: 'Carrefour', date: new Date('2024-02-10'), statut: 'completed', categorie: 'alimentation' },
  { id: '2', montant: 100.00, devise: 'EUR', type: 'credit', description: 'Recharge carte', date: new Date('2024-02-09'), statut: 'completed', categorie: 'recharge' },
  { id: '3', montant: -12.99, devise: 'EUR', type: 'debit', description: 'Abonnement streaming', marchand: 'Netflix', date: new Date('2024-02-08'), statut: 'completed', categorie: 'divertissement' },
  { id: '4', montant: -8.50, devise: 'EUR', type: 'debit', description: 'Transport en commun', marchand: 'RATP', date: new Date('2024-02-07'), statut: 'completed', categorie: 'transport' },
  { id: '5', montant: -67.30, devise: 'EUR', type: 'debit', description: 'Shopping en ligne', marchand: 'Amazon', date: new Date('2024-02-06'), statut: 'completed', categorie: 'shopping' },
  { id: '6', montant: 50.00, devise: 'EUR', type: 'credit', description: 'Recharge carte', date: new Date('2024-02-05'), statut: 'completed', categorie: 'recharge' },
  { id: '7', montant: -23.40, devise: 'EUR', type: 'debit', description: 'Restaurant', marchand: 'Bistrot du Coin', date: new Date('2024-02-04'), statut: 'completed', categorie: 'alimentation' },
  { id: '8', montant: -15.00, devise: 'EUR', type: 'debit', description: 'Pharmacie', marchand: 'Pharmacie Centrale', date: new Date('2024-02-03'), statut: 'completed', categorie: 'sante' },
];

const CardContext = createContext<CardContextType | undefined>(undefined);

export function CardProvider({ children }: { children: ReactNode }) {
  const [carte, setCarte] = useState<CarteVisa>(mockCarte);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [soldeVisible, setSoldeVisible] = useState(true);

  const toggleSoldeVisibility = () => setSoldeVisible(v => !v);

  const recharger = async (montant: number) => {
    await new Promise(r => setTimeout(r, 1000));
    setCarte(c => ({ ...c, solde: c.solde + montant }));
    const tx: Transaction = {
      id: Date.now().toString(),
      montant,
      devise: 'EUR',
      type: 'credit',
      description: 'Recharge carte',
      date: new Date(),
      statut: 'completed',
      categorie: 'recharge',
    };
    setTransactions(txs => [tx, ...txs]);
  };

  return (
    <CardContext.Provider value={{ carte, transactions, soldeVisible, toggleSoldeVisibility, recharger }}>
      {children}
    </CardContext.Provider>
  );
}

export function useCard() {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error('useCard must be used within CardProvider');
  return ctx;
}
