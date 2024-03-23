import type { LinePartLocation } from "./LinePartLocation";

export type LinePart = {
  lineIndex: number;

  text: string;

  location: LinePartLocation;

  isColored: boolean;
};
