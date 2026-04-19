import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

export interface ContactPayload {
    name: string
    email: string
    phone: string
    contactType: string
    message: string
}

@Injectable()
export class ContactService {
    private readonly logger = new Logger(ContactService.name)

    constructor(private config: ConfigService) { }

    async sendContactEmail(payload: ContactPayload): Promise<void> {
        const host = this.config.get<string>('SMTP_HOST', 'smtp.gmail.com')
        const port = parseInt(this.config.get<string>('SMTP_PORT', '587'))
        const user = this.config.get<string>('SMTP_USER', '')
        const pass = this.config.get<string>('SMTP_PASS', '')
        const fromName = this.config.get<string>('SMTP_FROM_NAME', 'Carethia')

        const recipientList = this.config
            .get<string>('CONTACT_EMAIL_LIST', user)
            .split(',')
            .map((e) => e.trim())
            .filter(Boolean)

        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        })

        const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden">
        <div style="background:#FF6B9D;padding:24px 32px">
          <h2 style="color:#fff;margin:0">New Contact Request — Carethia</h2>
        </div>
        <div style="padding:32px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#888;width:140px">Name</td><td style="padding:8px 0;font-weight:600">${payload.name}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0"><a href="mailto:${payload.email}">${payload.email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0">${payload.phone}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Contact Type</td><td style="padding:8px 0">${payload.contactType}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="color:#888;font-size:13px;margin:0 0 8px">Message</p>
          <p style="font-size:15px;line-height:1.7;margin:0">${payload.message.replace(/\n/g, '<br/>')}</p>
        </div>
        <div style="background:#f9f9f9;padding:16px 32px;font-size:12px;color:#bbb;text-align:center">
          Sent via Carethia Contact Form • ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' })} (BKK)
        </div>
      </div>`

        await transporter.sendMail({
            from: `"${fromName}" <${user}>`,
            to: recipientList,
            replyTo: payload.email,
            subject: `[Carethia] New ${payload.contactType} inquiry from ${payload.name}`,
            html,
        })

        this.logger.log(`Contact email sent to ${recipientList.join(', ')} from ${payload.email}`)
    }
}
