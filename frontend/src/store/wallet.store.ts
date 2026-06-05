'use client';

import { create } from 'zustand';
import { Wallet } from '@/types';

interface WalletState {
  wallets: Wallet[];
  selectedCurrency: string;
  isLoading: boolean;
}

interface WalletActions {
  setWallets: (wallets: Wallet[]) => void;
  setSelectedCurrency: (currency: string) => void;
  updateWallet: (currency: string, updates: Partial<Wallet>) => void;
  addWallet: (wallet: Wallet) => void;
  setLoading: (loading: boolean) => void;
}

export const useWalletStore = create<WalletState & WalletActions>((set) => ({
  wallets: [],
  selectedCurrency: 'XOF',
  isLoading: false,

  setWallets: (wallets) => set({ wallets }),
  setSelectedCurrency: (selectedCurrency) => set({ selectedCurrency }),
  updateWallet: (currency, updates) =>
    set((state) => ({
      wallets: state.wallets.map((w) =>
        w.currency === currency ? { ...w, ...updates } : w
      ),
    })),
  addWallet: (wallet) => set((state) => ({ wallets: [...state.wallets, wallet] })),
  setLoading: (isLoading) => set({ isLoading }),
}));
