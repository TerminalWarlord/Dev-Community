import { Injectable, Logger } from '@nestjs/common';
import { ZOHO_MAIL, ZOHO_MAIL_PASSWORD } from 'src/common/constants';
import nodemailer from "nodemailer";
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> | undefined;
  constructor() {
    this.transporter = nodemailer.createTransport({
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
    const res = await this.transporter!.sendMail({
      from: ZOHO_MAIL,
      to: userEmail,
      subject: subject,
      text: mailContent
    });
    this.logger.log(res);
  }
}
