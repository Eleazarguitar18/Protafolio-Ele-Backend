import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let detail: any = null; // Cambiado a 'any' para evitar el error de 'null'

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof QueryFailedError) {
      httpStatus = HttpStatus.CONFLICT;
      message = 'Error en consulta de Base de Datos';
      detail = (exception as any).detail || (exception as any).message;
    } else if (exception instanceof Error) {
      // Aquí atrapamos errores de variables, métodos o lógica del grafo
      message = exception.name;
      detail = exception.message;
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: message,
      error_detail: detail,
      // Solo mostramos el stack en desarrollo
      stack: process.env.NODE_ENV !== 'production' ? (exception as any).stack : undefined,
    };

    // Imprimimos el error real en tu terminal de Debian
    console.error('--- DETALLE DEL ERROR ---');
    console.error(exception); 
    console.error('-------------------------');

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}