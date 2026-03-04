import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PersonaModule } from './persona/persona.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from './auth/config/constants';
import { LineasModule } from './lineas/lineas.module';
import { RutasModule } from './rutas/rutas.module';
import { PuntosModule } from './puntos/puntos.module';
@Module({
  imports: [
    AuthModule,
    PersonaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        // ssl: true,
        ssl: false,
        //ssl: {
        //  rejectUnauthorized: false, // necesario para Neon, Render, etc.
        //},
        autoLoadEntities: true,
        synchronize: true, // solo desarrollo
      }),
    }),
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     secret: config.get<string>('JWT_SECRET'),
    //     signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
    //   }),
    // }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      // secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    UsuarioModule,
    LineasModule,
    RutasModule,
    PuntosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
