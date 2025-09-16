import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException as NestHttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from '../dto/response.dto/response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;

    if (exception instanceof NestHttpException) {
      status = exception.getStatus();
      message = (exception.getResponse() as any)?.message || exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    response
      .status(status)
      .json(
        new ResponseDto(
          'failure',
          [],
          Array.isArray(message) ? message.join(', ') : message,
          true,
        ),
      );
  }
}
