import {
  watch,
  type WatchSource,
  type WatchOptions,
  type WatchCallback,
  type WatchStopHandle,
} from "vue";

// @NOTE Immediate does not react on options change
// @NOTE Find out if it's possible to detect handler param types (implicitly)
type WatcherDefinition<T, Immediate extends Readonly<boolean> = false> = {
  source: WatchSource<T>;
  handler: WatchCallback<T, Immediate extends true ? T | undefined : T>;
  options?: WatchOptions<Immediate>;
};

export const defineWatchers = <
  T extends Record<keyof T, WatcherDefinition<any, any>>
>(data: { [I in keyof T]: T[I] }) => {
  const result: Record<keyof T, WatchStopHandle> = {} as Record<
    keyof T,
    WatchStopHandle
  >;

  Object.keys(data).map(variable => {
    const key = variable as keyof T;

    const { source, handler, options } = data[key];

    result[key] = watch(source, handler, options);
  });

  return result;
};
