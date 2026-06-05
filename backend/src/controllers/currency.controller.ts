import { Request, Response } from 'express';
import * as currencyService from '../services/currency.service';
import { AppError } from '../middleware/error.middleware';

export async function getExchangeRates(req: Request, res: Response) {
  const base = (req.query.base as string) || 'XOF';
  const rates = await currencyService.getExchangeRates(base);
  res.json({ success: true, data: rates });
}

export async function getRate(req: Request, res: Response) {
  const { from, to } = req.params;
  const rate = await currencyService.getRate(from, to);
  res.json({ success: true, data: { from: from.toUpperCase(), to: to.toUpperCase(), rate } });
}

export async function convertCurrency(req: Request, res: Response) {
  const { amount, from, to } = req.body;
  if (!amount || !from || !to) throw new AppError('amount, from, and to are required', 400);
  const result = await currencyService.convertCurrency(req.user!.id, {
    amount: parseFloat(amount),
    from,
    to,
  });
  res.json({ success: true, data: result });
}

export async function getSupportedCurrencies(_req: Request, res: Response) {
  res.json({ success: true, data: currencyService.SUPPORTED_CURRENCIES });
}
