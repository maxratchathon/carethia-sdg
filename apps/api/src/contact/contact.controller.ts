import { Body, Controller, HttpCode, HttpStatus, Post, InternalServerErrorException } from '@nestjs/common'
import { ContactService } from './contact.service'
import { ContactDto } from './contact.dto'

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async sendContact(@Body() body: ContactDto) {
        try {
            await this.contactService.sendContactEmail(body)
            return { success: true, message: 'Your message has been sent. We will get back to you shortly.' }
        } catch (err) {
            throw new InternalServerErrorException('Failed to send email. Please try again later.')
        }
    }
}
