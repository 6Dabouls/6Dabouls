import nodemailer from 'nodemailer';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (process.env.NODE_ENV === 'test') return;

  try {
    await transporter.sendMail({
      from: `"Neero" <${process.env.EMAIL_FROM || 'noreply@neero.com'}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    logger.error(`Failed to send email to ${to}:`, error);
  }
}

export async function sendOTPEmail(to: string, otp: string, type: string): Promise<void> {
  const subject =
    type === 'reset' ? 'Réinitialisation de mot de passe - Neero' : 'Code de vérification - Neero';
  const title = type === 'reset' ? 'Réinitialisation de mot de passe' : 'Code de vérification';
  const message =
    type === 'reset'
      ? 'Utilisez ce code pour réinitialiser votre mot de passe Neero :'
      : 'Votre code de vérification Neero est :';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Neero</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">Votre plateforme financière</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e3a5f; margin: 0 0 20px;">${title}</h2>
          <p style="color: #64748b; margin: 0 0 30px;">${message}</p>
          <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 30px;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1e3a5f;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">Ce code expire dans 10 minutes. Ne le partagez jamais avec quelqu'un.</p>
        </div>
        <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2024 Neero. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(to, subject, html);
}

export async function sendWelcomeEmail(to: string, firstName: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Bienvenue sur Neero !</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e3a5f;">Bonjour ${firstName || 'cher utilisateur'} 👋</h2>
          <p style="color: #64748b;">Votre compte Neero est maintenant créé. Vous pouvez dès à présent :</p>
          <ul style="color: #64748b; line-height: 1.8;">
            <li>Effectuer des dépôts via Mobile Money (MTN, Orange)</li>
            <li>Envoyer de l'argent à vos proches</li>
            <li>Créer votre carte virtuelle pour payer en ligne</li>
            <li>Convertir vos devises au meilleur taux</li>
          </ul>
          <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">
            Accéder à mon compte
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(to, 'Bienvenue sur Neero !', html);
}

export async function sendTransactionNotificationEmail(
  to: string,
  data: { type: string; amount: string; currency: string; reference: string }
): Promise<void> {
  const typeLabels: Record<string, string> = {
    DEPOSIT: 'Dépôt reçu',
    WITHDRAWAL: 'Retrait effectué',
    TRANSFER_IN: 'Transfert reçu',
    TRANSFER_OUT: 'Transfert envoyé',
    PAYMENT: 'Paiement effectué',
  };

  const subject = `${typeLabels[data.type] || 'Transaction'} - ${data.amount} ${data.currency}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px 30px;">
        <h2 style="color: #1e3a5f;">${typeLabels[data.type] || 'Transaction'}</h2>
        <p style="color: #64748b;">Montant : <strong>${data.amount} ${data.currency}</strong></p>
        <p style="color: #64748b;">Référence : <code>${data.reference}</code></p>
        <a href="${process.env.FRONTEND_URL}/transactions" style="color: #2563eb;">Voir mes transactions →</a>
      </div>
    </body>
    </html>
  `;

  await sendEmail(to, subject, html);
}
