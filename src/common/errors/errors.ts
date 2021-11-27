import { CustomError } from './custom-error';
import { ErrorName } from './error-name';

export class CategoryDoesNotExistError extends CustomError {
  constructor() {
    super(ErrorName.CategoryDoesNotExistError);
  }
}
