import type { ColorLocation } from "./ColorLocation";

export type LinePart = {
  lineIndex: number;

  text: string;

  location: ColorLocation | null;
};
