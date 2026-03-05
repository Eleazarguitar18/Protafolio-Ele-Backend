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
          secure: false,
          auth: {
            user: config.get<string>('EMAIL_USER'),
            pass: config.get<string>('EMAIL_PASSWORD'),
          },
        },
        tls: {
          rejectUnauthorized: false, // Esto ayuda si hay temas de certificados en Debian
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
