import api from './api';
import { KYCDocument } from '@/types';

export async function getKYCStatus(): Promise<{ kycLevel: string; phoneVerified: boolean; documents: KYCDocument[] }> {
  const res = await api.get('/kyc/status');
  return res.data.data;
}

export async function submitLevel2(data: { idDocument: File; selfie: File; documentType?: string }): Promise<void> {
  const formData = new FormData();
  formData.append('idDocument', data.idDocument);
  formData.append('selfie', data.selfie);
  if (data.documentType) formData.append('documentType', data.documentType);
  await api.post('/kyc/level2', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
}

export async function submitLevel3(data: { proofOfAddress: File; address: string }): Promise<void> {
  const formData = new FormData();
  formData.append('proofOfAddress', data.proofOfAddress);
  formData.append('address', data.address);
  await api.post('/kyc/level3', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
}
