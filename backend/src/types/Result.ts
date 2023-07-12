import { IError } from "@interfaces/IError";

export class PaginatedResult<T> {
  result: T[];

  total: number;
}

// @TODO refactor and apply to all Repository actions + Controllers (?)
export class Result<T> {
  public value?: T;

  public errors: IError[];

  public success: boolean;

  constructor(errors: IError[], value?: T) {
    this.value = value;

    this.errors = errors;

    this.success = errors.length === 0;
  }

  public static success<T>(value?: T): Result<T> {
    return new Result<T>([], value);
  }

  public static failure<T>(errors: IError[], value?: T): Result<T> {
    return new Result<T>(errors, value);
  }
}
