import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { CreateMailDto } from './dto/create-mail.dto';
import { Public } from 'src/auth/decorators/auth_public.decorator';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(userEmail: string, name: string) {
    await this.mailerService.sendMail({
      to: userEmail,
      subject: '¡Bienvenido a nuestra App!',
      text: `Hola ${name}, gracias por unirte.`,
      html: `<b>Hola ${name}</b>, gracias por unirte.`, // También puedes usar HTML
    });
  }
  async sendEmailChangePassword(
    email: string,
    name: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Seguridad de Rutea: Cambio de contraseña exitoso',
      template:'password-changed', // Nombre de la plantilla sin extensión
      context: {
        name:name,// Pasamos el nombre para usarlo en la plantilla
        // Puedes agregar más variables aquí si tu plantilla las necesita
        date: new Date().toLocaleDateString(), // Ejemplo de variable adicional
      },
    });
  }
  async sendCode(
    email: string,
    name:string,
    code: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Seguridad de Rutea: Cambio de contraseña - Código de verificación',
      template:'reset-code', // Nombre de la plantilla sin extensión
      context: {
        code: code, // Pasamos el código para usarlo en la plantilla
        name:name,// Pasamos el nombre para usarlo en la plantilla
        // Puedes agregar más variables aquí si tu plantilla las necesita
        date: new Date().toLocaleDateString(), // Ejemplo de variable adicional
      },
    });
  }
  
  async enviarCorreo({email,message,subject,name}:CreateMailDto) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        template:'./generic-message', // Nombre de la plantilla sin extensión
        context: {
          message: message,
          name: name, // Pasamos el nombre para usarlo en la plantilla
          // Puedes agregar más variables aquí si tu plantilla las necesita
        },
      });
      return { message: 'Correo enviado correctamente' };
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw error;
    }
  }
  async sendWelcome(email:string,name:string){
    await this.mailerService.sendMail({
      to: email,
      subject: '¡Bienvenido a Rutea!',
      template: 'welcome',
      context: {
        name: name
      }
    });
  }
}
