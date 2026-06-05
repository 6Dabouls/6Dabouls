'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Check, X } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { formatDate, getUserDisplayName } from '@/lib/utils';

interface KYCDoc {
  id: string;
  type: string;
  fileUrl: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    email: string | null;
    phone: string | null;
    kycLevel: string;
    profile: { firstName: string | null; lastName: string | null } | null;
  };
}

export default function AdminKYCPage() {
  const [documents, setDocuments] = useState<KYCDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<KYCDoc | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/kyc/pending')
      .then((r) => setDocuments(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  async function handleValidate(id: string) {
    setActionLoading(true);
    try {
      await api.put(`/admin/kyc/${id}/validate`);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      setSelected(null);
      toast.success('Document approuvé !');
    } catch {
      toast.error('Erreur');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject(id: string) {
    if (!rejectReason) { toast.error('Raison requise'); return; }
    setActionLoading(true);
    try {
      await api.put(`/admin/kyc/${id}/reject`, { reason: rejectReason });
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      setSelected(null);
      setRejectReason('');
      toast.success('Document refusé');
    } catch {
      toast.error('Erreur');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <PageLoader />;

  const docTypeLabels: Record<string, string> = {
    NATIONAL_ID: 'Carte d\'identité', PASSPORT: 'Passeport',
    DRIVERS_LICENSE: 'Permis', SELFIE: 'Selfie', PROOF_OF_ADDRESS: 'Justificatif',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">{documents.length} document(s) en attente</h2>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-slate-600">Aucun document en attente de validation</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-900 text-sm">
                      {getUserDisplayName(doc.user).charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{getUserDisplayName(doc.user)}</p>
                      <p className="text-xs text-slate-500">{doc.user.email || doc.user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-600">Type : <strong>{docTypeLabels[doc.type] || doc.type}</strong></span>
                    <span className="text-slate-600">KYC : <Badge status={doc.user.kycLevel} /></span>
                    <span className="text-slate-500">{formatDate(doc.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelected(doc)}>
                    Réviser
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Révision KYC</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-1">Utilisateur</p>
              <p className="font-medium">{getUserDisplayName(selected.user)}</p>
              <p className="text-sm text-slate-500">{selected.user.email || selected.user.phone}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">Type : {docTypeLabels[selected.type] || selected.type}</p>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                {selected.fileUrl.endsWith('.pdf') ? (
                  <div className="bg-slate-50 p-4 text-center">
                    <a href={`http://localhost:3001${selected.fileUrl}`} target="_blank" rel="noreferrer" className="text-blue-900 font-medium text-sm">
                      📄 Ouvrir le PDF
                    </a>
                  </div>
                ) : (
                  <img
                    src={`http://localhost:3001${selected.fileUrl}`}
                    alt="Document"
                    className="w-full object-contain max-h-64"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-doc.png'; }}
                  />
                )}
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <Button
                className="flex-1"
                loading={actionLoading}
                onClick={() => handleValidate(selected.id)}
              >
                <Check className="w-4 h-4 mr-1.5" /> Approuver
              </Button>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <textarea
                placeholder="Raison du refus..."
                className="input w-full h-24 resize-none"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <Button
                variant="danger"
                className="w-full mt-2"
                loading={actionLoading}
                onClick={() => handleReject(selected.id)}
              >
                <X className="w-4 h-4 mr-1.5" /> Refuser
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
