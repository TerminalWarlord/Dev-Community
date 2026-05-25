import { Injectable, Logger } from '@nestjs/common';
import { ZOHO_MAIL, ZOHO_MAIL_PASSWORD } from 'src/common/constants';
import nodemailer from "nodemailer";
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;
  constructor() {
    this.transporter = this.init();
  }
  init() {
    this.logger.log("Mail service")
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
