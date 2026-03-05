import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { Public } from 'src/auth/config/auth_public';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Public()
  @Post()
  async sendMail(@Body() createMailDto: CreateMailDto) {
    return await this.mailService.enviarCorreo(createMailDto);
  }
}
