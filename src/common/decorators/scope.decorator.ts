import { SetMetadata } from '@nestjs/common';

export const Scope = (scope: string | string[]) => SetMetadata('scope', scope);
