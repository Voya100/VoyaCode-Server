import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';

// Validates database entities
// Throws BadRequestException if validation fails
export async function validateEntity(entity: {}) {
  const errors = await validate(entity);
  if (errors.length > 0) {
    throw new BadRequestException(errors);
  }
}
