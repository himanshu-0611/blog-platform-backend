import { Module } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-exception';

@Module({
  providers: [AllExceptionsFilter],
})
export class CommonModule {}
