import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('EMAIL_HOST'),
          port: config.get<number>('EMAIL_PORT'),
          secure: config.get<string>('EMAIL_SECURE') === 'true',
          // 2. ESTA ES LA CLAVE: Forzamos la resolución de nombres a solo IPv4
          // En algunas versiones de Node/Nodemailer, 'family' dentro de transport
          // se ignora si el DNS devuelve IPv6 primero.
          connectionOptions: {
            family: 4,
          },

          // 3. Aumentamos la persistencia
          connectionTimeout: 30000,
          greetingTimeout: 30000,
          socketTimeout: 30000,
          logger: true, // Esto nos mostrará el diálogo real en los logs de Render
          debug: true, // Muestra qué está pasando paso a paso
          auth: {
            user: config.get<string>('EMAIL_USER'),
            pass: config.get<string>('EMAIL_PASSWORD'),
          },
        },
        tls: {
          rejectUnauthorized:
            config.get<string>('EMAIL_REJECT_UNAUTHORIZED') === 'true', // Esto ayuda si hay temas de certificados en Debian
        },
        defaults: {
          from: '"Rutea" <vortex.dev26@gmail.com>',
        },
        // --- CONFIGURACIÓN DE PLANTILLAS ---
        template: {
          dir: join(__dirname, 'templates'), // Nest buscará en src/mail/templates
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        options: {
          // 2. Configura explícitamente dónde están los trozos reutilizables
          partials: {
            dir: join(__dirname, 'templates', 'partials'),
            options: {
              strict: true,
            },
          },
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
