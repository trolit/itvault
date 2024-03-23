import { toRefs, watch } from "vue";

export const useModalHelpers = <T extends { isVisible: boolean }>(
  props: T,
  options: {
    deep?: boolean;
    immediate?: boolean;
    onShow?: () => void | Promise<void>;
    onHide?: () => void | Promise<void>;
  } = { deep: false, immediate: false }
) => {
  const { isVisible } = toRefs(props);
  const { onShow, onHide, ...watchOptions } = options;

  watch(
    isVisible,
    (value: boolean) => {
      if (!value && onHide) {
        onHide();

        return;
      }

      if (value && onShow) {
        onShow();
      }
    },
    watchOptions
  );

  return {
    isVisible,
  };
};
