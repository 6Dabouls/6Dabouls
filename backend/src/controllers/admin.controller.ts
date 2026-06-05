import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import * as kycService from '../services/kyc.service';
import * as transactionService from '../services/transaction.service';
import * as supportService from '../services/support.service';
import { AppError } from '../middleware/error.middleware';

export async function getDashboardStats(_req: Request, res: Response) {
  const stats = await adminService.getDashboardStats();
  res.json({ success: true, data: stats });
}

export async function getUsers(req: Request, res: Response) {
  const { status, kycLevel, role, search, page, limit } = req.query;
  const result = await adminService.getUsers({
    status: status as any,
    kycLevel: kycLevel as any,
    role: role as string,
    search: search as string,
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
  });
  res.json({ success: true, ...result });
}

export async function getUserById(req: Request, res: Response) {
  const user = await adminService.getUserById(req.params.id);
  res.json({ success: true, data: user });
}

export async function updateUserStatus(req: Request, res: Response) {
  const { status } = req.body;
  if (!status) throw new AppError('status is required', 400);
  const user = await adminService.updateUserStatus(req.params.id, status, req.user!.id);
  res.json({ success: true, data: user });
}

export async function getPendingKYC(_req: Request, res: Response) {
  const documents = await kycService.getPendingDocuments();
  res.json({ success: true, data: documents });
}

export async function validateKYC(req: Request, res: Response) {
  const result = await kycService.validateDocument(req.params.id, req.user!.id);
  res.json({ success: true, data: result });
}

export async function rejectKYC(req: Request, res: Response) {
  const { reason } = req.body;
  if (!reason) throw new AppError('Rejection reason is required', 400);
  await kycService.rejectDocument(req.params.id, req.user!.id, reason);
  res.json({ success: true, data: { message: 'Document rejected' } });
}

export async function getAllTransactions(req: Request, res: Response) {
  const { type, status, userId, startDate, endDate, page, limit } = req.query;
  const result = await transactionService.getAdminTransactions({
    type: type as string,
    status: status as string,
    userId: userId as string,
    startDate: startDate as string,
    endDate: endDate as string,
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
  });
  res.json({ success: true, ...result });
}

export async function getDailyReport(req: Request, res: Response) {
  const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
  const report = await adminService.getDailyReport(date);
  res.json({ success: true, data: report });
}

export async function getMonthlyReport(req: Request, res: Response) {
  const year = parseInt((req.query.year as string) || new Date().getFullYear().toString());
  const month = parseInt((req.query.month as string) || (new Date().getMonth() + 1).toString());
  const report = await adminService.getMonthlyReport(year, month);
  res.json({ success: true, data: report });
}

export async function getAdminTickets(req: Request, res: Response) {
  const { status, priority, page, limit } = req.query;
  const result = await supportService.getAdminTickets({
    status: status as any,
    priority: priority as any,
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
  });
  res.json({ success: true, ...result });
}

export async function updateTicketStatus(req: Request, res: Response) {
  const { status } = req.body;
  if (!status) throw new AppError('status is required', 400);
  const ticket = await supportService.updateTicketStatus(req.params.id, status);
  res.json({ success: true, data: ticket });
}

export async function adminSendTicketMessage(req: Request, res: Response) {
  const { message } = req.body;
  if (!message) throw new AppError('message is required', 400);
  const msg = await supportService.sendMessage(req.user!.id, req.params.id, message, req.user!.role as any);
  res.status(201).json({ success: true, data: msg });
}
