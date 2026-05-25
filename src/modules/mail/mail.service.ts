import { Injectable, Logger } from '@nestjs/common';
import nodemailer from "nodemailer";
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;
  constructor(
    private configService: ConfigService
  ) {
    this.transporter = this.init();

  }
  init() {
    this.logger.log("Mail service")
    const ZOHO_MAIL = this.configService.get<string>('ZOHO_MAIL');
    const ZOHO_MAIL_PASSWORD = this.configService.get<string>('ZOHO_MAIL_PASSWORD');
    if (!ZOHO_MAIL_PASSWORD) {
      throw new Error('ZOHO_MAIL_PASSWORD is not set');
    }
    if (!ZOHO_MAIL) {
      throw new Error('ZOHO_MAIL is not set');
    }
    return nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: ZOHO_MAIL,
        pass: ZOHO_MAIL_PASSWORD,
      },
    });
  }
  async sendEmail(userEmail: string, subject: string, mailContent: string) {
    if (!this.transporter) this.transporter = this.init();
    const ZOHO_MAIL = this.configService.get<string>('ZOHO_MAIL');
    if (!ZOHO_MAIL) {
      throw new Error('ZOHO_MAIL is not set');
    }
    const res = await this.transporter.sendMail({
      from: ZOHO_MAIL,
      to: userEmail,
      subject: subject,
      html: mailContent
    });
    if (!res.accepted) {
      this.logger.error(`Failed to send email to ${userEmail}`);
    }
  }
}
