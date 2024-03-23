import sortBy from "lodash/sortBy";

export default (line: string, colors: string[]) => {
  const parsedColors = parseColors(colors);

  const lineLength = line.length;

  let iterations = 0;
  let waitUntilColoredPosition = false;
  let recentColorIndex = -1;

  for (let index = 0; index < lineLength; index++) {
    const colorIndex = parsedColors.findIndex(
      color => index >= color.from && index <= color.to
    );

    if (~colorIndex) {
      colorIndex !== recentColorIndex ? iterations++ : iterations;

      recentColorIndex = colorIndex;
      waitUntilColoredPosition = false;
      continue;
    }

    if (!waitUntilColoredPosition) {
      iterations++;
      waitUntilColoredPosition = true;
    }
  }

  return { iterations, parsedColors };
};

function parseColors(colors: string[]) {
  const parsedColors = colors.map(color => {
    const [from, to] = color.split("-");
    return {
      from: parseInt(from),
      to: parseInt(to),
      original: color,
    };
  });

  return sortBy(parsedColors, value => value.from);
}
