// src/common/guards/scopes.guard.ts
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
    console.log('🔐 Entering Auth Guard...');

    // Get required scope(s) from decorator
    const requiredScope = this.reflector.get<string | string[]>(
      'scope',
      context.getHandler(),
    );

    if (!requiredScope) return true;

    // Normalize to array
    const requiredScopes = Array.isArray(requiredScope)
      ? requiredScope
      : [requiredScope];

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Fetch user with role_id
    const dbUser = await this.prisma.users.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || !dbUser.role_id) {
      throw new ForbiddenException('User is not eligible to take the action 1');
    }

    // Get all scopes for that role
    const roleScopes = await this.prisma.roles_scopes.findMany({
      where: { role_id: dbUser.role_id },
      include: { scope: true },
    });

    if (!roleScopes.length) {
      throw new ForbiddenException('User is not eligible to take the action 2');
    }

    const userScopes = roleScopes.map(
      (rs) => `${rs.scope.module}:${rs.scope.action}:${rs.scope.scope_text}`,
    );

    // Check if user has at least one of the required scopes
    const hasScope = requiredScopes.some((s) => userScopes.includes(s));

    console.log('🔎 Required Scopes:', requiredScopes);
    console.log('🎯 User Scopes:', userScopes);
    console.log('✅ Match Found:', hasScope);
    if (!hasScope) {
      throw new ForbiddenException('User is not eligible to take the action 3');
    }

    // 🔑 Extra check: if scope ends with ":own", verify ownership
    for (const scope of requiredScopes) {
      if (scope.endsWith(':own') && userScopes.includes(scope)) {
        const postId = request.params.id;
        if (!postId) return true; // no resource id → skip

        const post = await this.prisma.posts.findUnique({
          where: { id: postId },
        });

        if (!post) {
          throw new ForbiddenException(`Post with id ${postId} does not exist`);
        }

        if (post.user_id !== user.id) {
          throw new ForbiddenException(
            'You can only perform this action on your own posts',
          );
        }
      }
    }

    return true;
  }
}
