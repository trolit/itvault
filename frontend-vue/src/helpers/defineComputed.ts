import { computed, type ComputedRef } from "vue";

type ComputedData<T extends Record<keyof T, () => any>> = {
  [I in keyof T]: ComputedRef<ReturnType<T[I]>>;
};

export const defineComputed = <T extends Record<keyof T, () => any>>(data: {
  [I in keyof T]: T[I];
}) => {
  const result: ComputedData<T> = {} as ComputedData<T>;

  Object.keys(data).map(variable => {
    const key = variable as keyof T;

    result[key] = computed(data[key]);
  });

  return result;
};
