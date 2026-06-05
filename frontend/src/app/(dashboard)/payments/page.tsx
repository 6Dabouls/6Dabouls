'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { QrCode, Link, FileText } from 'lucide-react';
import api from '@/services/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { BILL_TYPES } from '@/lib/constants';

type Tab = 'qr' | 'link' | 'bills';

export default function PaymentsPage() {
  const [tab, setTab] = useState<Tab>('qr');
  const [loading, setLoading] = useState(false);
  const [qrResult, setQrResult] = useState<{ qrCode: string } | null>(null);
  const [linkResult, setLinkResult] = useState<{ link: string } | null>(null);

  const [qrForm, setQrForm] = useState({ amount: '', currency: 'XOF', description: '' });
  const [linkForm, setLinkForm] = useState({ amount: '', currency: 'XOF', description: '', expiresInHours: '24' });
  const [billForm, setBillForm] = useState({ billType: 'ELECTRICITY', billerCode: '', accountNumber: '', amount: '', currency: 'XOF' });

  async function handleGenerateQR() {
    if (!qrForm.amount) { toast.error('Montant requis'); return; }
    setLoading(true);
    try {
      const res = await api.post('/payments/qr/generate', { ...qrForm, amount: parseFloat(qrForm.amount) });
      setQrResult(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateLink() {
    if (!linkForm.amount) { toast.error('Montant requis'); return; }
    setLoading(true);
    try {
      const res = await api.post('/payments/link/generate', {
        ...linkForm,
        amount: parseFloat(linkForm.amount),
        expiresInHours: parseInt(linkForm.expiresInHours),
      });
      setLinkResult(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  async function handlePayBill() {
    if (!billForm.amount || !billForm.billerCode || !billForm.accountNumber) {
      toast.error('Remplissez tous les champs');
      return;
    }
    setLoading(true);
    try {
      await api.post('/payments/bills', { ...billForm, amount: parseFloat(billForm.amount) });
      toast.success('Facture payée avec succès !');
      setBillForm({ billType: 'ELECTRICITY', billerCode: '', accountNumber: '', amount: '', currency: 'XOF' });
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: 'qr' as Tab, label: 'QR Code', icon: QrCode },
    { id: 'link' as Tab, label: 'Lien', icon: Link },
    { id: 'bills' as Tab, label: 'Factures', icon: FileText },
  ];

  return (
    <div className="max-w-lg space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${tab === t.id ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* QR Code */}
      {tab === 'qr' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h3 className="font-medium text-slate-900">Générer un QR Code de paiement</h3>
          <Input
            label="Montant (XOF)"
            type="number"
            placeholder="0"
            value={qrForm.amount}
            onChange={(e) => setQrForm((f) => ({ ...f, amount: e.target.value }))}
          />
          <Input
            label="Description (optionnelle)"
            placeholder="Paiement pour..."
            value={qrForm.description}
            onChange={(e) => setQrForm((f) => ({ ...f, description: e.target.value }))}
          />
          <Button className="w-full" loading={loading} onClick={handleGenerateQR}>
            Générer le QR Code
          </Button>
          {qrResult && (
            <div className="text-center mt-4">
              <img src={qrResult.qrCode} alt="QR Code" className="mx-auto w-48 h-48" />
              <p className="text-sm text-slate-500 mt-2">Présentez ce QR code au payeur</p>
            </div>
          )}
        </div>
      )}

      {/* Payment Link */}
      {tab === 'link' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h3 className="font-medium text-slate-900">Créer un lien de paiement</h3>
          <Input
            label="Montant (XOF)"
            type="number"
            placeholder="0"
            value={linkForm.amount}
            onChange={(e) => setLinkForm((f) => ({ ...f, amount: e.target.value }))}
          />
          <Input
            label="Description"
            placeholder="Pour quoi est ce paiement ?"
            value={linkForm.description}
            onChange={(e) => setLinkForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Expire dans</label>
            <select
              className="input"
              value={linkForm.expiresInHours}
              onChange={(e) => setLinkForm((f) => ({ ...f, expiresInHours: e.target.value }))}
            >
              <option value="1">1 heure</option>
              <option value="24">24 heures</option>
              <option value="72">3 jours</option>
              <option value="168">7 jours</option>
            </select>
          </div>
          <Button className="w-full" loading={loading} onClick={handleGenerateLink}>
            Générer le lien
          </Button>
          {linkResult && (
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm font-medium text-green-800 mb-2">Lien créé !</p>
              <div className="flex items-center gap-2">
                <input value={linkResult.link} readOnly className="flex-1 text-xs bg-white border border-green-200 rounded px-2 py-1" />
                <button
                  onClick={() => { navigator.clipboard.writeText(linkResult.link); toast.success('Copié !'); }}
                  className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                >
                  Copier
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bill Payment */}
      {tab === 'bills' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h3 className="font-medium text-slate-900">Paiement de factures</h3>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Type de facture</label>
            <div className="grid grid-cols-3 gap-2">
              {BILL_TYPES.map((bill) => (
                <button
                  key={bill.code}
                  onClick={() => setBillForm((f) => ({ ...f, billType: bill.code }))}
                  className={`p-3 rounded-lg border-2 text-center text-xs font-medium transition-colors
                    ${billForm.billType === bill.code ? 'border-blue-900 bg-blue-50' : 'border-slate-200'}`}
                >
                  <div className="text-xl mb-1">{bill.icon}</div>
                  {bill.name}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Code du prestataire"
            placeholder="Ex: CIE, SODECI, MTN..."
            value={billForm.billerCode}
            onChange={(e) => setBillForm((f) => ({ ...f, billerCode: e.target.value }))}
          />
          <Input
            label="Numéro de compte / Client"
            placeholder="Votre numéro de compte"
            value={billForm.accountNumber}
            onChange={(e) => setBillForm((f) => ({ ...f, accountNumber: e.target.value }))}
          />
          <Input
            label="Montant (XOF)"
            type="number"
            placeholder="0"
            value={billForm.amount}
            onChange={(e) => setBillForm((f) => ({ ...f, amount: e.target.value }))}
          />
          <Button className="w-full" loading={loading} onClick={handlePayBill}>
            Payer la facture
          </Button>
        </div>
      )}
    </div>
  );
}
