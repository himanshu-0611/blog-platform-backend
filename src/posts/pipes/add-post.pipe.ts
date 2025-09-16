import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddPostDto } from '../dto/add-post.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AddPostPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    const dto = plainToInstance(AddPostDto, value, {
      enableImplicitConversion: true,
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      const messages = errors
        .map((e) =>
          e.constraints
            ? Object.values(e.constraints).join(', ')
            : 'Validation error',
        )
        .join('; ');
      throw new BadRequestException('Validation failed: ' + messages);
    }

    return dto;
  }
}
