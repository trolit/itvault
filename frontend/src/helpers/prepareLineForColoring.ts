export default (
  line: string,
  iterations: number,
  colors: { from: number; to: number }[]
) => {
  const lineLength = line.length;

  let colorIndex = 0;
  let carriageIndex = 0;
  const parsedText: { text: string; isColored: boolean }[] = [];

  const saveLine = (from: number, to: number, isColored = false) => {
    parsedText.push({ text: line.slice(from, to), isColored });
  };

  for (let iteration = 0; iteration < iterations; iteration++) {
    const color = colors[colorIndex];

    if (!color) {
      if (carriageIndex !== lineLength) {
        saveLine(carriageIndex, lineLength);
      }

      break;
    }

    const { from, to } = color;

    if (iteration === 0) {
      const isFromZero = carriageIndex === from;

      const value = isFromZero ? to + 1 : from;

      saveLine(carriageIndex, value, to === value - 1);
      isFromZero ? colorIndex++ : colorIndex;
      carriageIndex = value;

      continue;
    }

    if (carriageIndex !== from) {
      saveLine(carriageIndex, from);
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

  return parsedText;
};
