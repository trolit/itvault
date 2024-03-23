import type { LinePart } from "@/types/LinePart";
import type { LinePartLocation } from "@/types/LinePartLocation";

export default (
  lineIndex: number,
  line: string,
  iterations: number,
  parsedColors: LinePartLocation[]
) => {
  const lineLength = line.length;

  let colorIndex = 0;
  let carriageIndex = 0;
  const lineParts: LinePart[] = [];

  const saveLine = (from: number, to: number, isColored: boolean) => {
    lineParts.push({
      lineIndex,
      location: { from, to, original: `${from}-${to}` },
      text: line.slice(from, to),
      isColored,
    });
  };

  for (let iteration = 0; iteration < iterations; iteration++) {
    const location = parsedColors[colorIndex];

    if (!location) {
      if (carriageIndex !== lineLength) {
        saveLine(carriageIndex, lineLength, false);
      }

      break;
    }

    const { from, to } = location;

    if (iteration === 0) {
      const isFromZero = carriageIndex === from;

      const value = isFromZero ? to + 1 : from;

      saveLine(carriageIndex, value, to === value - 1);
      isFromZero ? colorIndex++ : colorIndex;
      carriageIndex = value;

      continue;
    }

    if (carriageIndex !== from) {
      saveLine(carriageIndex, from, false);
      carriageIndex = from;

      continue;
    }

    if (carriageIndex === from) {
      saveLine(carriageIndex, to + 1, true);
      carriageIndex = to + 1;
      colorIndex++;

      continue;
    }
  }

  return lineParts;
};
