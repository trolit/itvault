export class PaginatedResult<T> {
  result: T[];

  total: number;
}

interface IError {
  identifier: number | string;

  message: string;
}

export class Result<T> {
  result: T;

  static errors: IError[] = [];

  static addError(identifier: number | string, message: string) {
    this.errors.push({ identifier, message });
  }
}
