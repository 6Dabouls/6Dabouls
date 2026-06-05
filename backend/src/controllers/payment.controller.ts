import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';
import { AppError } from '../middleware/error.middleware';

export async function generateQRCode(req: Request, res: Response) {
  const { amount, currency, description } = req.body;
  if (!amount || !currency) throw new AppError('amount and currency are required', 400);
  const result = await paymentService.generateQRCode(req.user!.id, {
    amount: parseFloat(amount),
    currency,
    description,
  });
  res.json({ success: true, data: result });
}

export async function processQRPayment(req: Request, res: Response) {
  const { qrData } = req.body;
  if (!qrData) throw new AppError('qrData is required', 400);
  const result = await paymentService.processQRPayment(req.user!.id, qrData);
  res.json({ success: true, data: result });
}

export async function generatePaymentLink(req: Request, res: Response) {
  const { amount, currency, description, expiresInHours } = req.body;
  if (!amount || !currency) throw new AppError('amount and currency are required', 400);
  const result = await paymentService.generatePaymentLink(req.user!.id, {
    amount: parseFloat(amount),
    currency,
    description,
    expiresInHours,
  });
  res.json({ success: true, data: result });
}

export async function processPaymentLink(req: Request, res: Response) {
  const result = await paymentService.processPaymentLink(req.user!.id, req.params.linkId);
  res.json({ success: true, data: result });
}

export async function payBill(req: Request, res: Response) {
  const { billType, billerCode, amount, currency, accountNumber, description } = req.body;
  if (!billType || !billerCode || !amount || !currency || !accountNumber) {
    throw new AppError('billType, billerCode, amount, currency, and accountNumber are required', 400);
  }
  const result = await paymentService.payBill(req.user!.id, {
    billType,
    billerCode,
    amount: parseFloat(amount),
    currency,
    accountNumber,
    description,
  });
  res.json({ success: true, data: result });
}
