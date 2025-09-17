import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';
import { map } from 'rxjs/operators';

interface AuthenticatedUser {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}

@Injectable()
export class RequestResponseLoggingInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();
    const user = request.user as AuthenticatedUser;

    const endpoint = request.originalUrl;
    const reqHeaders = JSON.stringify(request.headers);
    const reqBody = JSON.stringify(request.body);

    return next.handle().pipe(
      map((data) => {
        // Log successful response
        this.prisma.system_logs
          .create({
            data: {
              endpoint,
              request_headers: reqHeaders,
              request_body: reqBody,
              response_headers: JSON.stringify(response.getHeaders()),
              response_body: JSON.stringify(data),
              status_code: response.statusCode.toString(),
              is_errorenous: false,
              created_by: user?.id,
              updated_by: user?.id,
            },
          })
          .catch((err) => console.error('Logging failed', err));

        return data;
      }),
      catchError((err) => {
        // Log error response
        this.prisma.system_logs
          .create({
            data: {
              endpoint,
              request_headers: reqHeaders,
              request_body: reqBody,
              response_headers: JSON.stringify(response.getHeaders()),
              response_body: '',
              status_code: response.statusCode.toString(),
              is_errorenous: true,
              exception: err.message,
              created_by: user?.id,
              updated_by: user?.id,
            },
          })
          .catch(console.error);

        throw err;
      }),
    );
  }
}
