import { Request, Response } from 'express';
import * as transactionService from '../services/transaction.service';

export async function getTransactions(req: Request, res: Response) {
  const { type, status, currency, startDate, endDate, page, limit } = req.query;
  const result = await transactionService.getTransactions(req.user!.id, {
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

export async function getTransaction(req: Request, res: Response) {
  const transaction = await transactionService.getTransaction(req.user!.id, req.params.id);
  res.json({ success: true, data: transaction });
}
