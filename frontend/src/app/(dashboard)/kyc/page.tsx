'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Shield, Upload, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';
import { getKYCStatus, submitLevel2, submitLevel3 } from '@/services/kyc.service';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { formatDate } from '@/lib/utils';
import { KYC_LEVELS } from '@/lib/constants';
import type { KYCDocument } from '@/types';

export default function KYCPage() {
  const [status, setStatus] = useState<{ kycLevel: string; phoneVerified: boolean; documents: KYCDocument[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [activeForm, setActiveForm] = useState<2 | 3 | null>(null);

  const [level2Form, setLevel2Form] = useState<{
    idDocument: File | null; selfie: File | null; documentType: string;
  }>({ idDocument: null, selfie: null, documentType: 'NATIONAL_ID' });

  const [level3Form, setLevel3Form] = useState<{ proofOfAddress: File | null; address: string }>({
    proofOfAddress: null, address: '',
  });

  useEffect(() => {
    getKYCStatus().then(setStatus).finally(() => setLoading(false));
  }, []);

  async function handleSubmitLevel2() {
    if (!level2Form.idDocument || !level2Form.selfie) {
      toast.error('Document d\'identité et selfie requis');
      return;
    }
    setSubmitLoading(true);
    try {
      await submitLevel2({
        idDocument: level2Form.idDocument,
        selfie: level2Form.selfie,
        documentType: level2Form.documentType,
      });
      toast.success('Documents soumis ! En cours de vérification.');
      const updated = await getKYCStatus();
      setStatus(updated);
      setActiveForm(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Erreur');
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleSubmitLevel3() {
    if (!level3Form.proofOfAddress || !level3Form.address) {
      toast.error('Justificatif de domicile et adresse requis');
      return;
    }
    setSubmitLoading(true);
    try {
      await submitLevel3({ proofOfAddress: level3Form.proofOfAddress, address: level3Form.address });
      toast.success('Documents soumis !');
      const updated = await getKYCStatus();
      setStatus(updated);
      setActiveForm(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Erreur');
    } finally {
      setSubmitLoading(false);
    }
  }

  if (loading) return <PageLoader />;

  const kycLevelNum = { NONE: 0, LEVEL_1: 1, LEVEL_2: 2, LEVEL_3: 3 }[status?.kycLevel || 'NONE'] || 0;

  const getDocByType = (type: string) =>
    status?.documents.filter((d) => d.type === type).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

  const idDoc = getDocByType('NATIONAL_ID') || getDocByType('PASSPORT') || getDocByType('DRIVERS_LICENSE');
  const selfieDoc = getDocByType('SELFIE');
  const addressDoc = getDocByType('PROOF_OF_ADDRESS');
  const hasPendingLevel2 = idDoc?.status === 'PENDING' || selfieDoc?.status === 'PENDING';
  const hasPendingLevel3 = addressDoc?.status === 'PENDING';

  return (
    <div className="max-w-2xl space-y-6">
      {/* Current Level */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-sm mb-1">Niveau de vérification actuel</p>
            <p className="text-2xl font-bold">{KYC_LEVELS[kycLevelNum]?.label || 'Non vérifié'}</p>
            <p className="text-blue-200 text-sm mt-1">{KYC_LEVELS[kycLevelNum]?.limit}</p>
          </div>
          <Shield className="w-10 h-10 text-blue-300" />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {/* Level 1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${kycLevelNum >= 1 ? 'bg-green-100' : 'bg-slate-100'}`}>
                {kycLevelNum >= 1 ? <CheckCircle className="w-5 h-5 text-green-600" /> : <span className="text-sm font-bold text-slate-500">1</span>}
              </div>
              <div>
                <p className="font-medium text-slate-900">Niveau 1 – Téléphone</p>
                <p className="text-sm text-slate-500">Vérification du numéro de téléphone</p>
              </div>
            </div>
            <Badge status={kycLevelNum >= 1 ? 'APPROVED' : 'PENDING'} />
          </div>
        </div>

        {/* Level 2 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${kycLevelNum >= 2 ? 'bg-green-100' : hasPendingLevel2 ? 'bg-yellow-100' : 'bg-slate-100'}`}>
                {kycLevelNum >= 2 ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                  hasPendingLevel2 ? <Clock className="w-5 h-5 text-yellow-600" /> :
                    <span className="text-sm font-bold text-slate-500">2</span>}
              </div>
              <div>
                <p className="font-medium text-slate-900">Niveau 2 – Identité</p>
                <p className="text-sm text-slate-500">Pièce d&apos;identité + Selfie</p>
              </div>
            </div>
            {kycLevelNum >= 2 ? <Badge status="APPROVED" /> :
              hasPendingLevel2 ? <Badge status="PENDING" /> :
                <Badge status="NONE" />}
          </div>

          {idDoc?.status === 'REJECTED' && (
            <div className="bg-red-50 rounded-lg p-3 mb-3 text-sm text-red-700">
              Refusé : {idDoc.rejectionReason}
            </div>
          )}

          {kycLevelNum < 2 && !hasPendingLevel2 && (
            <>
              {activeForm === 2 ? (
                <div className="space-y-3 border-t border-slate-100 pt-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Type de document</label>
                    <select className="input" value={level2Form.documentType} onChange={(e) => setLevel2Form((f) => ({ ...f, documentType: e.target.value }))}>
                      <option value="NATIONAL_ID">Carte d&apos;identité nationale</option>
                      <option value="PASSPORT">Passeport</option>
                      <option value="DRIVERS_LICENSE">Permis de conduire</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Photo du document</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700"
                      onChange={(e) => setLevel2Form((f) => ({ ...f, idDocument: e.target.files?.[0] || null }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Selfie</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700"
                      onChange={(e) => setLevel2Form((f) => ({ ...f, selfie: e.target.files?.[0] || null }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setActiveForm(null)}>Annuler</Button>
                    <Button size="sm" loading={submitLoading} onClick={handleSubmitLevel2}>Soumettre</Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setActiveForm(2)}>
                  <Upload className="w-4 h-4 mr-1.5" /> Soumettre les documents
                </Button>
              )}
            </>
          )}
        </div>

        {/* Level 3 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${kycLevelNum >= 3 ? 'bg-green-100' : hasPendingLevel3 ? 'bg-yellow-100' : 'bg-slate-100'}`}>
                {kycLevelNum >= 3 ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                  hasPendingLevel3 ? <Clock className="w-5 h-5 text-yellow-600" /> :
                    <span className="text-sm font-bold text-slate-500">3</span>}
              </div>
              <div>
                <p className="font-medium text-slate-900">Niveau 3 – Adresse</p>
                <p className="text-sm text-slate-500">Justificatif de domicile</p>
              </div>
            </div>
            {kycLevelNum >= 3 ? <Badge status="APPROVED" /> :
              hasPendingLevel3 ? <Badge status="PENDING" /> :
                <Badge status="NONE" />}
          </div>

          {kycLevelNum === 2 && !hasPendingLevel3 && (
            <>
              {activeForm === 3 ? (
                <div className="space-y-3 border-t border-slate-100 pt-3">
                  <Input
                    label="Adresse complète"
                    placeholder="Rue, Quartier, Ville, Pays"
                    value={level3Form.address}
                    onChange={(e) => setLevel3Form((f) => ({ ...f, address: e.target.value }))}
                  />
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Justificatif de domicile</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700"
                      onChange={(e) => setLevel3Form((f) => ({ ...f, proofOfAddress: e.target.files?.[0] || null }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setActiveForm(null)}>Annuler</Button>
                    <Button size="sm" loading={submitLoading} onClick={handleSubmitLevel3}>Soumettre</Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setActiveForm(3)}>
                  <Upload className="w-4 h-4 mr-1.5" /> Soumettre
                </Button>
              )}
            </>
          )}
          {kycLevelNum < 2 && (
            <p className="text-xs text-slate-500">Nécessite le Niveau 2</p>
          )}
        </div>
      </div>
    </div>
  );
}
