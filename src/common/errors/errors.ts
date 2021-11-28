import { CustomError } from './custom-error';
import { ErrorName } from './error-name';

export class CategoryDoesNotExistError extends CustomError {
  constructor() {
    super(ErrorName.CategoryDoesNotExistError);
  }
}

export class CategoryCanNotDoMagicError extends CustomError {
  constructor() {
    super(ErrorName.CategoryCanNotDoMagicError);
  }
}
