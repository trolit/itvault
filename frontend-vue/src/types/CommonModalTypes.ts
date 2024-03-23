export type Props = {
  isVisible: boolean;
};

export type Emits = {
  (event: "update:is-visible", state: boolean): void;
};
