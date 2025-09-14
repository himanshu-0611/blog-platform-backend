import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredScope =
      this.reflector.get<string>('scope', context.getHandler());

    if (!requiredScope) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // 1. Get user with role_id
    const dbUser = await this.prisma.users.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || !dbUser.role_id) {
      throw new ForbiddenException('User is not eligible to take the action');
    }

    // 2. Get all scopes for that role
    const roleScopes = await this.prisma.roles_scopes.findMany({
      where: { role_id: dbUser.role_id },
      include: { scope: true },
    });

    if (!roleScopes.length) {
      throw new ForbiddenException('User is not eligible to take the action');
    }

    const userScopes = roleScopes.map(
      (rs) => `${rs.scope.module}:${rs.scope.action}:${rs.scope.scope_text}`,
    );

    // 3. Verify required scope
    if (!userScopes.includes(requiredScope)) {
      throw new ForbiddenException('User is not eligible to take the action');
    }

    return true;
  }
}
