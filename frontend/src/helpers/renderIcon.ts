import { NIcon } from "naive-ui";
import { h, type Component } from "vue";

export default (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};
