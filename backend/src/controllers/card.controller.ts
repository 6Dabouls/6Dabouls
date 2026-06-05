import { Request, Response } from 'express';
import * as cardService from '../services/card.service';
import { AppError } from '../middleware/error.middleware';

export async function getCards(req: Request, res: Response) {
  const cards = await cardService.getCards(req.user!.id);
  res.json({ success: true, data: cards });
}

export async function getCard(req: Request, res: Response) {
  const reveal = req.query.reveal === 'true';
  const card = await cardService.getCard(req.user!.id, req.params.id, reveal);
  res.json({ success: true, data: card });
}

export async function createVirtualCard(req: Request, res: Response) {
  const { cardholderName, currency } = req.body;
  if (!cardholderName) throw new AppError('cardholderName is required', 400);
  const card = await cardService.createVirtualCard(req.user!.id, { cardholderName, currency });
  res.status(201).json({ success: true, data: card });
}

export async function orderPhysicalCard(req: Request, res: Response) {
  const { cardholderName, deliveryAddress } = req.body;
  if (!cardholderName || !deliveryAddress) {
    throw new AppError('cardholderName and deliveryAddress are required', 400);
  }
  const card = await cardService.orderPhysicalCard(req.user!.id, { cardholderName, deliveryAddress });
  res.status(201).json({ success: true, data: card });
}

export async function updateCardStatus(req: Request, res: Response) {
  const { status } = req.body;
  if (!['ACTIVE', 'BLOCKED'].includes(status)) {
    throw new AppError('Status must be ACTIVE or BLOCKED', 400);
  }
  const card = await cardService.updateCardStatus(req.user!.id, req.params.id, status);
  res.json({ success: true, data: card });
}

export async function updateCardLimits(req: Request, res: Response) {
  const { dailyLimit } = req.body;
  if (!dailyLimit) throw new AppError('dailyLimit is required', 400);
  const card = await cardService.updateCardLimits(req.user!.id, req.params.id, parseFloat(dailyLimit));
  res.json({ success: true, data: card });
}

export async function cancelCard(req: Request, res: Response) {
  await cardService.cancelCard(req.user!.id, req.params.id);
  res.json({ success: true, data: { message: 'Card cancelled successfully' } });
}
