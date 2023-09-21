import type { LinePart } from "@/types/LinePart";
import type { ColorLocation } from "@/types/ColorLocation";

export default (
  lineIndex: number,
  line: string,
  iterations: number,
  colorLocations: ColorLocation[]
) => {
  const lineLength = line.length;

  let colorIndex = 0;
  let carriageIndex = 0;
  const lineParts: LinePart[] = [];

  const saveLine = (
    from: number,
    to: number,
    location: ColorLocation | null
  ) => {
    lineParts.push({
      lineIndex,
      text: line.slice(from, to),
      colorLocation: location,
    });
  };

  for (let iteration = 0; iteration < iterations; iteration++) {
    const location = colorLocations[colorIndex];

    if (!location) {
      if (carriageIndex !== lineLength) {
        saveLine(carriageIndex, lineLength, null);
      }

      break;
    }

    const { from, to } = location;

    if (iteration === 0) {
      const isFromZero = carriageIndex === from;

      const value = isFromZero ? to + 1 : from;

      saveLine(carriageIndex, value, to === value - 1 ? location : null);
      isFromZero ? colorIndex++ : colorIndex;
      carriageIndex = value;

      continue;
    }

    if (carriageIndex !== from) {
      saveLine(carriageIndex, from, null);
      carriageIndex = from;

      continue;
    }

    if (carriageIndex === from) {
      saveLine(carriageIndex, to, location);
      carriageIndex = to;
      colorIndex++;

      continue;
    }
  }

  return lineParts;
};
