'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CreditCard, Eye, EyeOff, Lock, Unlock, Plus, Wifi } from 'lucide-react';
import { getCards, createVirtualCard, updateCardStatus, cancelCard, getCard } from '@/services/card.service';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { formatDate } from '@/lib/utils';
import type { Card } from '@/types';

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [revealedCard, setRevealedCard] = useState<Card | null>(null);
  const [revealLoading, setRevealLoading] = useState(false);

  useEffect(() => {
    getCards().then(setCards).finally(() => setLoading(false));
  }, []);

  async function handleCreateVirtual() {
    if (!cardholderName.trim()) { toast.error('Nom du titulaire requis'); return; }
    setCreateLoading(true);
    try {
      const card = await createVirtualCard({ cardholderName });
      setCards((prev) => [card, ...prev]);
      setShowCreateModal(false);
      setCardholderName('');
      toast.success('Carte virtuelle créée !');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Erreur');
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleToggleBlock(card: Card) {
    const newStatus = card.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      await updateCardStatus(card.id, newStatus);
      setCards((prev) => prev.map((c) => c.id === card.id ? { ...c, status: newStatus } : c));
      toast.success(newStatus === 'BLOCKED' ? 'Carte bloquée' : 'Carte débloquée');
    } catch (err: any) {
      toast.error('Erreur');
    }
  }

  async function handleReveal(card: Card) {
    setRevealLoading(true);
    try {
      const fullCard = await getCard(card.id, true);
      setRevealedCard(fullCard);
    } catch {
      toast.error('Erreur lors de la récupération');
    } finally {
      setRevealLoading(false);
    }
  }

  if (loading) return <PageLoader />;

  const virtualCard = cards.find((c) => c.type === 'VIRTUAL');
  const physicalCard = cards.find((c) => c.type === 'PHYSICAL');

  return (
    <div className="space-y-6">
      {/* Virtual Card */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Carte Virtuelle</h3>
          {!virtualCard && (
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-1" /> Créer
            </Button>
          )}
        </div>

        {virtualCard ? (
          <div>
            {/* Card Visual */}
            <div className="virtual-card max-w-sm">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">N</span>
                  </div>
                  <span className="text-white font-bold">Neero</span>
                </div>
                <Wifi className="w-6 h-6 text-white/60 rotate-90" />
              </div>
              <div className="mb-6">
                <p className="text-white/60 text-xs mb-1">Numéro de carte</p>
                <p className="text-white font-mono text-lg tracking-widest">
                  {revealedCard?.id === virtualCard.id ? revealedCard.cardNumber?.replace(/(.{4})/g, '$1 ').trim() : virtualCard.maskedNumber}
                </p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/60 text-xs">Titulaire</p>
                  <p className="text-white font-medium">{virtualCard.cardholderName}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs">Expire</p>
                  <p className="text-white font-medium">
                    {String(virtualCard.expiryMonth).padStart(2, '0')}/{String(virtualCard.expiryYear).slice(-2)}
                  </p>
                </div>
                {revealedCard?.id === virtualCard.id && (
                  <div className="text-right">
                    <p className="text-white/60 text-xs">CVV</p>
                    <p className="text-white font-medium">{revealedCard.cvv}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Card Actions */}
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                size="sm"
                loading={revealLoading}
                onClick={() => revealedCard?.id === virtualCard.id ? setRevealedCard(null) : handleReveal(virtualCard)}
              >
                {revealedCard?.id === virtualCard.id
                  ? <><EyeOff className="w-4 h-4 mr-1" /> Masquer</>
                  : <><Eye className="w-4 h-4 mr-1" /> Voir détails</>
                }
              </Button>
              <Button
                variant={virtualCard.status === 'ACTIVE' ? 'danger' : 'primary'}
                size="sm"
                onClick={() => handleToggleBlock(virtualCard)}
              >
                {virtualCard.status === 'ACTIVE'
                  ? <><Lock className="w-4 h-4 mr-1" /> Bloquer</>
                  : <><Unlock className="w-4 h-4 mr-1" /> Débloquer</>
                }
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Statut</p>
                <Badge status={virtualCard.status} className="mt-1" />
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Limite journalière</p>
                <p className="text-sm font-semibold mt-1">{parseFloat(virtualCard.dailyLimit).toLocaleString('fr-FR')} {virtualCard.currency}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100 rounded-2xl p-8 text-center max-w-sm">
            <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">Aucune carte virtuelle</p>
            <Button onClick={() => setShowCreateModal(true)}>Créer une carte virtuelle</Button>
          </div>
        )}
      </div>

      {/* Physical Card */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Carte Physique</h3>
        </div>
        {physicalCard ? (
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">{physicalCard.cardholderName}</p>
                <p className="text-sm text-slate-500 mt-0.5">{physicalCard.maskedNumber}</p>
              </div>
              <Badge status={physicalCard.status} />
            </div>
            {physicalCard.trackingNumber && (
              <div className="mt-3 bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Numéro de suivi</p>
                <p className="text-sm font-mono font-medium">{physicalCard.trackingNumber}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6 text-center">
            <p className="text-sm text-slate-500 mb-3">Commandez votre carte physique</p>
            <Button variant="outline" size="sm">Commander (KYC Niveau 2 requis)</Button>
          </div>
        )}
      </div>

      {/* Create Virtual Card Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Créer une carte virtuelle</h3>
            <div className="space-y-4">
              <Input
                label="Nom du titulaire"
                placeholder="JEAN DUPONT"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                hint="Sera affiché sur la carte"
              />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>Annuler</Button>
                <Button className="flex-1" loading={createLoading} onClick={handleCreateVirtual}>Créer</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
