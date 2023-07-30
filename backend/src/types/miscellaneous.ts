import { CronCommand } from "cron";

declare module "miscellaneous-types" {
  // @NOTE https://stackoverflow.com/questions/39622778/what-is-new-in-typescript
  export type Type<T> = new (...args: unknown[]) => T;

  export type BucketContent = Record<number, string[]>;

  type NestedKey<ObjectType extends object> = {
    [Key in keyof ObjectType &
      (string | number)]: ObjectType[Key] extends object
      ? `${Key}` | `${Key}.${NestedKey<ObjectType[Key]>}`
      : `${Key}`;
  }[keyof ObjectType & (string | number)];

  export type ControllerImplementation = {
    version: string;

    details?: {
      url?: string;

      incompatibileWith?: number[];
    };

    handle: (
      request: CustomRequest<any, any, any>,
      response: CustomResponse<any>
    ) => Promise<CustomResponse<any>>;
  };

  export type PaginatedResponse<T> = {
    result: T[];

    total: number;
  };

  export type JobConfig = {
    time: string;
    runners: { onTick: CronCommand; onComplete?: CronCommand };
    options?: {
      timeZone?: string;
      runOnInit?: boolean;
    };
  };

  // *******************************************************************

  export type WorkspaceId = {
    workspaceId: number;
  };
}
