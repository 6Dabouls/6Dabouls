import { Request, Response } from 'express';
import * as walletService from '../services/wallet.service';
import { AppError } from '../middleware/error.middleware';

export async function getWallets(req: Request, res: Response) {
  const wallets = await walletService.getWallets(req.user!.id);
  res.json({ success: true, data: wallets });
}

export async function getWallet(req: Request, res: Response) {
  const wallet = await walletService.getWallet(req.user!.id, req.params.currency);
  res.json({ success: true, data: wallet });
}

export async function createWallet(req: Request, res: Response) {
  const { currency } = req.body;
  if (!currency) throw new AppError('Currency is required', 400);
  const wallet = await walletService.createWallet(req.user!.id, currency);
  res.status(201).json({ success: true, data: wallet });
}

export async function deposit(req: Request, res: Response) {
  const { amount, currency, provider, phone, description } = req.body;
  if (!amount || !currency || !provider || !phone) {
    throw new AppError('amount, currency, provider, and phone are required', 400);
  }
  const transaction = await walletService.deposit(req.user!.id, {
    amount: parseFloat(amount),
    currency,
    provider,
    phone,
    description,
  });
  res.status(201).json({ success: true, data: transaction });
}

export async function withdraw(req: Request, res: Response) {
  const { amount, currency, provider, phone, description } = req.body;
  if (!amount || !currency || !provider || !phone) {
    throw new AppError('amount, currency, provider, and phone are required', 400);
  }
  const transaction = await walletService.withdraw(req.user!.id, {
    amount: parseFloat(amount),
    currency,
    provider,
    phone,
    description,
  });
  res.status(201).json({ success: true, data: transaction });
}

export async function transfer(req: Request, res: Response) {
  const { amount, currency, recipientIdentifier, description } = req.body;
  if (!amount || !currency || !recipientIdentifier) {
    throw new AppError('amount, currency, and recipientIdentifier are required', 400);
  }
  const result = await walletService.transfer(req.user!.id, {
    amount: parseFloat(amount),
    currency,
    recipientIdentifier,
    description,
  });
  res.status(201).json({ success: true, data: result });
}

export async function getTransactionHistory(req: Request, res: Response) {
  const { type, status, currency, startDate, endDate, page, limit } = req.query;
  const result = await walletService.getTransactionHistory(req.user!.id, {
    type: type as string,
    status: status as string,
    currency: currency as string,
    startDate: startDate as string,
    endDate: endDate as string,
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
  });
  res.json({ success: true, ...result });
}
