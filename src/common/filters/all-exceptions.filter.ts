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
    let message: any = 'Error interno del servidor';
    let detail: any = null;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();

      // EXPLICACIÓN: Si es un error de validación, getResponse() devuelve un objeto 
      // que contiene la propiedad 'message' con el array de errores.
      if (typeof response === 'object' && response !== null) {
        message = (response as any).message || exception.message;
        detail = (response as any).error || null;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof QueryFailedError) {
      httpStatus = HttpStatus.CONFLICT;
      message = 'Error en consulta de Base de Datos';
      detail = (exception as any).detail || (exception as any).message;
    } else if (exception instanceof Error) {
      message = exception.name;
      detail = exception.message;
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: message, // Aquí ya vendrá el array ["El email no tiene un formato válido"]
      error_detail: detail,
      stack: process.env.NODE_ENV !== 'production' ? (exception as any).stack : undefined,
    };

    console.error('--- DETALLE DEL ERROR ---');
    console.error(exception); 
    console.error('-------------------------');

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}