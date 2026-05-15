import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { logger } from './logger';

// Load environment variables for email
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Nodemailer Transporter (for Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  deliveryInfo: string;
}

export const sendOrderConfirmation = async (data: OrderEmailData) => {
  const phpFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  });

  const formattedTotal = phpFormatter.format(data.total * 56);
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px 0;">${item.name} x ${item.quantity}</td>
      <td style="padding: 10px 0; text-align: right;">${phpFormatter.format(item.price * 56 * item.quantity)}</td>
    </tr>
  `
    )
    .join('');

  const emailHtml = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; background: #08080a; color: #ffffff; border-radius: 20px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #7c3aed; font-size: 24px; letter-spacing: 2px;">PIXEL FORGE</h1>
        <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 4px;">Luxury Gear Manifest</p>
      </div>
      
      <h2 style="font-size: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">Transmission Confirmed</h2>
      <p style="color: #94a3b8;">Greetings ${data.customerName},</p>
      <p style="color: #94a3b8;">Your acquisition request has been authorized and encrypted. Your gear is now being prepared for deployment.</p>
      
      <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; margin: 30px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="color: #475569; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">
              <th style="text-align: left; padding-bottom: 10px;">Component</th>
              <th style="text-align: right; padding-bottom: 10px;">Valuation</th>
            </tr>
          </thead>
          <tbody style="color: #ffffff; font-size: 14px;">
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding-top: 20px; font-weight: bold;">TOTAL CREDITS</td>
              <td style="padding-top: 20px; text-align: right; font-size: 20px; color: #06b6d4; font-weight: 800;">${formattedTotal}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1e293b;">
        <p style="font-size: 12px; color: #475569;">ORDER ID: <span style="color: #94a3b8;">${data.orderId}</span></p>
        <p style="font-size: 12px; color: #475569;">DELIVERY TO: <span style="color: #94a3b8;">${data.deliveryInfo}</span></p>
      </div>
      
      <div style="text-align: center; margin-top: 50px;">
        <p style="font-size: 10px; color: #475569; letter-spacing: 2px;">SECURE CHANNEL // OMEGA PLAY</p>
      </div>
    </div>
  `;

  try {
    if (resend) {
      await resend.emails.send({
        from: 'Pixel Forge <orders@pixelforge.store>',
        to: data.customerEmail,
        subject: `[CONFIRMED] Acquisition Request #${data.orderId.slice(0, 8)}`,
        html: emailHtml,
      });
      logger.info('Email sent via Resend', { orderId: data.orderId });
    } else if (EMAIL_USER && EMAIL_PASS) {
      await transporter.sendMail({
        from: `"Pixel Forge" <${EMAIL_USER}>`,
        to: data.customerEmail,
        subject: `[CONFIRMED] Acquisition Request #${data.orderId.slice(0, 8)}`,
        html: emailHtml,
      });
      logger.info('Email sent via Nodemailer', { orderId: data.orderId });
    } else {
      logger.warn('No email service configured. Skipping email send.', { orderId: data.orderId });
    }
  } catch (error: any) {
    logger.error('Failed to send order email', { error: error.message, orderId: data.orderId });
  }
};
