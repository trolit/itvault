import type { GenericObject } from "vee-validate";

type PrintStatus = (message: string) => void;

export type FormCallHandler = <T extends GenericObject>(
  formData: T,
  printSuccess: PrintStatus
) => void | Promise<void>;

export type CallHandler = (printSuccess: PrintStatus) => void | Promise<void>;

export type ErrorHandler = (
  error: unknown,
  printError: PrintStatus
) => void | Promise<void>;
