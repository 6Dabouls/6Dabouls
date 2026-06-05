import { TicketPriority, TicketStatus, UserRole } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export async function createTicket(
  userId: string,
  data: { subject: string; message: string; priority?: TicketPriority }
) {
  const ticket = await prisma.supportTicket.create({
    data: {
      userId,
      subject: data.subject,
      priority: data.priority || 'MEDIUM',
      messages: {
        create: {
          senderId: userId,
          senderRole: 'USER',
          message: data.message,
        },
      },
    },
    include: { messages: true },
  });

  return ticket;
}

export async function getTickets(userId: string) {
  return prisma.supportTicket.findMany({
    where: { userId },
    include: {
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getTicket(userId: string, ticketId: string) {
  const ticket = await prisma.supportTicket.findFirst({
    where: { id: ticketId, userId },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!ticket) throw new AppError('Ticket not found', 404, 'TICKET_NOT_FOUND');
  return ticket;
}

export async function sendMessage(
  userId: string,
  ticketId: string,
  message: string,
  senderRole: UserRole = 'USER'
) {
  const ticket = await prisma.supportTicket.findFirst({
    where: senderRole === 'USER' ? { id: ticketId, userId } : { id: ticketId },
  });

  if (!ticket) throw new AppError('Ticket not found', 404, 'TICKET_NOT_FOUND');
  if (ticket.status === 'CLOSED') throw new AppError('Ticket is closed', 400, 'TICKET_CLOSED');

  const newMessage = await prisma.ticketMessage.create({
    data: { ticketId, senderId: userId, senderRole, message },
  });

  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status: senderRole !== 'USER' ? 'IN_PROGRESS' : ticket.status },
  });

  return newMessage;
}

export async function getAdminTickets(filters: {
  status?: TicketStatus;
  priority?: TicketPriority;
  page?: number;
  limit?: number;
}) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;

  const [tickets, total] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      include: {
        user: {
          select: {
            id: true, email: true, phone: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        _count: { select: { messages: true } },
      },
      orderBy: [{ priority: 'desc' }, { updatedAt: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.supportTicket.count({ where }),
  ]);

  return { tickets, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw new AppError('Ticket not found', 404, 'TICKET_NOT_FOUND');

  return prisma.supportTicket.update({ where: { id: ticketId }, data: { status } });
}
