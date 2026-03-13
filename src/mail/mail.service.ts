import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { CreateMailDto } from './dto/create-mail.dto';
import { Public } from 'src/auth/decorators/auth_public.decorator';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {
    // Lee la API Key de las variables de entorno de Render
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  // 1. Método para Bienvenida (Unificado)
  async sendWelcomeEmail(userEmail: string, name: string) {
    try {
      await this.resend.emails.send({
        from: 'Rutea <bienvenida@elecode.site>',
        to: userEmail,
        subject: '¡Bienvenido a Rutea!',
        html: this.getWelcomeTemplate(name),
      });
    } catch (error) {
      console.error('Error en sendWelcomeEmail:', error);
    }
  }

  // 2. Método para Cambio de Contraseña
  async sendEmailChangePassword(email: string, name: string) {
    try {
      await this.resend.emails.send({
        from: 'Rutea <seguridad@elecode.site>',
        to: email,
        subject: 'Seguridad de Rutea: Cambio de contraseña exitoso',
        html: this.getPasswordChangedTemplate(name),
      });
    } catch (error) {
      console.error('Error en sendEmailChangePassword:', error);
    }
  }

  // Alias para mantener compatibilidad con tu código anterior
  async sendWelcome(email: string, name: string) {
    await this.sendWelcomeEmail(email, name);
  }

  // --- PLANTILLAS INTERNAS (Templates) ---

  private getWelcomeTemplate(name: string) {
    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <h2 style="color: #007bff;">¡Hola, ${name}! 👋</h2>
        <p style="font-size: 16px; color: #555;">
          Gracias por unirte a <strong>Rutea</strong>. Estamos muy felices de tenerte con nosotros para optimizar tus rutas y logística.
        </p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <p style="margin: 0; color: #333;">Ya puedes empezar a explorar todas las herramientas que tenemos para ti.</p>
        </div>
        <p style="font-size: 14px; color: #888;">Si tienes alguna duda, responde a este correo.</p>
      </div>
    `;
  }

  private getPasswordChangedTemplate(name: string) {
    const date = new Date().toLocaleDateString();
    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <div style="text-align: center; color: #28a745;">
          <h3>✅ Cambio de contraseña exitoso</h3>
        </div>
        <p>Hola <strong>${name}</strong>,</p>
        <p>Te informamos que la contraseña de tu cuenta en <strong>Rutea</strong> ha sido actualizada correctamente.</p>
        <div style="background-color: #fff3cd; padding: 10px; border-left: 5px solid #ffc107; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>Fecha del cambio:</strong> ${date}</p>
        </div>
        <p style="font-size: 14px; color: #555;">Si tú no realizaste este cambio, por favor contacta a soporte de inmediato.</p>
      </div>
    `;
  }
  async sendCode(email: string, name: string, code: string) {
    await this.resend.emails.send({
      from: 'Rutea <seguridad@elecode.site>', // Ahora puedes usar tu dominio!
      to: email,
      subject: 'Código de verificación - Rutea',
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Hola ${name},</h2>
          <p>Tu código de seguridad para Rutea es:</p>
          <h1 style="color: #007bff; letter-spacing: 5px;">${code}</h1>
          <p>Este código expira pronto.</p>
        </div>
      `,
    });
  }

  private getGenericTemplate(name: string, message: string) {
    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 40px 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <div style="background-color: #007bff; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Rutea</h1>
        </div>

        <div style="padding: 30px; line-height: 1.6; color: #444;">
          <h2 style="color: #333;">Hola, ${name}</h2>
          <p style="font-size: 16px;">${message}</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #888;">
            <p>Este es un mensaje automático enviado desde <strong>elecode.site</strong>.</p>
          </div>
        </div>
        
        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #aaa;">
          &copy; ${new Date().getFullYear()} Rutea Logistics - Bolivia
        </div>
      </div>
    </div>
  `;
  }
  async enviarCorreo({ email, message, subject, name }: CreateMailDto) {
    try {
      // Generamos el HTML usando nuestra función de template
      const htmlContent = this.getGenericTemplate(name, message);

      const data = await this.resend.emails.send({
        from: 'Rutea <test@elecode.site>', // Tu dominio en Namecheap
        to: email,
        subject: subject,
        html: htmlContent,
      });

      return {
        message: 'Correo enviado correctamente',
        id: data.data?.id,
      };
    } catch (error) {
      // Resend devuelve errores más claros que SMTP
      console.error('Error enviando correo con Resend:', error);
      throw new InternalServerErrorException('No se pudo enviar el mensaje');
    }
  }
}
