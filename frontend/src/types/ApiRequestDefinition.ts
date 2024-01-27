type PrintStatus = (message: string) => void;

export type FormCallHandler<T> = (
  formData: T,
  printSuccess: PrintStatus
) => void | Promise<void>;

export type CallHandler<T> = (
  printSuccess: PrintStatus,
  data: T
) => void | Promise<void>;

export type ErrorHandler = (
  error: unknown,
  printError: PrintStatus
) => void | Promise<void>;
