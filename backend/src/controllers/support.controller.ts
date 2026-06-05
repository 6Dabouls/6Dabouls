import { Request, Response } from 'express';
import * as supportService from '../services/support.service';
import { AppError } from '../middleware/error.middleware';

export async function createTicket(req: Request, res: Response) {
  const { subject, message, priority } = req.body;
  if (!subject || !message) throw new AppError('subject and message are required', 400);
  const ticket = await supportService.createTicket(req.user!.id, { subject, message, priority });
  res.status(201).json({ success: true, data: ticket });
}

export async function getTickets(req: Request, res: Response) {
  const tickets = await supportService.getTickets(req.user!.id);
  res.json({ success: true, data: tickets });
}

export async function getTicket(req: Request, res: Response) {
  const ticket = await supportService.getTicket(req.user!.id, req.params.id);
  res.json({ success: true, data: ticket });
}

export async function sendMessage(req: Request, res: Response) {
  const { message } = req.body;
  if (!message) throw new AppError('message is required', 400);
  const msg = await supportService.sendMessage(req.user!.id, req.params.id, message);
  res.status(201).json({ success: true, data: msg });
}

export async function updateTicketStatus(req: Request, res: Response) {
  const { status } = req.body;
  if (!status) throw new AppError('status is required', 400);
  const ticket = await supportService.updateTicketStatus(req.params.id, status);
  res.json({ success: true, data: ticket });
}
