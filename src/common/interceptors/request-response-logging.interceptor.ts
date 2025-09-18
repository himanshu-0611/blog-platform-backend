import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';
import { map, catchError } from 'rxjs/operators';

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
    const reqBody = request.body ? JSON.stringify(request.body) : '';

    return next.handle().pipe(
      map((data) => {

        this.prisma.system_logs
          .create({
            data: {
              endpoint,
              request_type: request.method,
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
          //.then(() => console.log(`Log saved for ${endpoint}`))
          .catch((err) => console.error(`Logging failed`, err));

        return data;
      }),
      catchError((err) => {
        let statusCode = '500';
        if (err instanceof HttpException) {
          statusCode = err.getStatus().toString();
        } else if (response.statusCode) {
          statusCode = response.statusCode.toString();
        }

        console.error(`[Interceptor] Error in ${endpoint}:`, err.message);

        this.prisma.system_logs
          .create({
            data: {
              endpoint,
              request_type: request.method,
              request_headers: reqHeaders,
              request_body: reqBody,
              response_headers: JSON.stringify(response.getHeaders()),
              response_body: '',
              status_code: statusCode,
              is_errorenous: true,
              exception: err.message,
              created_by: user?.id,
              updated_by: user?.id,
            },
          })
          //.then(() => console.log(`Error log saved for ${endpoint}`))
          .catch((logErr) => console.error(`Error logging failed`, logErr));

        return throwError(() => err);
      }),
    );
  }
}
